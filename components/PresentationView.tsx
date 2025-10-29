
import React, { useState, useEffect } from 'react';
import { Presentation } from '../types';
import { SLIDE_WIDTH, SLIDE_HEIGHT } from '../constants';

interface PresentationViewProps {
    presentation: Presentation;
    onExit: () => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({ presentation, onExit }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                setCurrentSlideIndex(prev => Math.min(prev + 1, presentation.slides.length - 1));
            } else if (e.key === 'ArrowLeft') {
                setCurrentSlideIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'Escape') {
                onExit();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [presentation.slides.length, onExit]);

    const slide = presentation.slides[currentSlideIndex];

    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <div
                className="relative bg-white"
                style={{
                    width: '100vw',
                    height: `${100 / (16 / 9)}vw`, // Maintain aspect ratio
                    maxWidth: `calc(100vh * ${16 / 9})`,
                    maxHeight: '100vh',
                }}
            >
                <div 
                    className="absolute inset-0" 
                    style={{
                        transform: `scale(calc(100vw / ${SLIDE_WIDTH}))`,
                        transformOrigin: 'top left',
                         '@media (min-aspect-ratio: 16/9)': {
                            transform: `scale(calc(100vh / ${SLIDE_HEIGHT}))`
                        }
                    }}
                >
                    <div style={{ position: 'relative', width: SLIDE_WIDTH, height: SLIDE_HEIGHT, backgroundColor: slide.background }}>
                        {slide.elements.map(el => {
                            const commonStyle: React.CSSProperties = {
                                position: 'absolute',
                                left: el.x, top: el.y,
                                width: el.width, height: el.height,
                                transform: `rotate(${el.rotation}deg)`,
                                color: el.style.color,
                                backgroundColor: el.style.backgroundColor,
                                fontSize: el.style.fontSize,
                                fontWeight: el.style.fontWeight,
                                fontStyle: el.style.fontStyle,
                                textDecoration: el.style.textDecoration,
                                textAlign: el.style.textAlign,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: '10px',
                                boxSizing: 'border-box',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                            };
                            
                            if (el.type === 'image') {
                                return <img key={el.id} src={el.content} alt="" style={{...commonStyle, objectFit: 'cover'}}/>;
                            }
                            return <div key={el.id} style={commonStyle}>{el.content}</div>;
                        })}
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 bg-opacity-50 rounded-full p-2 flex items-center gap-4">
                <button onClick={() => setCurrentSlideIndex(prev => Math.max(prev - 1, 0))} className="text-white hover:text-purple-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <span className="text-white">{currentSlideIndex + 1} / {presentation.slides.length}</span>
                <button onClick={() => setCurrentSlideIndex(prev => Math.min(prev + 1, presentation.slides.length - 1))} className="text-white hover:text-purple-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>

            <button onClick={onExit} className="absolute top-4 right-4 text-white bg-gray-800 bg-opacity-50 p-2 rounded-full hover:bg-opacity-75">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

export default PresentationView;
