import React, { useState, useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableResizableProps {
    id: string;
    className?: string;
    children?: React.ReactNode;
    onResize?: (width: number) => void;
    setPosition: (position: { x: number; y: number }) => void;
}

const DraggableResizable: React.FC<DraggableResizableProps> = ({
    id,
    className = '',
    children,
    onResize,
    setPosition,
}) => {
    const [width, setWidth] = useState(50); // Largeur initiale
    const [isResizing, setIsResizing] = useState(false);
    const resizeStartX = useRef(0);
    const initialWidth = useRef(width);

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
        disabled: isResizing // Désactive le déplacement pendant le redimensionnement
    });


    const nodeRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        // Vérifie la position pendant que l'élément est déplacé
        if (nodeRef.current) {
            const rect = nodeRef.current.getBoundingClientRect();
            setPosition({ x: rect.left, y: rect.top });
        }
    }, [transform]);


    const handleResizeStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsResizing(true);
        resizeStartX.current = e.clientX;
        initialWidth.current = width;

        // Ajout des écouteurs globaux
        document.addEventListener('mousemove', handleResizeMove);
        document.addEventListener('mouseup', handleResizeEnd);
    };

    const handleResizeMove = (e: MouseEvent) => {
        if (!isResizing) return;

        const deltaX = e.clientX - resizeStartX.current;
        const newWidth = Math.max(20, initialWidth.current + deltaX);

        setWidth(newWidth);
        onResize?.(newWidth);
    };

    const handleResizeEnd = () => {
        setIsResizing(false);

        // Suppression des écouteurs globaux
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
    };

    const style = {
        transform: CSS.Translate.toString(transform),
        width: `${width}px`,
        position: 'absolute',
        zIndex: 50,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`h-3 rounded-sm bg-purple-600 relative ${className}`}
            {...listeners}
            {...attributes}
        >
            {/* Poignée de redimensionnement à gauche */}
            <div
                className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize z-50"
                onMouseDown={handleResizeStart}
            />

            {/* Poignée de redimensionnement à droite */}
            <div
                className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize z-50"
                onMouseDown={handleResizeStart}
            />

            {children}
        </div>
    );
};
export default DraggableResizable;
