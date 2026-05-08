import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { Box, Layers, RotateCw, Maximize2, FileCode, Info, Minimize2 } from 'lucide-react';
import { motion } from 'framer-motion';

const MockModel = ({ index, rotation, scale, elevation }) => {
  return (
    <group position={[0, elevation - 1, 0]}>
      <mesh 
        rotation={[0, rotation * Math.PI * 2, 0]} 
        scale={[scale, scale, scale]}
      >
        {index === 0 ? (
          <boxGeometry args={[2, 2, 2]} />
        ) : (
          <sphereGeometry args={[1.2, 32, 32]} />
        )}
        <meshStandardMaterial 
          color={index === 0 ? "#10b981" : "#3b82f6"} 
          metalness={0.6} 
          roughness={0.2} 
        />
      </mesh>
    </group>
  );
};

const demoModels = [
  { name: 'Product_Demo.glb', size: '2.4 MB', status: 'ACTIVE' },
  { name: 'Prototype_V2.glb', size: '5.1 MB', status: 'READY' },
];

const ThreeDManipulation = () => {
  const [activeModelIndex, setActiveModelIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef(null);
  const [transform, setTransform] = useState({
    position: 1.0,
    rotation: 0.25,
    scale: 1.0
  });

  const handleTransformChange = (key, value) => {
    setTransform(prev => ({ ...prev, [key]: parseFloat(value) }));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change events (like Esc key)
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="space-y-6">
      {/* Demo Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-5 bg-blue-500/5 border border-blue-500/15 rounded-2xl"
      >
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
          <Info className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-blue-300 font-bold">Interactive 3D Viewer Demo</p>
          <p className="text-xs text-gray-500">Drag to rotate, scroll to zoom. Use the sliders to manipulate the geometry.</p>
        </div>
      </motion.div>

      <div className="h-[calc(100vh-14rem)] grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-bold flex items-center gap-2 mb-6"><Layers className="w-5 h-5 text-primary-500" /> Demo Models</h3>
            <div className="space-y-3">
              {demoModels.map((model, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveModelIndex(i)}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all ${
                    activeModelIndex === i 
                      ? 'bg-primary-500/20 border border-primary-500/40 shadow-lg shadow-primary-500/10' 
                      : 'bg-white/[0.02] border border-dark-border hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${activeModelIndex === i ? 'bg-primary-500/20' : 'bg-dark-bg'}`}>
                      <FileCode className={`w-3.5 h-3.5 ${activeModelIndex === i ? 'text-primary-500' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <span className={`text-[13px] font-bold block ${activeModelIndex === i ? 'text-white' : 'text-gray-400'}`}>{model.name}</span>
                      <span className="text-[9px] text-gray-500 font-medium">{model.size}</span>
                    </div>
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${activeModelIndex === i ? 'text-primary-500' : 'text-gray-600'}`}>
                    {activeModelIndex === i ? 'ACTIVE' : 'READY'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-xs font-bold flex items-center gap-2 mb-5"><RotateCw className="w-4 h-4 text-primary-500" /> Transform</h3>
            <div className="space-y-5">
              {[
                { id: 'position', label: 'Elevation', min: 0.5, max: 1.5, step: 0.05 },
                { id: 'rotation', label: 'Rotation', min: 0, max: 1, step: 0.01 },
                { id: 'scale', label: 'Scale', min: 0.5, max: 2, step: 0.1 },
              ].map((t) => (
                <div key={t.id} className="space-y-3">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-gray-500">
                    <span>{t.label}</span>
                    <span className="text-primary-500 font-outfit">{transform[t.id].toFixed(1)}</span>
                  </div>
                  <input 
                    type="range" 
                    min={t.min}
                    max={t.max}
                    step={t.step}
                    value={transform[t.id]}
                    onChange={(e) => handleTransformChange(t.id, e.target.value)}
                    className="w-full accent-primary-500 h-1 bg-dark-border rounded-full appearance-none cursor-pointer" 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Viewer */}
        <div 
          ref={viewerRef}
          className="lg:col-span-3 glass-card relative bg-gradient-to-b from-dark-card to-dark-bg p-0 border-primary-500/10 shadow-[inner_0_0_100px_rgba(34,197,94,0.05)] overflow-hidden"
        >
          <div className="absolute top-6 left-6 z-10 flex gap-2">
            <button 
              onClick={toggleFullscreen}
              className="p-2 bg-dark-bg/80 backdrop-blur rounded-lg border border-dark-border hover:border-primary-500/50 transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>

          <div className="w-full h-full">
            <Canvas shadows dpr={[1, 2]} camera={{ position: [5, 5, 5], fov: 45 }}>
              <Suspense fallback={null}>
                <Stage 
                  environment="city" 
                  intensity={0.5} 
                  contactShadow={{ opacity: 0.7, blur: 2 }}
                  adjustCamera={false}
                >
                  <MockModel 
                    index={activeModelIndex}
                    rotation={transform.rotation} 
                    scale={transform.scale} 
                    elevation={transform.position}
                  />
                </Stage>
              </Suspense>
              <OrbitControls makeDefault />
            </Canvas>
          </div>

          <div className={`absolute bottom-6 right-6 bg-dark-bg/80 backdrop-blur border border-dark-border rounded-xl font-bold transition-all duration-500 ${
            isFullscreen ? 'p-8 text-sm space-y-3 min-w-[200px]' : 'p-4 text-[10px] space-y-1'
          }`}>
            <p className={`text-gray-500 uppercase tracking-widest font-black mb-1 ${isFullscreen ? 'text-xs' : ''}`}>Renderer Stats</p>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">Vertices</span>
              <span className="text-white">1,482</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400">FPS</span>
              <span className="text-emerald-400">60.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDManipulation;
