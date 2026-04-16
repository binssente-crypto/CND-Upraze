import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment } from '@react-three/drei';
import { Box, Layers, RotateCw, Maximize2, FileCode } from 'lucide-react';

const MockModel = () => {
  return (
    <mesh rotation={[45, 45, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#22c55e" metalness={0.5} roughness={0.2} />
    </mesh>
  );
};

const ThreeDManipulation = () => {
  return (
    <div className="h-[calc(100vh-10rem)] grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Controls */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-card p-6">
           <h3 className="font-bold flex items-center gap-2 mb-6"><Layers className="w-5 h-5 text-primary-500" /> Active Models</h3>
           <div className="space-y-3">
              <div className="p-4 bg-primary-600/10 border border-primary-500/20 rounded-xl flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-dark-bg rounded-lg"><FileCode className="w-4 h-4 text-primary-500" /></div>
                    <span className="text-sm font-medium">Product_A.glb</span>
                 </div>
                 <span className="text-[10px] font-bold text-primary-500">SELECTED</span>
              </div>
              <button className="w-full py-3 border border-dark-border border-dashed rounded-xl text-xs text-gray-500 hover:text-white hover:border-gray-500 transition-all">+ Upload GLB/OBJ</button>
           </div>
        </div>

        <div className="glass-card p-6">
           <h3 className="font-bold flex items-center gap-2 mb-6"><RotateCw className="w-5 h-5 text-primary-500" /> Transform</h3>
           <div className="space-y-6">
              {['Position', 'Rotation', 'Scale'].map((label) => (
                <div key={label} className="space-y-4">
                   <div className="flex justify-between text-xs font-medium text-gray-400">
                      <span>{label}</span>
                      <span className="text-primary-500">1.0</span>
                   </div>
                   <input type="range" className="w-full accent-primary-500 h-1 bg-dark-border rounded-full appearance-none cursor-pointer" />
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Viewer */}
      <div className="lg:col-span-3 glass-card relative bg-gradient-to-b from-dark-card to-dark-bg p-0 border-primary-500/10 shadow-[inner_0_0_100px_rgba(34,197,94,0.05)] overflow-hidden">
        <div className="absolute top-6 left-6 z-10 flex gap-2">
           <button className="p-2 bg-dark-bg/80 backdrop-blur rounded-lg border border-dark-border hover:border-primary-500/50 transition-colors"><Maximize2 className="w-5 h-5" /></button>
        </div>

        <div className="w-full h-full">
           <Canvas shadows dpr={[1, 2]} camera={{ fov: 45 }}>
              <Suspense fallback={null}>
                 <Stage environment="city" intensity={0.5} contactShadow={{ opacity: 0.7, blur: 2 }}>
                    <MockModel />
                 </Stage>
              </Suspense>
              <OrbitControls makeDefault />
           </Canvas>
        </div>

        <div className="absolute bottom-6 right-6 bg-dark-bg/80 backdrop-blur p-4 border border-dark-border rounded-xl text-xs space-y-1">
           <p className="text-gray-400 uppercase tracking-widest font-bold">Renderer Stats</p>
           <p>Vertices: 1,482</p>
           <p>FPS: 60.0</p>
        </div>
      </div>
    </div>
  );
};

export default ThreeDManipulation;
