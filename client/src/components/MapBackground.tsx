import { ReactNode } from 'react';

interface HouseIconProps {
  top: string;
  left: string;
}

const HouseIcon = ({ top, left }: HouseIconProps) => (
  <div className="absolute" style={{ top, left }}>
    <div className="w-10 h-10 bg-[#E9927E] rounded-md flex items-center justify-center">
      <div className="flex flex-wrap w-5 h-5 items-center justify-center">
        <div className="w-2 h-2 bg-[#FFE3A3] rounded-[1px] m-0.5"></div>
        <div className="w-2 h-2 bg-[#FFE3A3] rounded-[1px] m-0.5"></div>
      </div>
    </div>
  </div>
);

interface MapBackgroundProps {
  children: ReactNode;
}

const MapBackground = ({ children }: MapBackgroundProps) => {
  return (
    <div 
      className="relative min-h-[70vh]" 
      style={{ 
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><path d='M0,0 L200,0 L200,200 L0,200 Z' fill='%23FFF5E6'/><path d='M20,0 L20,200 M40,0 L40,200 M60,0 L60,200 M80,0 L80,200 M100,0 L100,200 M120,0 L120,200 M140,0 L140,200 M160,0 L160,200 M180,0 L180,200 M0,20 L200,20 M0,40 L200,40 M0,60 L200,60 M0,80 L200,80 M0,100 L200,100 M0,120 L200,120 M0,140 L200,140 M0,160 L200,160 M0,180 L200,180' stroke='%23F0DFC0' stroke-width='1'/></svg>")`,
        backgroundColor: "#FFF5E6"
      }}
    >
      <HouseIcon top="25%" left="20%" />
      <HouseIcon top="40%" left="75%" />
      <HouseIcon top="65%" left="33%" />
      <HouseIcon top="30%" left="60%" />
      <HouseIcon top="70%" left="67%" />
      
      {children}
    </div>
  );
};

export default MapBackground;
