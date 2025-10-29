
import React, { useRef } from 'react';
import { Presentation, SlideElement } from '../types';
import { exportToPdf, exportToJson, importFromJson } from '../services/exportService';
import { Icon } from './icons/Icon';

interface HeaderProps {
    presentation: Presentation;
    setPresentation: (presentation: Presentation) => void;
    onAddSlide: () => void;
    onAddElement: (element: Omit<SlideElement, 'id'>) => void;
    onPresent: () => void;
}

const Header: React.FC<HeaderProps> = ({ presentation, setPresentation, onAddSlide, onAddElement, onPresent }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPresentation({ ...presentation, title: e.target.value });
    };

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const importedPresentation = await importFromJson(file);
                setPresentation(importedPresentation);
            } catch (error) {
                alert(error instanceof Error ? error.message : 'Failed to import presentation.');
            }
        }
    };
    
    const handleAddText = () => {
        onAddElement({
            type: 'text',
            x: 50, y: 50, width: 300, height: 50,
            rotation: 0,
            content: 'New Text',
            style: {
                fontSize: 'lg',
                color: '#000000'
            }
        });
    };
    
    const handleAddImage = () => {
        const url = prompt("Enter image URL:");
        if (url) {
            onAddElement({
                type: 'image',
                x: 100, y: 100, width: 400, height: 300,
                rotation: 0,
                content: url,
                style: {}
            });
        }
    };


    return (
        <header className="bg-gray-900 p-2 flex items-center justify-between shadow-md z-10">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-purple-400">ARADES PRA</h1>
                <input
                    type="text"
                    value={presentation.title}
                    onChange={handleTitleChange}
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>
            <div className="flex items-center gap-2">
                <HeaderButton onClick={onAddSlide} title="Add Slide">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.5h-6a2.25 2.25 0 0 1-2.25-2.25V6.75A2.25 2.25 0 0 1 7.5 4.5h6a2.25 2.25 0 0 1 2.25 2.25v7.5A2.25 2.25 0 0 1 13.5 16.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.75h-7.5V16.5h7.5v2.25z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 13.5h.008v.008H15v-.008z" /><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 13.5h.008v.008h-.008v-.008zM10.5 10.5h.008v.008h-.008v-.008zM7.5 10.5h.008v.008H7.5v-.008zM7.5 7.5h.008v.008H7.5V7.5z" /></svg>
                </HeaderButton>
                 <HeaderButton onClick={handleAddText} title="Add Text">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                </HeaderButton>
                 <HeaderButton onClick={handleAddImage} title="Add Image">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                </HeaderButton>
            </div>
            <div className="flex items-center gap-2">
                <input type="file" accept=".json" ref={fileInputRef} onChange={handleImport} className="hidden" />
                <HeaderButton onClick={() => fileInputRef.current?.click()} title="Import JSON">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3v11.25" /></svg>
                </HeaderButton>
                <HeaderButton onClick={() => exportToJson(presentation)} title="Export JSON">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                </HeaderButton>
                <HeaderButton onClick={() => exportToPdf(presentation)} title="Export PDF">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                </HeaderButton>
                 <button onClick={onPresent} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                    <Icon><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg></Icon>
                    Present
                </button>
            </div>
        </header>
    );
};

const HeaderButton: React.FC<{onClick: () => void, children: React.ReactNode, title: string}> = ({ onClick, children, title }) => (
    <button onClick={onClick} title={title} className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors">
        <Icon>{children}</Icon>
    </button>
);

export default Header;
