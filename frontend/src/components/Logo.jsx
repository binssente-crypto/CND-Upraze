import React from 'react';

const Logo = ({ className = "h-8", variant = "default" }) => {
  const getLogoSrc = () => {
    switch (variant) {
      case "solutions": return "/assets/cnd-solutions-logo-white.png";
      case "footer": return "/assets/cnd-footer-logo.png";
      default: return "/assets/cnd-logo.png";
    }
  };

  const logoSrc = getLogoSrc();

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoSrc} 
        alt="CND UPRAZE" 
        className="h-full w-auto object-contain"
      />
    </div>
  );
};

export default Logo;
