'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const VerticalSlider = ({ value, onChange, title }) => {
  return (
    <div className="flex flex-col items-center h-64">
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-full appearance-none bg-gray-200 rounded-full outline-none opacity-70 transition-opacity duration-200 ease-in-out hover:opacity-100"
        style={{
          WebkitAppearance: 'slider-vertical',
          width: '8px',
          padding: '0 5px',
        }}
      />
      <style jsx>{`
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
      `}</style>
      <span className="mt-2 text-sm font-medium text-gray-700">{title}</span>
    </div>
  );
};

const HyperbolicDiffusionApp = () => {
  const [sliderValues, setSliderValues] = useState([50, 50, 50, 50, 50]);
  const [textboxContent, setTextboxContent] = useState('');
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Here you would add your functions to draw figures on the Poincare disk model
    // For now, we'll just draw a simple circle as a placeholder
    ctx.beginPath();
    ctx.arc(150, 150, 100, 0, 2 * Math.PI);
    ctx.strokeStyle = 'blue';
    ctx.stroke();
  }, []);

  const handleSliderChange = (index, value) => {
    const newValues = [...sliderValues];
    newValues[index] = value;
    setSliderValues(newValues);
  };

  const handleGenerate = () => {
    // Here you would implement the logic to generate the image based on the canvas
    // For now, we'll just copy the canvas to the image as a placeholder
    const canvas = canvasRef.current;
    const image = imageRef.current;
    image.src = canvas.toDataURL();
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <div className="flex w-full max-w-4xl justify-between mb-4">
        <canvas ref={canvasRef} width={400} height={300} className="border border-gray-300 bg-white shadow-md" />
        <div className="w-[400px] h-[300px] border border-gray-300 bg-white shadow-md overflow-hidden">
          <img ref={imageRef} alt="Generated Image" className="w-full h-full object-contain" />
        </div>
      </div>
      <div className="w-full max-w-5xl flex justify-between mb-4">
        {sliderValues.map((value, index) => (
          <VerticalSlider
            key={index}
            value={value}
            onChange={(newValue) => handleSliderChange(index, newValue)}
            title={`Slider ${index + 1}`}
          />
        ))}
      </div>
      <div className="w-full max-w-4xl grid grid-cols-5 gap-4 mb-4">
        {sliderValues.map((value, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="mb-2 text-sm font-medium text-gray-700">Slider {index + 1}</span>
            <Slider
              value={[value]}
              onValueChange={(newValue) => handleSliderChange(index, newValue[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        ))}
      </div>
      <Textarea
        value={textboxContent}
        onChange={(e) => setTextboxContent(e.target.value)}
        placeholder="Enter text here..."
        className="w-full max-w-4xl mb-4 p-2 border border-gray-300 bg-gray-50 rounded shadow-sm focus:ring-2" // focus:ring-blue-500 focus:border-blue-500"
      />
      <Button onClick={handleGenerate} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
        Generate
      </Button>
    </div>
  );
};

export default HyperbolicDiffusionApp;
