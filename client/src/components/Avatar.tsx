import React from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fallback?: string;
  className?: string;
}

const sizeMap = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
  xl: "h-16 w-16 text-xl",
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = "md",
  fallback,
  className = "",
}) => {
  const [error, setError] = React.useState(false);

  const handleError = () => {
    setError(true);
  };

  const getFallback = () => {
    if (fallback) return fallback;
    if (alt && alt.length > 0) {
      const initials = alt
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
      return initials;
    }
    return "U";
  };

  return (
    <div
      className={`${sizeMap[size]} rounded-full overflow-hidden flex items-center justify-center bg-gray-200 ${className}`}
    >
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleError}
        />
      ) : (
        <span className="font-medium text-gray-700">{getFallback()}</span>
      )}
    </div>
  );
};

export default Avatar;