import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const SERVER_ADDRESS = 'localhost:8188';

export async function POST(request: NextRequest) {
  console.log('Processing image...');
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const prompt = formData.get('prompt') as string;

    if (!image || !prompt) {
      return NextResponse.json({ error: 'Missing image or prompt' }, { status: 400 });
    }

    const clientId = uuidv4();
    const tempFilePath = await saveTempFile(image);
    
    // Upload image to ComfyUI
    await uploadImage(tempFilePath, 'input.png', SERVER_ADDRESS);

    // Load workflow and prepare prompt
    const workflow = await loadWorkflow('./public/comfyui_workflow.json');
    const preparedPrompt = preparePrompt(workflow, 'input.png', prompt);

    // Queue prompt and get result
    const ws = new WebSocket(`ws://${SERVER_ADDRESS}/ws?clientId=${clientId}`);
    const promptId = await queuePrompt(preparedPrompt, clientId, SERVER_ADDRESS);
    const outputImage = await trackProgressAndGetResult(ws, promptId, SERVER_ADDRESS);

    // Clean up temp file
    await fs.unlink(tempFilePath);

    return NextResponse.json({ imageUrl: outputImage });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}

async function saveTempFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const tempFilePath = path.join(os.tmpdir(), `${uuidv4()}-${file.name}`);
  await fs.writeFile(tempFilePath, buffer);
  return tempFilePath;
}

async function uploadImage(filePath: string, fileName: string, serverAddress: string): Promise<void> {
  const formData = new FormData();
  formData.append('image', new Blob([await fs.readFile(filePath)]), fileName);
  formData.append('type', 'input');
  formData.append('overwrite', 'true');

  await axios.post(`http://${serverAddress}/upload/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

async function loadWorkflow(workflowPath: string): Promise<any> {
  const workflowContent = await fs.readFile(workflowPath, 'utf-8');
  return JSON.parse(workflowContent);
}

function preparePrompt(workflow: any, inputImage: string, promptText: string): any {
  const prompt = JSON.parse(JSON.stringify(workflow));
  const idToClassType = Object.fromEntries(
    Object.entries(prompt).map(([id, details]: [string, any]) => [id, details.class_type])
  );

  const kSampler = Object.keys(idToClassType).find(key => idToClassType[key] === 'KSampler');
  if (kSampler) {
    prompt[kSampler].inputs.seed = Math.floor(Math.random() * (10**15 - 10**14) + 10**14);
    const positiveInputId = prompt[kSampler].inputs.positive[0];
    prompt[positiveInputId].inputs.text = promptText;

    const negativeInputId = prompt[kSampler].inputs.negative[0];
    prompt[negativeInputId].inputs.text = "low contrast, plain, simple, monochrome"
  }

  const imageLoader = Object.keys(idToClassType).find(key => idToClassType[key] === 'LoadImage');
  if (imageLoader) {
    prompt[imageLoader].inputs.image = inputImage;
  }

  return prompt;
}

async function queuePrompt(prompt: any, clientId: string, serverAddress: string): Promise<string> {
  const response = await axios.post(`http://${serverAddress}/prompt`, {
    prompt,
    client_id: clientId,
  });
  return response.data.prompt_id;
}

async function trackProgressAndGetResult(ws: WebSocket, promptId: string, serverAddress: string): Promise<string> {
  return new Promise((resolve, reject) => {
    ws.on('message', async (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === 'executing' && message.data.node === null && message.data.prompt_id === promptId) {
        const history = await getHistory(promptId, serverAddress);
        const outputImage = await getOutputImage(history[promptId], serverAddress);
        resolve(outputImage);
        ws.close();
      }
    });

    ws.on('error', (error) => {
      reject(error);
    });
  });
}

async function getHistory(promptId: string, serverAddress: string): Promise<any> {
  const response = await axios.get(`http://${serverAddress}/history/${promptId}`);
  return response.data;
}

async function getOutputImage(history: any, serverAddress: string): Promise<string> {
  for (const nodeId in history.outputs) {
    const nodeOutput = history.outputs[nodeId];
    if (nodeOutput.images) {
      for (const image of nodeOutput.images) {
        if (image.type === 'output') {
          const imageData = await getImage(image.filename, image.subfolder, image.type, serverAddress);
          return `data:image/png;base64,${imageData.toString('base64')}`;
        }
      }
    }
  }
  throw new Error('No output image found in history');
}

async function getImage(filename: string, subfolder: string, type: string, serverAddress: string): Promise<Buffer> {
  const response = await axios.get(`http://${serverAddress}/view`, {
    params: { filename, subfolder, type },
    responseType: 'arraybuffer',
  });
  return Buffer.from(response.data);
}