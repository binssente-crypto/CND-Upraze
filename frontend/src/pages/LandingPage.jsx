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
  Rocket
} from 'lucide-react';
import { motion } from 'framer-motion';
import LegalModal from '../components/LegalModal';

const services = [
  { icon: <Bot className="w-10 h-10" />, title: 'AI ASSISTANCE', desc: 'An intelligent system that automates tasks, enhances decision making, and adapts to user needs.' },
  { icon: <LineChart className="w-10 h-10" />, title: 'FORECASTING', desc: 'A powerful module to help in predicting future trends and data.' },
  { icon: <Box className="w-10 h-10" />, title: '3D MANIPULATION', desc: 'A dynamic tool that allows interactive viewing, editing, and control of 3D models.' },
  { icon: <ImageIcon className="w-10 h-10" />, title: 'IMAGE RECOGNITION', desc: 'A smart feature that identifies images to an existing repository.' },
  { icon: <QrCode className="w-10 h-10" />, title: 'QR CODE ACCESS', desc: 'A quick access and convenient way to access activities.' }
];

const LandingPage = () => {
  const [legalModal, setLegalModal] = React.useState({ isOpen: false, type: 'privacy' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const hoverScale = {
    hover: { scale: 1.05, transition: { duration: 0.15 } },
    tap: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-white text-dark-bg font-inter selection:bg-primary-500 selection:text-white">
      {/* Header - As per 3.jpg */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 w-full bg-[#1a1a1a] text-white z-50 h-20 px-12 border-b border-white/5 font-space select-none"
      >
        <div className="max-w-[1400px] h-full mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="text-3xl font-black tracking-tighter">CND</div>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden md:flex items-center gap-12 text-sm font-medium tracking-wide"
          >
            {['home', 'about', 'services', 'contact'].map((item) => (
              <motion.a 
                key={item}
                variants={itemVariants}
                href={`#${item}`} 
                className="hover:text-primary-500 transition-colors capitalize"
              >
                {item}
              </motion.a>
            ))}
            <motion.div 
              variants={itemVariants}
              className="group relative flex items-center gap-1 cursor-pointer hover:text-primary-500 transition-colors"
            >
              Profile <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link to="/register" className="bg-primary-500 hover:bg-primary-600 px-6 py-2.5 rounded-full text-white font-bold text-sm transition-all shadow-lg active:scale-95">
              Get Started
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section - As per 3.jpg & 4.jpg */}
      <section id="home" className="pt-40 pb-20 px-12 max-w-[1400px] mx-auto font-space">
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-40">
          <motion.div
            initial={{ opacity: 0, x: -50, rotate: -2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="rounded-[3rem] overflow-hidden shadow-2xl h-[350px] bg-gray-100"
          >
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.15 }}
              src="/assets/team-collaboration.jpg"
              className="w-full h-full object-cover"
              alt="Team collaboration"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h1 className="text-4xl font-extrabold mb-8 leading-[1.25]">
              <span className="text-primary-500">CND Upraze Solutions</span> creates smart, scalable systems designed to adapt to the evolving needs of modern businesses.
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-xl font-inter">
              We focus on building flexible digital solutions that streamline operations, improve efficiency, and support long-term growth in a fast-changing environment.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-3xl font-extrabold mb-8 leading-relaxed">
              Our services are fully customizable to match your business needs.
            </h2>
            <p className="text-md text-gray-500 leading-relaxed mb-8 font-inter">
              We provide web based systems that you can access anytime from any browser, giving you full control and flexibility. With our subscription model, you enjoy continuous updates, support, and scalable solutions that make every investment worth every cent.
            </p>
            <motion.button 
              whileHover={{ x: 10 }}
              className="flex items-center gap-3 text-primary-500 font-bold group"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View All Modules <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 rounded-[3rem] overflow-hidden shadow-2xl h-[350px] bg-gray-100"
          >
            <motion.img
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.15 }}
              src="/assets/business-analytics.jpg"
              className="w-full h-full object-cover"
              alt="Business analytics"
            />
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section (Orange) - As per 5.jpg & 6.jpg */}
      <section id="about" className="bg-primary-500 py-16 px-12 overflow-hidden">
        <div className="max-w-[1400px] mx-auto text-white">
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-right mb-12"
          >
            <h2 className="text-4xl font-black uppercase tracking-tight">OUR MISSION AND VISION</h2>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            <motion.div variants={itemVariants} className="bg-[#1a1a1a] p-8 rounded-[2rem] shadow-xl">
              <h3 className="text-4xl font-black text-primary-500 mb-8">Mission</h3>
              <p className="text-xl leading-relaxed text-gray-300">
                Our mission is to empower individuals to make smarter and more informed decisions through the use of intuitive AI-powered tools and solutions that simplify everyday planning, creativity, and organization.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-[#1a1a1a] p-8 rounded-[2rem] shadow-xl">
              <h3 className="text-3xl font-black text-primary-500 mb-6 text-right">Vision</h3>
              <p className="text-xl leading-relaxed text-gray-300 text-right">
                Our vision is to become the leading platform for intelligent and AI-powered guidance, where technology and creativity come together to inspire smarter and more fulfilling lives.
              </p>
            </motion.div>
          </motion.div>

          <div className="space-y-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-black uppercase italic"
            >
              OUR CND PROTOCOL
            </motion.h2>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {[
                { title: 'CREATE', desc: 'We prioritize creativity and innovative thinking, transforming ideas into solutions that inspire and make a difference.' },
                { title: 'NURTURE', desc: 'We nurture growth and collaboration, allowing our team, our users, and our ideas to flourish.' },
                { title: 'DELIVER', desc: 'We develop through innovation and improvement, pushing the boundaries of what is possible.' }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, backgroundColor: "#222", transition: { duration: 0.15, ease: "easeOut" } }}
                  className="bg-[#1a1a1a] p-8 rounded-[1.5rem] border border-white/5 hover:border-white/20 group cursor-default"
                >
                  <h4 className="text-2xl font-black text-primary-500 mb-4">{item.title}</h4>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section (Pills) - As per 7.jpg */}
      <section id="services" className="py-20 px-12 text-center bg-white font-space">
        <div className="max-w-[1400px] mx-auto">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-black uppercase mb-16 tracking-tighter"
          >
            OUR SERVICES
          </motion.h2>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {services.map((service, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                className="bg-primary-500 p-6 pt-8 pb-8 rounded-[3rem] flex flex-col items-center justify-center text-white shadow-xl hover:shadow-primary-500/30 cursor-default h-[300px]"
              >
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                  className="mb-8 bg-white/20 p-4 rounded-3xl backdrop-blur-md"
                >
                  {React.cloneElement(service.icon, { className: 'w-10 h-10' })}
                </motion.div>
                <h4 className="text-md font-black leading-tight mb-4 uppercase tracking-tighter text-center px-2">{service.title}</h4>
                <p className="text-xs font-medium leading-relaxed opacity-90 px-4 line-clamp-5 font-inter text-center">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Work With Us Section (Horizontal Pills) - As per 8.jpg */}
      <section className="bg-[#1a1a1a] py-20 px-12 text-center font-space overflow-hidden">
        <div className="max-w-[1400px] mx-auto text-white">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black uppercase mb-16 tracking-tighter"
          >
            WHY WORK WITH US?
          </motion.h2>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            {[
              { title: 'STRONG BRANDING AND IDENTITY', desc: 'We don\'t just build systems, we craft experiences that reflect your brand\'s personality and values. Every design, interaction, and solution is carefully shaped to make your business memorable, recognizable, and trusted by your audience.' },
              { title: 'COLLABORATION AND COMMUNICATION', desc: 'We believe great results come from clear communication. From start to finish, we keep you fully informed, involved, and aligned with every decision. No confusion, just smooth, transparent collaboration that ensures your vision becomes reality.' },
              { title: 'ORGANIZED DEVELOPMENT', desc: 'Our approach to development is thorough and methodical. Every project is carefully planned, meticulously executed, and constantly refined to meet your exact needs. The result is reliable, efficient, and scalable systems built with precision and attention to every detail.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
                className="bg-primary-500 p-6 rounded-[2rem] flex flex-col items-center justify-center text-[#1a1a1a] shadow-2xl"
              >
                <h4 className="text-lg font-black mb-2">{item.title}</h4>
                <p className="text-sm font-bold max-w-4xl text-[#1a1a1a]/80 font-inter">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] border-t border-white/5 py-24 px-12 text-center">
        <div className="max-w-[1400px] mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-5xl font-black text-white mb-16 tracking-tighter"
          >
            CND UPRAZE
          </motion.div>
          <div className="flex justify-center gap-12 text-gray-500 font-bold mb-16">
            <button 
              onClick={() => setLegalModal({ isOpen: true, type: 'privacy' })}
              className="hover:text-primary-500 transition-colors uppercase tracking-widest text-xs cursor-pointer"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setLegalModal({ isOpen: true, type: 'terms' })}
              className="hover:text-primary-500 transition-colors uppercase tracking-widest text-xs cursor-pointer"
            >
              Terms of Service
            </button>
            <a href="#" className="hover:text-primary-500 transition-colors uppercase tracking-widest text-xs">Help Center</a>
          </div>
          <div className="text-gray-700 font-bold text-sm tracking-widest uppercase">
            © 2026 CND UPRAZE SOLUTIONS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      <LegalModal 
        isOpen={legalModal.isOpen} 
        type={legalModal.type} 
        onClose={() => setLegalModal({ ...legalModal, isOpen: false })} 
      />
    </div>
  );
};

export default LandingPage;
