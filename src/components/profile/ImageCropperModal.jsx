import React, { useState, useRef, useEffect } from 'react';
import DialogWrapper from '../ui/DialogWrapper';
import Button from '../ui/Button';

export const ImageCropperModal = ({ isOpen, imageSrc, onCropComplete, onCancel }) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Load image object
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      imageRef.current = img;
      setPan({ x: 0, y: 0 });
      setZoom(1);
      drawCanvas();
    };
  }, [imageSrc]);

  // Redraw canvas whenever zoom or pan changes
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    const size = canvas.width; // 280x280
    ctx.clearRect(0, 0, size, size);

    // Save state
    ctx.save();

    // Create circular clip path
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
    ctx.clip();

    // Calculate aspect ratio fill
    const scale = Math.max(size / img.width, size / img.height) * zoom;
    const scaledW = img.width * scale;
    const scaledH = img.height * scale;

    const drawX = (size - scaledW) / 2 + pan.x;
    const drawY = (size - scaledH) / 2 + pan.y;

    ctx.drawImage(img, drawX, drawY, scaledW, scaledH);
    ctx.restore();
  };

  useEffect(() => {
    drawCanvas();
  }, [zoom, pan]);

  // Handle Drag / Pan
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleApplyCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Create an export canvas with optimal avatar dimensions (160x160)
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 160;
    exportCanvas.height = 160;
    const ctx = exportCanvas.getContext('2d');
    if (ctx) {
      // Draw from source canvas to sized export canvas
      ctx.drawImage(canvas, 0, 0, 160, 160);
      // Export as optimized JPEG (quality 0.85) to ensure lightweight payload (~10KB)
      const croppedDataUrl = exportCanvas.toDataURL('image/jpeg', 0.85);
      onCropComplete(croppedDataUrl);
    } else {
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      onCropComplete(croppedDataUrl);
    }
  };

  return (
    <DialogWrapper isOpen={isOpen} onClose={onCancel} title="Crop Profile Picture" maxWidth="sm">
      <div className="flex flex-col items-center select-none py-2">
        {/* Canvas Area */}
        <div
          className="relative w-[280px] h-[280px] rounded-full overflow-hidden bg-[#181a24] cursor-grab active:cursor-grabbing border-0"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            className="w-full h-full block"
          />
        </div>

        <p className="text-xs text-zinc-400 mt-3 text-center">
          Drag to reposition, adjust slider to zoom
        </p>

        {/* Zoom Slider */}
        <div className="w-full max-w-[260px] flex items-center gap-3 mt-4">
          <span className="text-xs text-zinc-400">1x</span>
          <input
            type="range"
            min={1}
            max={2.5}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <span className="text-xs text-zinc-400">2.5x</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 w-full pt-6">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleApplyCrop}>
            Apply Crop
          </Button>
        </div>
      </div>
    </DialogWrapper>
  );
};

export default ImageCropperModal;
