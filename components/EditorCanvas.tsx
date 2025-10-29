
import React, { useState, useRef, useEffect } from 'react';
import { Slide, SlideElement } from '../types';
import { SLIDE_WIDTH, SLIDE_HEIGHT } from '../constants';
import TextElement from './elements/TextElement';
import ImageElement from './elements/ImageElement';

interface EditorCanvasProps {
    slide: Slide;
    selectedElementId: string | null;
    onSelectElement: (id: string | null) => void;
    onUpdateElement: (id: string, props: Partial<SlideElement>) => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({ slide, selectedElementId, onSelectElement, onUpdateElement }) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState<{ id: string, offsetX: number, offsetY: number } | null>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
        onSelectElement(id);
        const el = slide.elements.find(el => el.id === id);
        if (el && canvasRef.current) {
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            const canvasRect = canvasRef.current.getBoundingClientRect();
            const scale = canvasRect.width / SLIDE_WIDTH;
            const offsetX = (e.clientX - rect.left) / scale;
            const offsetY = (e.clientY - rect.top) / scale;
            setDragging({ id, offsetX, offsetY });
        }
    };
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (dragging && canvasRef.current) {
            const canvasRect = canvasRef.current.getBoundingClientRect();
            const scale = canvasRect.width / SLIDE_WIDTH;
            const x = (e.clientX - canvasRect.left) / scale - dragging.offsetX;
            const y = (e.clientY - canvasRect.top) / scale - dragging.offsetY;
            onUpdateElement(dragging.id, { x, y });
        }
    };

    const handleMouseUp = () => {
        setDragging(null);
    };

    useEffect(() => {
        const handleMouseUpGlobal = () => setDragging(null);
        window.addEventListener('mouseup', handleMouseUpGlobal);
        return () => window.removeEventListener('mouseup', handleMouseUpGlobal);
    }, []);

    if (!slide) {
        return <div className="text-center text-gray-400">Select or create a slide to begin.</div>;
    }

    return (
        <div
            ref={canvasRef}
            className="shadow-2xl bg-white"
            style={{
                width: `${SLIDE_WIDTH}px`,
                height: `${SLIDE_HEIGHT}px`,
                position: 'relative',
                backgroundColor: slide.background,
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={(e) => {
                if (e.target === canvasRef.current) {
                    onSelectElement(null);
                }
            }}
        >
            {slide.elements.map(element => {
                const isSelected = selectedElementId === element.id;
                const props = {
                    key: element.id,
                    element,
                    isSelected,
                    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => handleMouseDown(e, element.id),
                };
                
                switch (element.type) {
                    case 'text':
                        return <TextElement {...props} />;
                    case 'image':
                        return <ImageElement {...props} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
};

export default EditorCanvas;
