import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export function Droppable(props) {
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
    });

    const { onClick, onDoubleClick, className, children, ...restProps } = props;

    const style = {
        opacity: isOver ? 1 : 0.5,
        ...props.style
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={className || ""}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            {...restProps}
        >            {props.children}
        </div>
    );
}
export default Droppable;
