import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import React, { ReactNode } from "react";

interface OriginDropdownProps {
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  placeholder?: string;
  icon?: ReactNode;
  label?: string;
  value?: string;
  className?: string;
  showClearOption?: boolean;
  minimal?: boolean; // New prop for minimalist style
}

export const OriginDropdown: React.FC<OriginDropdownProps> = ({
  options,
  onSelect,
  placeholder = "Select option",
  icon,
  label,
  value,
  className = "",
  showClearOption = false,
  minimal = false,
}) => {
  const selectedOption = options.find(
    (option) => option.value === value || option.label === value,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={minimal ? "ghost" : "outline"}
          className={`
            ${minimal ? "p-1.5 h-8 border-0" : "w-[160px] bg-white border-[#C9DAD0]"} 
            ${className}
          `}
        >
          <div className="flex items-center gap-1.5 w-full justify-between">
            <div className="flex items-center gap-1.5 overflow-hidden">
              {icon && (
                <span className={minimal ? "text-gray-500" : ""}>{icon}</span>
              )}
              <span
                className={`truncate ${minimal ? "font-medium text-sm" : ""}`}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>
            <ChevronDownIcon
              className={`${minimal ? "h-3.5 w-3.5" : "h-4 w-4"} opacity-60 flex-shrink-0 ml-1`}
              aria-hidden="true"
            />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[160px] rounded-xl">
        {label && (
          <>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {options.map((option, index) => (
          <DropdownMenuItem
            key={`${option.value}-${index}`}
            onClick={() => onSelect(option.value)}
            className={value === option.value ? "bg-muted" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
        {showClearOption && value && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSelect("clear")}>
              Clear selection
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
