import { ReactNode } from "react";
import { mapBgImage } from "../assets/map_bg.ts";

interface MapBackgroundProps {
  children: ReactNode;
}

const MapBackground = ({ children }: MapBackgroundProps) => {
  return (
    <div
      className="min-h-[70vh] flex flex-col flex-1 justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage: mapBgImage,
        backgroundColor: "#FFF5E6",
      }}
    >
      {children}
    </div>
  );
};

export default MapBackground;
