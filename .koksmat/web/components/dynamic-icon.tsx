import React from "react";
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

type IconName = keyof typeof LucideIcons;

interface DynamicIconProps {
  iconName: IconName;
  size?: number;
  color?: string;
  [key: string]: any; // To allow other props like className, etc.
}

const DynamicIcon: React.FC<DynamicIconProps> = ({
  iconName,
  size = 24,
  color = "currentColor",
  ...props
}) => {
  const IconComponent = LucideIcons[
    iconName
  ] as React.ComponentType<LucideProps>;

  if (!IconComponent) {
    // If the icon is not found, render a default icon or a placeholder
    return <LucideIcons.AlertTriangle size={size} color={color} {...props} />;
  }

  return <IconComponent size={size} color={color} {...props} />;
};

export default DynamicIcon;
