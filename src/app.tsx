import { StateUpdater, useEffect, useState } from 'preact/hooks'
import './app.css'
import PixelEditor from './PixelEditor'
import CanvasDisplay from './CanvasDisplay';

const CONNECT_INDEX = -1
const INK_INDEX = 1
const PIXEL_BLOCK = 4
const STROKE_ROWS = 6
const STROKE_COLS = 6
const TARGET_ROWS = 50
const TARGET_COLS = 100

export function App() {
  const [stroke, setStroke] = useState([[0,0,0]])
  const [target, setTarget] = useState([[0,0,0]])
  const [heat, setHeat] = useState([[0,0,0]])
  
  const zeroSquareArray = (x: number, y: number): number[][] => {
    return Array.from({ length: y }, () => Array(x).fill(0));
  };

  const convolution = (st: number[][], ta: number[][]) => {
    const range_y = ta.length - st.length + 1
    const range_x = ta[0].length - st[0].length + 1
    let connect_min = 0
    let ink_min = 0
    for (let sy = 0; sy < st.length; sy++ ) {
      for (let sx = 0; sx < st[sy].length; sx++ ) {
        if (st[sy][sx] === CONNECT_INDEX ) 
          connect_min += 1;
        if (st[sy][sx] === INK_INDEX) 
          ink_min += 1;
      }
      connect_min -= 1;
      ink_min = Math.floor(ink_min*0.95);
    }    
    const heat: number[][] = zeroSquareArray(range_x, range_y);
    if (!(st.length < ta.length && st[0] && ta[0] && st[0].length < ta[0].length)) 
      return heat;
    
    for (let ty = 0; ty < range_y; ty++ ) {
      for (let tx = 0; tx < range_x; tx++ ) {
        // now scan the full stroke
        let connect = 0;
        let ink = 0
        for (let sy = 0; sy < st.length; sy++ ) {
          for (let sx = 0; sx < st[sy].length; sx++ ) {
            if (st[sy][sx] === CONNECT_INDEX && ta[ty+sy][tx+sx] === st[sy][sx]) 
              connect += 1;
            if (st[sy][sx] === INK_INDEX && ta[ty+sy][tx+sx] >= st[sy][sx]) 
              ink += 1;
          }            
        }
        if (connect >= connect_min && ink >= ink_min)
          heat[ty][tx] = connect + ink;
      }
    }
    return heat;
  };

  const handleStrokeChange = (newStrokeArr: number[][]) => {
    // console.log("app level gets stroke change", newStrokeArr)
    setStroke(newStrokeArr)
    // const heatmap = convolution(newStrokeArr, target)
    // console.log(heatmap)
  };

  const paint = (heatmap: number[][], targetmap) => {
    let warmestScore = 0;
    const range_y = TARGET_ROWS - STROKE_ROWS + 1
    const range_x = TARGET_COLS - STROKE_COLS + 1
    for (let ty = 0; ty < range_y; ty++) {
      for (let tx = 0; tx < range_x; tx++) {
        if (heatmap[ty][tx] > warmestScore) {
          warmestScore = heatmap[ty][tx]; 
        }
      }
    }
    const warms = [];
    for (let ty = 0; ty < range_y; ty++) {
      for (let tx = 0; tx < range_x; tx++) {
        if (heatmap[ty][tx] === warmestScore) {
          warms.push([tx, ty])          
        }
      }
    }
    const bests = warms.length
    if (warmestScore === 0 || bests <= 0) {
      return [0, [0,0]];
    }
    const i = Math.floor(Math.random() * bests)
    // warms[i] is the random chosen best (of possibly several) stroke match.
    for (let ty = 0; ty < STROKE_ROWS; ty++) {
      for (let tx = 0; tx < STROKE_COLS; tx++) {
        if (stroke[ty][tx] === INK_INDEX) {
          targetmap[ty+warms[i][1]][tx+warms[i][0]] = CONNECT_INDEX;
        }  
      }
    }
    return [1, warms[i]]
  };

  const handleTargetChange = (newTargetArr: number[][]) => {
    // console.log("app level gets target change", newTargetArr)
    setTarget(newTargetArr)
    let heatmap = convolution(stroke, newTargetArr)
    console.log("heat", heatmap)
    setHeat(heatmap);
    const targetCopy = JSON.parse(JSON.stringify(newTargetArr));
    let [strokes, pos] = paint(heatmap, targetCopy);
    let limit = 8000
    const brushStrokes = [pos]; 
    while (strokes && limit--) {
      // console.log(brushstrokes)
      heatmap = convolution(stroke, targetCopy);
      [strokes, pos] = paint(heatmap, targetCopy);
      brushStrokes.push(pos)
      // console.log(targetCopy)
    }
    console.log(brushStrokes)
    //setBrushStrokes(brushStrokes)
  };

  return (
      <div>
      <PixelEditor blocks={PIXEL_BLOCK} width={STROKE_COLS*PIXEL_BLOCK} height={STROKE_ROWS*PIXEL_BLOCK} title='stroke'
        colors={['#FF00FF', '#FFFFFF', '#000000']}
        onChange={handleStrokeChange}
        />
      <PixelEditor blocks={PIXEL_BLOCK} width={TARGET_COLS*PIXEL_BLOCK} height={TARGET_ROWS*PIXEL_BLOCK} title='target'
        colors={['#FF00FF', '#FFFFFF', '#000000']}
        onChange={handleTargetChange}
        />
      <CanvasDisplay blocks={PIXEL_BLOCK} width={TARGET_COLS*PIXEL_BLOCK} height={TARGET_ROWS*PIXEL_BLOCK} target={target} heat={heat} stroke={stroke} colors={['#FF00FF', '#FFFFFF', '#000000']}/>
      </div>
  )
}
