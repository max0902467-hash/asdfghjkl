
import React, { useState, useEffect } from 'react';
import { SlideElement, ElementStyle } from '../types';

interface PropertiesPanelProps {
    selectedElement: SlideElement | null;
    onUpdateElement: (id: string, props: Partial<SlideElement> | { style: Partial<ElementStyle> }) => void;
    onDeleteElement: (id: string) => void;
    onGenerateContent: (topic: string) => void;
    isLoadingAI: boolean;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedElement, onUpdateElement, onDeleteElement, onGenerateContent, isLoadingAI }) => {
    const [aiPrompt, setAiPrompt] = useState('');
    const [localContent, setLocalContent] = useState(selectedElement?.content || '');

    useEffect(() => {
        setLocalContent(selectedElement?.content || '');
    }, [selectedElement]);

    const handleStyleChange = (styleProps: Partial<ElementStyle>) => {
        if (selectedElement) {
            onUpdateElement(selectedElement.id, {
                style: { ...selectedElement.style, ...styleProps }
            });
        }
    };
    
    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalContent(e.target.value);
    }
    
    const handleContentBlur = () => {
        if (selectedElement && selectedElement.content !== localContent) {
            onUpdateElement(selectedElement.id, { content: localContent });
        }
    }

    const renderTextProperties = () => {
        if (!selectedElement || selectedElement.type !== 'text') return null;
        return (
            <>
                <Property label="Content">
                    <textarea value={localContent} onChange={handleContentChange} onBlur={handleContentBlur} rows={3} className="w-full bg-gray-600 rounded p-1"/>
                </Property>
                <Property label="Font Size">
                    <select value={selectedElement.style.fontSize} onChange={e => handleStyleChange({ fontSize: e.target.value })} className="w-full bg-gray-600 rounded p-1">
                        <option value="sm">Small</option>
                        <option value="base">Medium</option>
                        <option value="lg">Large</option>
                        <option value="xl">XL</option>
                        <option value="2xl">2XL</option>
                        <option value="3xl">3XL</option>
                        <option value="4xl">4XL</option>
                         <option value="5xl">5XL</option>
                    </select>
                </Property>
                <Property label="Color">
                    <input type="color" value={selectedElement.style.color || '#000000'} onChange={e => handleStyleChange({ color: e.target.value })} className="w-full h-8 p-0 border-none bg-gray-600 cursor-pointer"/>
                </Property>
                <Property label="Alignment">
                    <div className="flex gap-1">
                        <button onClick={() => handleStyleChange({textAlign: 'left'})}>L</button>
                        <button onClick={() => handleStyleChange({textAlign: 'center'})}>C</button>
                        <button onClick={() => handleStyleChange({textAlign: 'right'})}>R</button>
                    </div>
                </Property>
            </>
        );
    };
    
     const renderSharedProperties = () => {
        if (!selectedElement) return null;
        return (
            <>
                <Property label="Position">
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" value={Math.round(selectedElement.x)} onChange={(e) => onUpdateElement(selectedElement.id, {x: parseInt(e.target.value)})} className="w-full bg-gray-600 rounded p-1" />
                        <input type="number" value={Math.round(selectedElement.y)} onChange={(e) => onUpdateElement(selectedElement.id, {y: parseInt(e.target.value)})} className="w-full bg-gray-600 rounded p-1" />
                    </div>
                </Property>
                 <Property label="Size">
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" value={Math.round(selectedElement.width)} onChange={(e) => onUpdateElement(selectedElement.id, {width: parseInt(e.target.value)})} className="w-full bg-gray-600 rounded p-1" />
                        <input type="number" value={Math.round(selectedElement.height)} onChange={(e) => onUpdateElement(selectedElement.id, {height: parseInt(e.target.value)})} className="w-full bg-gray-600 rounded p-1" />
                    </div>
                </Property>
                <Property label="Rotation">
                    <input type="range" min="0" max="360" value={selectedElement.rotation} onChange={(e) => onUpdateElement(selectedElement.id, {rotation: parseInt(e.target.value)})} className="w-full"/>
                </Property>
                <button onClick={() => onDeleteElement(selectedElement.id)} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
                    Delete Element
                </button>
            </>
        );
    };

    return (
        <aside className="w-72 bg-gray-800 p-4 overflow-y-auto flex flex-col gap-6 shadow-inner">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-purple-400">AI Content Generator</h3>
                <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., 'The benefits of React hooks'"
                    className="w-full bg-gray-700 rounded p-2 text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                />
                <button
                    onClick={() => onGenerateContent(aiPrompt)}
                    disabled={isLoadingAI || !aiPrompt}
                    className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-500"
                >
                    {isLoadingAI ? 'Generating...' : 'Generate Slide'}
                </button>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2 border-b border-gray-700 pb-2 text-purple-400">Properties</h3>
                {selectedElement ? (
                    <div className="space-y-4">
                        {renderTextProperties()}
                        {renderSharedProperties()}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">Select an element to edit its properties, or use the AI generator to create a new slide.</p>
                )}
            </div>
        </aside>
    );
};


const Property: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="text-sm font-medium text-gray-400 block mb-1">{label}</label>
        {children}
    </div>
);


export default PropertiesPanel;
