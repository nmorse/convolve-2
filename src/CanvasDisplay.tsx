import { h } from 'preact';
import { useRef, useEffect } from 'preact/hooks';

const CanvasDisplay = ({ target, heat, stroke, width, height, blocks, colors }) => {
  const canvasRef = useRef(null);

  const drawBlock = (ctx: CanvasRenderingContext2D, x: number, y: number, color_index: number, alpha: number) => {
    ctx.fillStyle = color_index === -1 ? `rgba(255, 0, 255, ${alpha})` : color_index ? `rgba(255, 255, 255, ${alpha})` : `rgba(0, 0, 0, ${alpha})`;
    ctx.fillRect(x * blocks, y * blocks, blocks, blocks);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    let minHeat = 0
    for (let sy = 0; sy < stroke.length; sy++) {
      for (let sx = 0; sx < stroke[sy].length; sx++) {
        if (stroke[sy][sx] > 0) {
          minHeat++
        }
      }
    }
    const heatRows = heat.length
    const heatCols = heat[0].length
    for (let ty = 0; ty < heatRows; ty++) {
      for (let tx = 0; tx < heatCols; tx++) {
        if (heat[ty][tx] >= minHeat) {
          for (let sy = 0; sy < stroke.length; sy++) {
            for (let sx = 0; sx < stroke[sy].length; sx++) {
              if (stroke[sy][sx] === 1) { // INK_INDEX)
                drawBlock(ctx, tx+sx, ty+sy, -1, 0.2);
              }
            }
          }
        }
      }
    }
  }, [heat]);


  return (
    <>
    <div>results</div>
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
    />
    </>
  );
};

export default CanvasDisplay;