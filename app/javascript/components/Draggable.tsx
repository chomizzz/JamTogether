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
    // Fonction pour obtenir la taille la plus proche dans le tableau size
    const getClosestSize = (width: number) => {
        return props.multiplesOf11_25.reduce((précédent: number, courant: number) => {
            return Math.abs(courant - width) < Math.abs(précédent - width)
                ? courant
                : précédent;
        });
    };

    useEffect(() => {
        if (!nodeRef.current) return;
        const observer = new ResizeObserver(() => {
            setIsDraggable(false);
            // permet de pouvoir déplacer l'element sans avoir a cliquer une fois en +
            if (nodeRef.current) {
                const rect = nodeRef.current.getBoundingClientRect();
                const closestSize = getClosestSize(rect.width);

                setLocalSize(closestSize);
                props.setSize(closestSize);
                lastPosition.current = { x: rect.left, y: rect.top };
            }
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
            resizeTimeoutRef.current = setTimeout(() => {
                setIsDraggable(true);
                //Pour l'instant pas besoin de redéfinir sa position car élement passe par dessus
                if (nodeRef.current) {
                    const rect = nodeRef.current.getBoundingClientRect();
                    const closestSize = getClosestSize(rect.width);

                    setLocalSize(closestSize);
                    props.setSize(closestSize);
                    props.setPosition({ x: rect.left, y: rect.top });
                }
            }, 500);
        });
        observer.observe(nodeRef.current);
        return () => {
            observer.disconnect();
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };
    }, []);


    useEffect(() => {
        if (isDraggable && nodeRef.current) {
            const rect = nodeRef.current.getBoundingClientRect();
            props.setPosition({ x: rect.left + 5, y: rect.top + rect.height / 2 });
        }
    }, [transform, isDraggable]);

    useEffect(() => {
        styleRef.current = {
            transform: isDraggable ? CSS.Translate.toString(transform) : undefined,
            width: `${localSize}px`
        };

        // Si on a une référence à l'élément DOM, mettre à jour directement son style
        if (nodeRef.current) {
            nodeRef.current.style.width = `${localSize}px`;
        }
    }, [localSize, isDraggable, transform]);

    const styleRef = useRef({
        transform: isDraggable ? CSS.Translate.toString(transform) : undefined,
        width: `${props.size}px`
    });

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
