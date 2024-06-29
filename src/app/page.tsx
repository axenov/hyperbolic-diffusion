import React from 'react';
import HyperbolicDiffusionApp from '../components/hyperbolicDiffusionApp';
import Head from "next/head";

  
function HyperbolicGeometryPage() {
  return (
    <div className="container mx-auto p-1 text-center">
      <Head>
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-2xl font-bold mb-4">Hyperbolic Diffusion</h1>
      <HyperbolicDiffusionApp />
    </div>
    // <div className="container mx-auto p-4 text-center">
  );
}

export default HyperbolicGeometryPage;