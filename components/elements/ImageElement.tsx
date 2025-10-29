
import React from 'react';
import { SlideElement } from '../../types';
import BaseElement from './BaseElement';

interface ImageElementProps {
    element: SlideElement;
    isSelected: boolean;
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ImageElement: React.FC<ImageElementProps> = ({ element, isSelected, onMouseDown }) => {
    return (
        <BaseElement element={element} isSelected={isSelected} onMouseDown={onMouseDown}>
            <img 
                src={element.content} 
                alt="slide content" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                draggable="false"
            />
        </BaseElement>
    );
};

export default ImageElement;
