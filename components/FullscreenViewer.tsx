import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface FullscreenViewerProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const ZoomInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>;
const ZoomOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>;

export const FullscreenViewer: React.FC<FullscreenViewerProps> = ({ isOpen, imageUrl, onClose }) => {
  const { theme } = useTheme();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleZoomIn = () => setScale(s => Math.min(s + 0.2, 3));
  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.2, 1);
    if (newScale === 1) setPosition({ x: 0, y: 0 });
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      e.preventDefault();
      setIsDragging(true);
      lastPosition.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      e.preventDefault();
      const dx = e.clientX - lastPosition.current.x;
      const dy = e.clientY - lastPosition.current.y;
      lastPosition.current = { x: e.clientX, y: e.clientY };
      setPosition(p => ({ x: p.x + dx, y: p.y + dy }));
    }
  };
  
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="relative w-full h-full" onClick={e => e.stopPropagation()}>
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Fullscreen generated scene"
          className={`max-w-full max-h-full object-contain absolute top-1/2 left-1/2 transition-transform duration-200 ${isDragging || scale === 1 ? 'cursor-grab' : 'cursor-grab'}`}
          style={{ transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})` }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
      </div>

      <div className="absolute top-4 right-4 flex flex-col space-y-2" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className={`p-2 rounded-full ${theme.panelBg} text-white hover:bg-opacity-50`}>
          <CloseIcon />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 p-2 rounded-full ${theme.panelBg}" onClick={e => e.stopPropagation()}>
        <button onClick={handleZoomOut} disabled={scale <= 1} className="p-2 text-white disabled:opacity-50"><ZoomOutIcon /></button>
        <button onClick={handleZoomIn} disabled={scale >= 3} className="p-2 text-white disabled:opacity-50"><ZoomInIcon /></button>
      </div>
    </div>
  );
};
