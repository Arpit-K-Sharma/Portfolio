import React from "react";

interface SkillIconProps {
    icon: string | null;
    alt: string;
    className?: string;
}

export function SkillIcon({ icon, alt, className = "w-6 h-6" }: SkillIconProps) {
    if (!icon) return null;

    return (
        <img
            src={icon}
            alt={alt}
            className={`${className} object-contain`}
        />
    );
}
