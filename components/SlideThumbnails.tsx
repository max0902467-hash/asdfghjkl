
import React from 'react';
import { Slide } from '../types';
import { SLIDE_ASPECT_RATIO } from '../constants';

interface SlideThumbnailsProps {
    slides: Slide[];
    currentSlideIndex: number;
    onSelectSlide: (index: number) => void;
    onDeleteSlide: (id: string) => void;
}

const SlideThumbnails: React.FC<SlideThumbnailsProps> = ({ slides, currentSlideIndex, onSelectSlide, onDeleteSlide }) => {
    const THUMBNAIL_WIDTH = 160;

    return (
        <aside className="w-56 bg-gray-800 p-2 overflow-y-auto shadow-inner">
            <div className="space-y-2">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        onClick={() => onSelectSlide(index)}
                        className={`relative group cursor-pointer rounded-md overflow-hidden border-2 ${currentSlideIndex === index ? 'border-purple-500' : 'border-gray-600 hover:border-purple-400'}`}
                    >
                        <div className="flex items-center">
                            <span className="text-sm font-bold p-2 text-gray-400">{index + 1}</span>
                            <div
                                style={{
                                    width: THUMBNAIL_WIDTH,
                                    height: THUMBNAIL_WIDTH / SLIDE_ASPECT_RATIO,
                                    backgroundColor: slide.background,
                                    transform: `scale(${THUMBNAIL_WIDTH / 1000})`,
                                    transformOrigin: 'top left'
                                }}
                                className="overflow-hidden relative flex-shrink-0"
                            >
                                {slide.elements.map(el => {
                                    const commonStyle: React.CSSProperties = {
                                        position: 'absolute',
                                        left: el.x, top: el.y,
                                        width: el.width, height: el.height,
                                        transform: `rotate(${el.rotation}deg)`,
                                        color: el.style.color,
                                        backgroundColor: el.style.backgroundColor,
                                        fontSize: '10px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    };
                                    if (el.type === 'image') return <img key={el.id} src={el.content} alt="" style={{...commonStyle, objectFit: 'cover'}}/>
                                    return <div key={el.id} style={commonStyle} className="truncate">{el.content}</div>;
                                })}
                            </div>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteSlide(slide.id); }}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-opacity"
                            title="Delete Slide"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default SlideThumbnails;
