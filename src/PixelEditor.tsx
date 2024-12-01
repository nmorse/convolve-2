// src/PixelEditor.jsx

import { useRef, useState } from 'preact/hooks';
import SimpleColorPicker from './SimpleColorPicker'; // Import the SimpleColorPicker
// import './PixelEditor.css'; // Optional: For styles
import JSON5 from 'json5'; // Make sure to install json5 package

//const canvasWidth = 200; // Canvas width
//const canvasHeight = 200; // Canvas height

const PixelEditor = ({ blocks, width, height, colors, title, onChange }: 
    { blocks: number, width: number, height: number, colors: string[], title: string, onChange: (_:number[][])=>void }) => {
    const canvasWidth = width; // Canvas width
    const canvasHeight = height; // Canvas height
    const pixelSize = blocks; // Size of each pixel block
    const rows = canvasHeight / pixelSize; // Number of rows
    const cols = canvasWidth / pixelSize; // Number of columns
    const canvasRef = useRef(null);
    const [color, setColor] = useState(0);
    const [isDrawing, setIsDrawing] = useState(false); // Track drawing state
    const [pixelData, setPixelData] = useState(Array.from({ length: rows }, () => Array(cols).fill(0))); // Initialize with white pixels

    const drawPixel = (x: number, y: number) => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.fillStyle = colors[color+1];
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        pixelData[y][x] = color; // Update pixel data
    };

    const penDown = (event: MouseEvent) => {
        setIsDrawing(true);
        handleDraw(event); // Draw immediately on mouse down
    };

    const penUp = () => {
        setIsDrawing(false);
        onChange(pixelData);
        console.log("editor called onChange")
    };

    const handleMove = (event: MouseEvent) => {
        if (!isDrawing) return; // Only draw if the pen is down
        handleDraw(event);
    };

    const handleDraw = (event: MouseEvent) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / pixelSize);
        const y = Math.floor((event.clientY - rect.top) / pixelSize);
        drawPixel(x, y);
    };

    const clearCanvas = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        setPixelData(Array.from({ length: rows }, () => Array(cols).fill(0))); // Reset pixel data
        ctx.fillStyle = colors[1];
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    };

    const savePixelData = () => {
        const json5String = JSON5.stringify(pixelData);
        console.log("Saved Pixel Data (JSON5):", json5String);
        // You can also save this to a file or send it to a server
        const blob = new Blob([json5String], { type: 'application/json5' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pixelData.json5';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div><div>{title}</div>
            <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                onMouseDown={penDown}
                onMouseUp={penUp}
                // onMouseOut={penUp}
                onMouseMove={handleMove}
                style={{ border: '1px solid black', cursor: 'pointer' }}
            />
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'stretch'
            }}>
                <SimpleColorPicker onColorChange={setColor} colors={colors} />
                <button onClick={clearCanvas}>Clear</button>
                <button onClick={savePixelData}>Save</button>
            </div>
        </div>
    );
};

export default PixelEditor;