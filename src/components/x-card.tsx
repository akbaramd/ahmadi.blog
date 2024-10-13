// components/Card.tsx
import React from "react";
import { Separator } from "@/components/ui/separator";

interface CardProps {
    title?: string; // Optional title prop
    children: React.ReactNode; // Children for card content
}

const XCard: React.FC<CardProps> = ({ title, children }) => {
    return (
        <div className="bg-white border rounded-md p-4 shadow-sm mb-4">
            {/* Only show the title if it exists */}
            {title && (
                <>
                    <b className=" font-semibold">{title}</b>
                    <Separator className="my-4" /> {/* Divider between title and content */}
                </>
            )}
            {/* Card content */}
            <div>{children}</div>
        </div>
    );
};

export default XCard;
