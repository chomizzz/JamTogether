import React, { useEffect, useState, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
export function Draggable(props) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
    });
    const [isDraggable, setIsDraggable] = useState(true);
    const nodeRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const resizeTimeoutRef = useRef(null);
    const [localSize, setLocalSize] = useState(props.size);
    const isInitialRender = useRef(true);

    useEffect(() => {
        // On envoie au parent une fonction qui renvoie localSize pour cet ID
        props.setGetDraggableSize(() => (id) => (id === props.id ? localSize : 0));
    }, [localSize, props.id, props.setGetDraggableSize]);

    // Fonction pour obtenir la taille la plus proche dans le tableau size


    //On met des petits commentaire pour voir si ca fonctionne lazyGit
    useEffect(() => {

    }, [localSize]);


    useEffect(() => {
        if (isDraggable && nodeRef.current) {
            const rect = nodeRef.current.getBoundingClientRect();
            props.setPosition({ x: rect.left + 5, y: rect.top + rect.height / 2 });
        }
    }, [transform, isDraggable]);

    useEffect(() => {
        // Si on a une référence à l'élément DOM, mettre à jour directement son style
        if (nodeRef.current) {
            nodeRef.current.style.width = `${localSize}px`;
        }
    }, [transform]);


    const style = {
        transform: isDraggable ? CSS.Translate.toString(transform) : undefined,
        width: `${localSize}px`,
    };

    return (
        <div
            ref={(node) => {
                setNodeRef(node);
                nodeRef.current = node;
            }}
            style={style}
            className={props.className || ""}
            {...attributes}
            {...(isDraggable ? listeners : {})}
        >
            {props.children}
        </div>
    );
}
export default Draggable;
