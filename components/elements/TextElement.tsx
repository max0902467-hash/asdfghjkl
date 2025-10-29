
import React from 'react';
import { SlideElement } from '../../types';
import BaseElement from './BaseElement';

interface TextElementProps {
    element: SlideElement;
    isSelected: boolean;
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const TextElement: React.FC<TextElementProps> = ({ element, isSelected, onMouseDown }) => {
    
    const textStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        padding: '5px',
        boxSizing: 'border-box',
    };

    const fontSizeClassMap: {[key: string]: string} = {
        'xs': 'text-xs', 'sm': 'text-sm', 'base': 'text-base', 'lg': 'text-lg', 'xl': 'text-xl', '2xl': 'text-2xl', '3xl': 'text-3xl', '4xl': 'text-4xl', '5xl': 'text-5xl'
    };

    const className = `
        ${fontSizeClassMap[element.style.fontSize || 'base'] || 'text-base'}
    `;

    return (
        <BaseElement element={element} isSelected={isSelected} onMouseDown={onMouseDown}>
             <div style={textStyle} className={className}>
                {element.content}
            </div>
        </BaseElement>
    );
};

export default TextElement;
