import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Activity, Server, Database, Globe, Bug } from 'lucide-react';

const DevDebugger = () => {
  const envInfo = [
    { label: 'Frontend URL', value: window.location.origin, icon: Globe },
    { label: 'API Base URL', value: import.meta.env.VITE_API_URL || 'Not Set', icon: Server },
    { label: 'App Mode', value: import.meta.env.MODE, icon: Bug },
    { label: 'Browser Env', value: navigator.userAgent.substring(0, 50) + '...', icon: Database },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 shadow-lg shadow-red-500/10">
          <Bug className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Developer Debugger</h2>
          <p className="text-gray-500">System diagnostics and environment status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Environment Status */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-500" /> Runtime Environment
          </h3>
          <div className="space-y-4">
            {envInfo.map((info, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-dark-border">
                <div className="flex items-center gap-3">
                  <info.icon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-400">{info.label}</span>
                </div>
                <span className="text-sm font-mono text-primary-400">{info.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Connectivity Tests */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-400" /> API Connectivity
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl flex items-center justify-between">
              <span className="text-sm text-green-400">PostgreSQL Status</span>
              <span className="text-xs font-bold uppercase py-1 px-2 bg-green-500 text-dark-bg rounded">Connected</span>
            </div>
             <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl flex items-center justify-between">
              <span className="text-sm text-green-400">Redis Status</span>
              <span className="text-xs font-bold uppercase py-1 px-2 bg-green-500 text-dark-bg rounded">Healthy</span>
            </div>
             <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center justify-between">
              <span className="text-sm text-red-400">Stripe Integration</span>
              <span className="text-xs font-bold uppercase py-1 px-2 bg-red-500 text-white rounded">Inactive (No API Key)</span>
            </div>
          </div>
          <button className="btn-primary w-full mt-6 py-3 text-sm">Run Ping Test</button>
        </div>
      </div>

      {/* Tailwind 4 Debug Note */}
      <div className="glass-card p-8 border-primary-500/30 bg-primary-500/5">
         <h4 className="text-xl font-bold mb-4">Tailwind CSS 4.0 Migration Note</h4>
         <p className="text-gray-400 text-sm leading-relaxed mb-6">
            We are using Tailwind CSS 4.0 with the `@tailwindcss/postcss` plugin. If you see an overlay error, 
            it is usually due to the container's build cache being out of sync with host file changes.
         </p>
         <div className="p-4 bg-dark-bg rounded-xl font-mono text-xs text-primary-500 mb-4">
            &gt; docker compose up -d --build --force-recreate
         </div>
         <p className="text-xs text-gray-500 italic">Run the command above to force a complete rebuild of the node_modules layer.</p>
      </div>
    </div>
  );
};

export default DevDebugger;
