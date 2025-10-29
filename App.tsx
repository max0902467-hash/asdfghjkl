
import React, 'react';
import { v4 as uuidv4 } from 'uuid';
import { Presentation, Slide, SlideElement } from './types';
import { INITIAL_PRESENTATION } from './constants';
import Header from './components/Header';
import SlideThumbnails from './components/SlideThumbnails';
import EditorCanvas from './components/EditorCanvas';
import PropertiesPanel from './components/PropertiesPanel';
import PresentationView from './components/PresentationView';
import { generateSlideContent } from './services/geminiService';

const App: React.FC = () => {
    const [presentation, setPresentation] = React.useState<Presentation>(INITIAL_PRESENTATION);
    const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
    const [selectedElementId, setSelectedElementId] = React.useState<string | null>(null);
    const [isPresenting, setIsPresenting] = React.useState(false);
    const [isLoadingAI, setIsLoadingAI] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const updatePresentation = (updater: (prev: Presentation) => Presentation) => {
        setPresentation(updater);
    };

    const addSlide = () => {
        const newSlide: Slide = {
            id: uuidv4(),
            elements: [],
            background: '#ffffff',
        };
        updatePresentation(prev => ({ ...prev, slides: [...prev.slides, newSlide] }));
        setCurrentSlideIndex(presentation.slides.length);
    };

    const deleteSlide = (slideId: string) => {
        if (presentation.slides.length <= 1) return;
        updatePresentation(prev => {
            const newSlides = prev.slides.filter(s => s.id !== slideId);
            let newIndex = currentSlideIndex;
            if (currentSlideIndex >= newSlides.length) {
                newIndex = newSlides.length - 1;
            }
            setCurrentSlideIndex(newIndex);
            return { ...prev, slides: newSlides };
        });
    };

    const updateElement = (elementId: string, updatedProps: Partial<SlideElement>) => {
        updatePresentation(prev => {
            const newSlides = [...prev.slides];
            const slide = newSlides[currentSlideIndex];
            const elementIndex = slide.elements.findIndex(e => e.id === elementId);
            if (elementIndex > -1) {
                slide.elements[elementIndex] = { ...slide.elements[elementIndex], ...updatedProps };
            }
            return { ...prev, slides: newSlides };
        });
    };

    const addElement = (element: Omit<SlideElement, 'id'>) => {
        const newElement = { ...element, id: uuidv4() };
        updatePresentation(prev => {
            const newSlides = [...prev.slides];
            newSlides[currentSlideIndex].elements.push(newElement as SlideElement);
            return { ...prev, slides: newSlides };
        });
        setSelectedElementId(newElement.id);
    };
    
    const deleteElement = (elementId: string) => {
        updatePresentation(prev => {
            const newSlides = [...prev.slides];
            const slide = newSlides[currentSlideIndex];
            slide.elements = slide.elements.filter(el => el.id !== elementId);
            return { ...prev, slides: newSlides };
        });
        setSelectedElementId(null);
    };

    const handleAIGenerate = async (topic: string) => {
        setIsLoadingAI(true);
        setError(null);
        try {
            const newElements = await generateSlideContent(topic);
            updatePresentation(prev => {
                const newSlides = [...prev.slides];
                const currentSlide = newSlides[currentSlideIndex];
                // Clear existing elements and add new ones
                currentSlide.elements = newElements;
                return { ...prev, slides: newSlides };
            });
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoadingAI(false);
        }
    };

    const currentSlide = presentation.slides[currentSlideIndex];
    const selectedElement = currentSlide?.elements.find(e => e.id === selectedElementId) || null;

    if (isPresenting) {
        return <PresentationView presentation={presentation} onExit={() => setIsPresenting(false)} />;
    }

    return (
        <div className="bg-gray-800 text-white h-screen flex flex-col font-sans">
            <Header
                presentation={presentation}
                setPresentation={setPresentation}
                onAddSlide={addSlide}
                onAddElement={addElement}
                onPresent={() => setIsPresenting(true)}
            />
            <div className="flex-grow flex overflow-hidden">
                <SlideThumbnails
                    slides={presentation.slides}
                    currentSlideIndex={currentSlideIndex}
                    onSelectSlide={setCurrentSlideIndex}
                    onDeleteSlide={deleteSlide}
                />
                <main className="flex-grow flex flex-col items-center justify-center p-4 bg-gray-700 overflow-auto">
                    {error && <div className="absolute top-20 bg-red-500 text-white p-2 rounded shadow-lg">{error}</div>}
                    <EditorCanvas
                        slide={currentSlide}
                        selectedElementId={selectedElementId}
                        onSelectElement={setSelectedElementId}
                        onUpdateElement={updateElement}
                    />
                </main>
                <PropertiesPanel
                    selectedElement={selectedElement}
                    onUpdateElement={updateElement}
                    onDeleteElement={deleteElement}
                    onGenerateContent={handleAIGenerate}
                    isLoadingAI={isLoadingAI}
                />
            </div>
             {/* Hidden container for PDF export */}
            <div id="slides-for-export" className="absolute -left-[9999px] top-0">
                {presentation.slides.map(slide => (
                    <div
                        key={slide.id}
                        style={{ width: 1000, height: 1000 / (16/9), background: slide.background, position: 'relative' }}
                    >
                        {slide.elements.map(el => {
                             const commonStyle: React.CSSProperties = {
                                position: 'absolute',
                                left: el.x,
                                top: el.y,
                                width: el.width,
                                height: el.height,
                                transform: `rotate(${el.rotation}deg)`,
                                color: el.style.color,
                                backgroundColor: el.style.backgroundColor,
                                border: `${el.style.borderWidth || 0}px solid ${el.style.borderColor || 'transparent'}`,
                                borderRadius: `${el.style.borderRadius || 0}px`,
                                fontSize: el.style.fontSize,
                                fontWeight: el.style.fontWeight,
                                fontStyle: el.style.fontStyle,
                                textDecoration: el.style.textDecoration,
                                textAlign: el.style.textAlign,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '10px',
                                boxSizing: 'border-box',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                            };
                            if (el.type === 'image') {
                                return <img key={el.id} src={el.content} alt="slide element" style={{...commonStyle, objectFit: 'cover'}} />;
                            }
                            return <div key={el.id} style={commonStyle}>{el.content}</div>;
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
