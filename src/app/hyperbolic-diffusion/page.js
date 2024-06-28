import React from 'react';
import HyperbolicDiffusionApp from '../../components/HyperbolicGeometryApp';

function HyperbolicGeometryPage() {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Hyperbolic Diffusion</h1>
      <HyperbolicDiffusionApp />
    </div>
  );
}

export default HyperbolicGeometryPage;