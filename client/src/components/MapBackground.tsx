import { ReactNode } from "react";
import { cityscapeBgImage } from "../assets/cityscape_bg.tsx";
import Header from "./Header.tsx";

interface MapBackgroundProps {
  children: ReactNode;
  variant?: "cityscape" | "map";
  footer?: ReactNode;
}

const MapBackground = ({ children, variant = "map" }: MapBackgroundProps) => {
  return (
    <div className="flex flex-col flex-1 w-full">
      <Header />
      <div
        className="flex-1 flex flex-col justify-center items-center w-full relative overflow-hidden"
        style={{
          backgroundColor: variant === "cityscape" ? undefined : "#FFF5E6",
        }}
      >
        {variant === "cityscape" && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: cityscapeBgImage,
                filter: "blur(8px)",
                transform: "scale(1.1)",
              }}
            />
            <div className="absolute inset-0 bg-black/20" />
          </>
        )}
        <div className="relative z-10 w-full">{children}</div>
      </div>
    </div>
  );
};

export default MapBackground;