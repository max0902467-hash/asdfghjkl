
import React from 'react';
import { SlideElement } from '../../types';

interface BaseElementProps {
    element: SlideElement;
    isSelected: boolean;
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
    children: React.ReactNode;
}

const BaseElement: React.FC<BaseElementProps> = ({ element, isSelected, onMouseDown, children }) => {
    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        transform: `rotate(${element.rotation}deg)`,
        cursor: 'move',
        outline: isSelected ? '2px solid #8b5cf6' : 'none',
        outlineOffset: '2px',
        ...element.style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    return (
        <div style={style} onMouseDown={onMouseDown}>
            {children}
        </div>
    );
};

export default BaseElement;
