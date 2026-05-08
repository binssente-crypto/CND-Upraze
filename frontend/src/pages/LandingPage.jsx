import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  LineChart,
  Box,
  Image as ImageIcon,
  QrCode,
  ArrowRight,
  ChevronDown,
  Activity,
  Zap,
  Shield,
  Rocket,
  Globe,
  Cpu,
  Layers,
  Sparkles,
  Star,
  CheckCircle2,
  CreditCard,
  Building2,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import LegalModal from '../components/LegalModal';
import PublicAIChatbot from '../components/PublicAIChatbot';
import Logo from '../components/Logo';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  MeshDistortMaterial, 
  Sphere, 
  MeshTransmissionMaterial, 
  Torus, 
  Icosahedron,
  Stars,
  Text,
  PerspectiveCamera,
  PresentationControls,
  Trail
} from '@react-three/drei';
import * as THREE from 'three';

const LoopContent = ({ curve }) => {
  const pulseRef = React.useRef();
  const createTextRef = React.useRef();
  const nurtureTextRef = React.useRef();
  const deliverTextRef = React.useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const t = (time * 0.1) % 1;
    const pos = curve.getPointAt(t);
    
    if (pulseRef.current) {
      pulseRef.current.position.copy(pos);
      
      // Orient Rocket to face the direction of travel
      const tangent = curve.getTangentAt(t);
      const targetPos = pos.clone().add(tangent);
      pulseRef.current.lookAt(targetPos);
      pulseRef.current.rotateX(Math.PI / 2); // Correct for vertical geometry orientation

      // Dynamic Color Triggers
      let currentColor = '#06b6d4';
      if (t < 0.4) currentColor = '#06b6d4';
      else if (t < 0.6) currentColor = '#f97316';
      else currentColor = '#a855f7';

      // Update Rocket Colors (Body and Engine) with safety checks
      pulseRef.current.traverse((child) => {
        if (child.name === 'rocket-body' && child.material) {
          child.material.color.set(currentColor);
          child.material.emissive.set(currentColor);
          child.material.emissiveIntensity = 0.3;
        }
        if (child.name === 'engine-light') {
          // Flickering Fire Effect
          const flicker = Math.sin(state.clock.elapsedTime * 20) * 5;
          child.intensity = 15 + flicker;
          child.color.set('#ff4500'); // Fire Orange-Red
        }
        if (child.name === 'rocket-fire' && child.material) {
          const s = 1 + Math.sin(state.clock.elapsedTime * 30) * 0.1;
          child.scale.set(s, s, s);
        }
        if (child.name === 'rocket-window' && child.material) {
          child.material.emissive.set(currentColor);
        }
      });

      // Precise Visibility Logic
      const fadeDist = 0.12;
      
      if (createTextRef.current) {
        const opacity = Math.max(0, 1 - Math.abs(t - 0.25) / fadeDist);
        createTextRef.current.fillOpacity = opacity;
        createTextRef.current.scale.setScalar(0.7 + opacity * 0.3);
      }
      
      if (nurtureTextRef.current) {
        const opacity = Math.max(0, 1 - Math.abs(t - 0.5) / fadeDist);
        nurtureTextRef.current.fillOpacity = opacity;
        nurtureTextRef.current.scale.setScalar(0.7 + opacity * 0.3);
      }
      
      if (deliverTextRef.current) {
        const opacity = Math.max(0, 1 - Math.abs(t - 0.75) / fadeDist);
        deliverTextRef.current.fillOpacity = opacity;
        deliverTextRef.current.scale.setScalar(0.7 + opacity * 0.3);
      }
    }
  });

  return (
    <React.Suspense fallback={null}>
      <PresentationControls
        enabled={false}
        global
        config={{ mass: 2, tension: 500 }}
        snap={{ mass: 4, tension: 1500 }}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 10, Math.PI / 10]}
        azimuth={[-Math.PI / 10, Math.PI / 10]}
      >
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <mesh visible={false}>
            <tubeGeometry args={[curve, 128, 0.05, 12, true]} />
            <meshStandardMaterial transparent opacity={0} />
          </mesh>

          {/* Traveling Rocket with Expansive Smoke Trail */}
          <Trail 
            width={4.5} 
            length={18} 
            color="#dddddd" 
            attenuation={(t) => Math.pow(t, 1.5)}
            target={pulseRef}
          >
            <group ref={pulseRef}>
              {/* Rocket Body */}
              <mesh name="rocket-body">
                <cylinderGeometry args={[0.1, 0.12, 0.8, 16]} />
                <meshStandardMaterial metalness={1} roughness={0.2} />
              </mesh>
              
              {/* Rocket Nose - Red Tip */}
              <mesh position={[0, 0.55, 0]}>
                <coneGeometry args={[0.1, 0.3, 16]} />
                <meshStandardMaterial color="#ff0000" metalness={0.8} roughness={0.2} />
              </mesh>

              {/* Rocket Nozzle */}
              <mesh position={[0, -0.45, 0]}>
                <cylinderGeometry args={[0.12, 0.15, 0.15, 16]} />
                <meshStandardMaterial color="#222222" metalness={1} roughness={0.5} />
              </mesh>

              {/* Fins - Red Gliders */}
              {[0, Math.PI * 2/3, Math.PI * 4/3].map((angle, i) => (
                <group key={i} rotation={[0, angle, 0]}>
                  <mesh position={[0.15, -0.3, 0]}>
                    <boxGeometry args={[0.1, 0.3, 0.02]} />
                    <meshStandardMaterial color="#ff0000" metalness={0.5} roughness={0.2} />
                  </mesh>
                </group>
              ))}

              {/* Cockpit Window */}
              <mesh name="rocket-window" position={[0, 0.2, 0.12]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshStandardMaterial emissiveIntensity={10} />
              </mesh>

              {/* Engine Fire & Light */}
              <pointLight name="engine-light" position={[0, -0.6, 0]} intensity={15} distance={8} />
              <mesh name="rocket-fire" position={[0, -0.6, 0]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial 
                  color="#ff4500" 
                  emissive="#ffcc00" 
                  emissiveIntensity={20} 
                  transparent 
                  opacity={0.8} 
                />
              </mesh>
            </group>
          </Trail>

          <group position={curve.getPointAt(0.25)}>
            <Text 
              ref={createTextRef}
              position={[0, 1.6, 0]} 
              fontSize={0.7} 
              color="#06b6d4" 
              fontWeight="900"
              fontStyle="italic"
              anchorX="center" 
              anchorY="middle"
              fillOpacity={0}
              letterSpacing={0.15}
            >
              CREATE
            </Text>
          </group>

          <group position={curve.getPointAt(0.5)}>
            <Text 
              ref={nurtureTextRef}
              position={[0, 1.6, 0]} 
              fontSize={0.7} 
              color="#f97316" 
              fontWeight="900"
              fontStyle="italic"
              anchorX="center" 
              anchorY="middle"
              fillOpacity={0}
              letterSpacing={0.15}
            >
              NURTURE
            </Text>
          </group>

          <group position={curve.getPointAt(0.75)}>
            <Text 
              ref={deliverTextRef}
              position={[0, 1.6, 0]} 
              fontSize={0.7} 
              color="#a855f7" 
              fontWeight="900"
              fontStyle="italic"
              anchorX="center" 
              anchorY="middle"
              fillOpacity={0}
              letterSpacing={0.15}
            >
              DELIVER
            </Text>
          </group>

          {[...Array(20)].map((_, i) => (
            <mesh key={i} position={[Math.random() * 12 - 6, Math.random() * 8 - 4, Math.random() * 2 - 1]}>
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.1} />
            </mesh>
          ))}
        </Float>
      </PresentationControls>
    </React.Suspense>
  );
};

const Protocol3D = () => {
  const curve = React.useMemo(() => {
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const t = (i / 64) * Math.PI * 2;
      const x = -Math.sin(t) * 3.5; 
      const y = (Math.sin(t) * Math.cos(t)) * 1.5;
      const z = 0; 
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points, true);
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [0, 0, 18], fov: 35 }}>
        <color attach="background" args={['#030303']} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <Stars radius={100} depth={50} count={600} factor={4} saturation={0} fade speed={1} />
        <LoopContent curve={curve} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <shadowMaterial transparent opacity={0.05} />
        </mesh>
      </Canvas>
    </div>
  );
};

const services = [
  {
    icon: <Bot className="w-8 h-8 text-primary-500" />,
    title: 'AI Assistance',
    desc: 'Intelligent automation that adapts to your workflow and automates repetitive tasks.',
    span: 'lg:col-span-2'
  },
  {
    icon: <LineChart className="w-8 h-8 text-blue-400" />,
    title: 'Smart Forecasting',
    desc: 'Predict future trends with high accuracy using our proprietary ML models.',
    span: 'lg:col-span-1'
  },
  {
    icon: <ImageIcon className="w-8 h-8 text-purple-400" />,
    title: 'Image Recognition',
    desc: 'Advanced object detection and visual data analysis for automated operations.',
    span: 'lg:col-span-1'
  },
  {
    icon: <Box className="w-8 h-8 text-orange-400" />,
    title: '3D Studio',
    desc: 'Interactive 3D model viewer and editor for spatial data and asset visualization.',
    span: 'lg:col-span-1'
  },
  {
    icon: <QrCode className="w-8 h-8 text-emerald-400" />,
    title: 'Quick Access',
    desc: 'Seamless QR code management for physical and digital asset tracking.',
    span: 'lg:col-span-1'
  }
];

const LandingPage = () => {
  const [legalModal, setLegalModal] = React.useState({ isOpen: false, type: 'privacy' });
  const [isPublicChatOpen, setIsPublicChatOpen] = React.useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 selection:bg-primary-500 selection:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-radial-gradient opacity-40" />
      </div>

      {/* Header */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 px-8 py-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-10 py-5 !rounded-[2rem]">
          <motion.div className="flex items-center gap-4 group cursor-pointer">
            <Logo className="h-10" />
          </motion.div>

          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
            {['About', 'Services', 'Protocol', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-12">
            <Link to="/login" className="group relative text-[13px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors pb-1">
              <span className="relative">
                Log in
                <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-primary-500/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-right" />
              </span>
            </Link>
            <Link to="/register" className="group relative bg-white text-black py-4 px-10 rounded-full text-[13px] font-black uppercase tracking-[0.2em] hover:bg-primary-500 hover:text-white transition-all shadow-2xl active:scale-95 overflow-hidden">
              <span className="relative z-10">
                Get Started
                <div className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-black group-hover:bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="absolute -bottom-2.5 left-0 w-full h-[2px] bg-black/50 group-hover:bg-white/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-right" />
              </span>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-38 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-primary-500">creating systems that changes lives for the better</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-black mb-12 leading-[0.85] tracking-tighter font-outfit uppercase"
              >
                <Logo variant="solutions" className="h-40 md:h-64" />
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl text-gray-400 max-w-xl mb-14 font-medium leading-relaxed"
              >
                Precision-engineered digital ecosystems for the next generation of enterprise scale.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center gap-6"
              >
                <Link to="/register" className="btn-primary w-full sm:w-auto !px-12 !py-5 !text-xs !font-black !uppercase !tracking-widest !rounded-2xl">
                  Launch Project
                </Link>
              </motion.div>
            </div>

            {/* Hero Image Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-primary-500/20 blur-[120px] rounded-full -z-10 group-hover:bg-primary-500/30 transition-all duration-700" />
              <div className="glass-card p-1 rounded-[3.5rem] overflow-hidden relative">
                {/* Browser Header Mockup */}
                <div className="flex items-center gap-2 px-8 py-5 bg-white/[0.02] border-b border-white/[0.05]">
                  <div className="flex gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500/30" />
                    <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/30" />
                    <div className="w-3.5 h-3.5 rounded-full bg-green-500/30" />
                  </div>
                </div>
                <motion.img
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.5 }}
                  src="/assets/business-analytics.jpg"
                  alt="Dashboard Preview"
                  className="w-full rounded-b-[3.3rem] shadow-2xl opacity-90 brightness-110"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Services Section - Bento Grid */}
      <section id="services" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight font-outfit">Core Modules</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Powerful tools built for performance, reliability, and growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className={`glass-card glass-card-hover p-10 flex flex-col relative overflow-hidden group ${service.span || ''}`}
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  {service.icon}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-8">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-8">{service.desc}</p>
                <div className="mt-auto">
                  <button 
                    onClick={() => {
                      if (service.title === 'AI Assistance') {
                        setIsPublicChatOpen(true);
                      }
                    }}
                    className="flex items-center gap-2 text-sm font-bold text-primary-500 group-hover:gap-4 transition-all"
                  >
                    Learn More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol Section */}
      <section id="protocol" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-12 tracking-tight font-outfit">Our Protocol: <span className="text-primary-500 italic">CND</span></h2>
            <div className="space-y-6">
              {[
                { l: 'C', t: 'Create', d: 'Transforming ideas into high-performance solutions.', g: 'from-blue-500 to-cyan-400' },
                { l: 'N', t: 'Nurture', d: 'Fostering growth through continuous improvement.', g: 'from-primary-500 to-orange-400' },
                { l: 'D', t: 'Deliver', d: 'Precision-engineered deployment for maximum impact.', g: 'from-purple-500 to-pink-400' }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-8 p-8 glass-card glass-card-hover relative group overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${item.g} opacity-50`} />
                  <div className={`text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br ${item.g} opacity-20 group-hover:opacity-40 transition-opacity font-outfit`}>
                    {item.l}
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-2xl font-black mb-3 font-outfit tracking-tight">{item.t}</h4>
                    <p className="text-gray-400 font-medium leading-relaxed">{item.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-square md:aspect-auto md:h-[650px] w-full glass-card p-4 rounded-[3.5rem] overflow-hidden group bg-black/40">
              <div className="absolute inset-0 bg-grid opacity-10" />
              
              {/* 3D Protocol Core - The Infinite CND Loop */}
              <div className="absolute inset-0">
                <Protocol3D />
              </div>

              {/* Decorative Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 blur-[150px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-black mb-6 font-outfit tracking-tighter"
            >
              Service <span className="text-primary-500">Packages</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-xl max-w-2xl mx-auto font-medium"
            >
              We build systems for your business. Choose between our template-based or fully custom solutions.
            </motion.p>
          </div>

          {/* Tier 1 — Prebuilt Systems */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-black font-outfit tracking-tight">Prebuilt Systems</h3>
                <p className="text-xs text-gray-500 font-medium">Template-based • Fast deployment • No branding</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {[
                { name: 'Package 1A', price: '3,500', features: ['1 Feature', 'Domain & Hosting', 'Maintenance'], count: '1 Feature' },
                { name: 'Package 1B', price: '6,500', features: ['2–3 Features', 'Domain & Hosting', 'Maintenance', 'Priority Support'], count: '2–3 Features', popular: true },
                { name: 'Package 1C', price: '12,000', features: ['4–5 Features', 'Domain & Hosting', 'Maintenance', 'Priority Support', 'Extended SLA'], count: '4–5 Features' },
              ].map((plan, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`glass-card p-10 flex flex-col relative group transition-all duration-500 ${plan.popular ? 'border-blue-500/30 bg-blue-500/[0.02]' : 'hover:bg-white/[0.03]'}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 text-white border border-white/10">Most Popular</div>
                  )}
                  
                  <div className="mb-8">
                    <h3 className="text-2xl font-black mb-2 font-outfit tracking-tight">{plan.name}</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg text-blue-400 bg-blue-500/10 border border-blue-500/20">{plan.count}</span>
                    <div className="flex items-baseline gap-2 mt-6">
                      <span className="text-5xl font-black font-outfit tracking-tighter">₱{plan.price}</span>
                      <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">/ month</span>
                    </div>
                  </div>

                  <div className="space-y-5 flex-1 mb-10">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-4 text-gray-400 font-medium">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/register" className={`btn-primary w-full !rounded-2xl !py-5 font-black tracking-widest text-xs uppercase text-center ${
                      !plan.popular && 'bg-white/[0.05] hover:bg-white/[0.08] text-white border border-white/10 shadow-none'
                  }`}>
                    Get Started
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tier 2 — Custom Systems */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8 mt-16">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <h3 className="text-lg font-black font-outfit tracking-tight">Custom Systems</h3>
                <p className="text-xs text-gray-500 font-medium">Full customization • Full branding • Bespoke design</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl pt-6">
              {[
                { name: 'Package 2A', price: '22,000', features: ['Full Customization', '2–3 Features', 'Full Branding Suite', 'Domain & Hosting', 'Maintenance'], count: '2–3 Features' },
                { name: 'Package 2B', price: '40,000', features: ['Full Customization', '4–5 Features', 'Full Branding Suite', 'Image Recognition', 'Domain & Hosting', 'Dedicated Manager'], count: '4–5 Features', popular: true },
              ].map((plan, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`glass-card p-10 flex flex-col relative group transition-all duration-500 ${plan.popular ? 'border-primary-500/30 bg-primary-500/[0.02]' : 'hover:bg-white/[0.03]'}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-orange-400 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 text-white border border-white/10">Premium</div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-2xl font-black mb-2 font-outfit tracking-tight">{plan.name}</h3>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg text-primary-500 bg-primary-500/10 border border-primary-500/20">{plan.count}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg text-purple-400 bg-purple-500/10 border border-purple-500/20">Full Branding</span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-6">
                      <span className="text-5xl font-black font-outfit tracking-tighter">₱{plan.price}</span>
                      <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">/ month</span>
                    </div>
                  </div>

                  <div className="space-y-5 flex-1 mb-10">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-4 text-gray-400 font-medium">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/register" className={`btn-primary w-full !rounded-2xl !py-5 font-black tracking-widest text-xs uppercase text-center ${
                      !plan.popular && 'bg-white/[0.05] hover:bg-white/[0.08] text-white border border-white/10 shadow-none'
                  }`}>
                    Get Started
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-12 pb-6 px-8 relative overflow-hidden bg-white/[0.01]">
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-primary-500/5 blur-[150px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-8">
            <div className="max-w-md">
              <Logo variant="footer" className="h-32 mb-6" />
              <p className="text-gray-500 font-medium leading-relaxed mb-6 text-sm max-w-xs">
                Empowering the next generation of digital infrastructure. Built for scale, security, and speed.
              </p>
              <div className="flex gap-3">
                {[Globe, Cpu, Layers].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 transition-all group">
                    <Icon className="w-4 h-4 text-gray-500 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 lg:gap-20">
              {[
                { t: 'System', l: ['Features', 'API', 'Docs', 'Status'] },
                { t: 'Social', l: ['Twitter', 'Github', 'Discord', 'LinkedIn'] }
              ].map((c, i) => (
                <div key={i} className="group">
                  <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white mb-4">{c.t}</h4>
                  <ul className="space-y-1">
                    {c.l.map(link => (
                      <li key={link}><a href="#" className="text-base font-medium text-gray-500 hover:text-white transition-colors">{link}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">
              © 2026 CND UPRAZE SOLUTIONS. ALL RIGHTS RESERVED.
            </div>
            <div className="flex gap-8">
              <button 
                onClick={() => setLegalModal({ isOpen: true, type: 'privacy' })}
                className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => setLegalModal({ isOpen: true, type: 'terms' })}
                className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] hover:text-white transition-colors"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>

      <LegalModal
        isOpen={legalModal.isOpen}
        type={legalModal.type}
        onClose={() => setLegalModal({ ...legalModal, isOpen: false })}
      />
      <PublicAIChatbot 
        isOpen={isPublicChatOpen} 
        onClose={() => setIsPublicChatOpen(false)} 
      />
    </div>
  );
};

export default LandingPage;

