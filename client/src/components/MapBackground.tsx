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
    <div className="flex flex-col flex-1">
      <div
        className="flex-1 flex flex-col justify-center items-center bg-cover bg-center"
        style={{
          backdropFilter: "opacity(20%)",
          backgroundImage:
            variant === "cityscape" ? cityscapeBgImage : undefined,
          backgroundColor: variant === "cityscape" ? undefined : "#FFF5E6",
        }}
      >
        <Header />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default MapBackground;
