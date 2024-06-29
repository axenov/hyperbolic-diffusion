'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import * as HyperbolicMath from '@/components/hyperbolicMath';
import { HyperbolicDrawler } from '@/components/hyperbolicDrawing';

const max_slider_value = 50;

interface VerticalSliderProps {
  value: number;
  onChange: (value: number) => void;
  title: string;
}
const VerticalSlider: React.FC<VerticalSliderProps> = ({ value, onChange, title }) => {
  return (
    <div className="flex flex-col items-center h-64">
      <input
        type="range"
        min="0"
        max={max_slider_value}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-full appearance-none bg-gray-200 rounded-full outline-none opacity-70 transition-opacity duration-200 ease-in-out hover:opacity-100"
        style={{
          writingMode: "vertical-lr",
          direction: "rtl",
          width: '8px',
          padding: '0 5px',
        }}
      />
      {/* This changes style of the slider thumb */}
      {/* <style jsx>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #4CAF50, #1E88E5);
          cursor: pointer;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3), 0 0 10px rgba(76, 175, 80, 0.5);
        }
        input[type=range]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #4CAF50, #1E88E5);
          cursor: pointer;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.3), 0 0 10px rgba(76, 175, 80, 0.5);
        }
      `}</style> */}
      <style jsx>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: 
          cursor: pointer;
        }
        input[type=range]::-moz-range-thumb {
          cursor: pointer;
        }
      `}</style>
      <span className="mt-2 text-sm font-medium text-gray-700">{title}</span>
    </div>
  );
};

const HyperbolicDiffusionApp: React.FC = () => {
  const defaultsliderValues = [max_slider_value/2, max_slider_value/16, 0, 0, 0, 0, 0];
  const [sliderValues, setSliderValues] = useState<number[]>(defaultsliderValues);
  const [sliderTitles, setSliderTitles] = useState<string[]>(['Angle', 'Frequency', 'Circles', 'Parallels', 'Horocycles', 'Perpendiculars', 'Equidistants']);
  const titleIndexMap: { [key: string]: number } = sliderTitles.map((_, i) => ({ [sliderTitles[i]]: i })).reduce((acc, obj) => ({ ...acc, ...obj }), {});
  
  const [textboxContent, setTextboxContent] = useState<string>('');
  const [drawColor, setDrawColor] = useState<string>('#05AD05'); // Default color: green

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);  

  useEffect(() => {
    let hyperbolicDrawler = new HyperbolicDrawler(canvasRef);

    hyperbolicDrawler.clearCanvas()
    let image = imageRef.current;
    if (image) {
      image.src = '/escher.webp';
    }
    hyperbolicDrawler.setEmptyPoincareDisk();
  }, []);


  const handleClear = () => {
    let hyperbolicDrawler = new HyperbolicDrawler(canvasRef);
    hyperbolicDrawler.clearCanvas()
    hyperbolicDrawler.setEmptyPoincareDisk();

    let image = imageRef.current;
    if (image) {
      image.src = '/white.png';
    }

    setSliderValues(defaultsliderValues);
  };


  const drawHyperbolicPatterns = (sliderValues: number[]) => {
    let hyperbolicDrawler = new HyperbolicDrawler(canvasRef);
    hyperbolicDrawler.setEmptyPoincareDisk();

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = 1;

        let angle = 0

        // Draw hyperbolic circles
        if (sliderValues[titleIndexMap["Circles"]] > 0 && sliderValues[titleIndexMap["Frequency"]] > 0) {
          hyperbolicDrawler.handleCircleSeriesDrawing(sliderValues[titleIndexMap["Circles"]], 0.05, 10.0)
        }
        let frequency = Math.round(sliderValues[titleIndexMap["Frequency"]]/50*16);
        for (let i = 0; i < frequency; i++) {
          angle = sliderValues[titleIndexMap["Angle"]] * 360/max_slider_value+90 + i * 360 / frequency;
          // Draw hyperbolic parallel lines
          if (sliderValues[titleIndexMap["Parallels"]] > 0) {
            hyperbolicDrawler.createParallels(sliderValues[titleIndexMap["Parallels"]], HyperbolicMath.degrees2Radians(angle));
          }
          // Draw hyperbolic perpendicular linxes
          if (sliderValues[titleIndexMap["Perpendiculars"]] > 0) {
            hyperbolicDrawler.createPerpendiculars(sliderValues[titleIndexMap["Perpendiculars"]], HyperbolicMath.degrees2Radians(angle));
          }
          // Draw hyperbolic holocycles
          if (sliderValues[titleIndexMap["Horocycles"]] > 0) {
            hyperbolicDrawler.createOricycle(sliderValues[titleIndexMap["Horocycles"]], HyperbolicMath.degrees2Radians(angle))
          }
          // Draw hyperbolic equidistant lines
          if (sliderValues[titleIndexMap["Equidistants"]] > 0) {
            hyperbolicDrawler.createEquidistants(sliderValues[titleIndexMap["Equidistants"]], HyperbolicMath.degrees2Radians(angle))
          }
          
        }

      }
    }
  };


  const handleSliderChange = (index: number, value: number) => {
    const newValues = [...sliderValues];
    newValues[index] = value;
    setSliderValues(newValues);
    drawHyperbolicPatterns(newValues);
  };


  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDrawColor(e.target.value);
    drawHyperbolicPatterns(sliderValues);
  };


  const handleGenerate = () => {
    // Here you would implement the logic to generate the image based on the canvas
    // For now, we'll just set the image to a placeholder
    const image = imageRef.current;
    if (image) {
      image.src = '/escher.webp';
    }
  };


  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'image.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  }


  const randomizeSliders = () => {
    let newValues = [...sliderValues];
    for (let i = 0; i < newValues.length; i++) {
      newValues[i] = Math.floor(Math.random() * (max_slider_value + 1));
    }
    // If it is frequency, it should be minimum max_slider_value/16
    newValues[titleIndexMap["Frequency"]] = Math.max(newValues[titleIndexMap["Frequency"]], max_slider_value/16);
    setSliderValues(newValues);
    drawHyperbolicPatterns(newValues);
  }


  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <div className="flex w-full max-w-4xl justify-between mb-4">
        <canvas ref={canvasRef} width={1024} height={1024} className="border border-gray-300 bg-white shadow-md" style={{width: `400px`, height: `400px`}} /> 

        <div className="w-[400px] h-[400px] border border-gray-300 bg-white shadow-md overflow-hidden">
          <img ref={imageRef} alt="Generated Image" className="w-full h-full object-contain" />
        </div>
      </div>
      <div className="w-full max-w-4xl flex justify-between mb-4">
        {sliderValues.map((value, index) => (
          <VerticalSlider
            key={index}
            value={value}
            onChange={(newValue) => handleSliderChange(index, newValue)}
            title={sliderTitles[index]}
          />
        ))}
      </div>
      <div className="w-full max-w-4xl flex justify-between items-center mb-4">
        <Textarea
          value={textboxContent}
          onChange={(e) => setTextboxContent(e.target.value)}
          placeholder="Enter prompt here..."
          className="w-full max-w-3xl mr-4 p-2 border border-gray-300 bg-gray-50 rounded shadow-sm focus:ring-2"
        />
        <div className="flex flex-col items-center">
          <input
            type="color"
            value={drawColor}
            onChange={handleColorChange}
            className="w-12 h-12 border-none cursor-pointer"
          />
          <span className="mt-2 text-sm font-medium text-gray-700">Color</span>
        </div>
      </div>
      <div className="flex justify-center w-full max-w-4xl mb-4">
        <Button onClick={handleGenerate} className="px-4 py-2 mr-10 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Generate
        </Button>
        <Button onClick={handleClear} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
          Clear
        </Button>
        <Button onClick={saveCanvas} className="px-4 py-2 ml-10 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
          Save
        </Button>
        <button onClick={randomizeSliders} className="px-4 py-2 ml-10 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors">
          Randomize
        </button>
      </div>
    </div>
  );
};

export default HyperbolicDiffusionApp;