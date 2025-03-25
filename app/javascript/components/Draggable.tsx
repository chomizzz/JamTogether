import React, { useEffect, useState, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export function Draggable(props) {


    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
    });

    const nodeRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        // Vérifie la position pendant que l'élément est déplacé
        if (nodeRef.current) {
            const rect = nodeRef.current.getBoundingClientRect();
            props.setPosition({ x: rect.left + 5, y: rect.top + rect.height / 2 });
        }
    }, [transform]);

    const style = {
        transform: CSS.Translate.toString(transform), // Applique la transformation CSS
    };

    return (
        <button
            ref={(node) => {
                setNodeRef;
                nodeRef.current = node;
            }}
            style={style}
            {...listeners}
            className={props.className || ""}
            {...attributes}
        >
            {props.children}
        </button>
    );
}

export default Draggable;
