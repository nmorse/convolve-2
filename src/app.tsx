import { StateUpdater, useEffect, useState } from 'preact/hooks'
import './app.css'
import PixelEditor from './PixelEditor'

const print = (s) => console.log(s);
const CONNECT_INDEX = -1
const INK_INDEX = 1

export function App() {
  const [stroke, setStroke] = useState([[0,0,0]])
  const [target, setTarget] = useState([[0,0,0]])
  
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
    }    const heat: number[][] = zeroSquareArray(range_x, range_y);
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
    // ta.forEach((taRow, tay)=>{
    //   taRow.array.forEach((taEle, tax) => {
    //     // scan the stroke
    //     st.array.forEach((stRow) => {
    //       stRow.array.forEach((stEle) => {
    //         if (taEle === stEle)
    //           heat[tax, tay]
    //       });
    //     });
    //   });
    // })    
  };
  const handleStrokeChange = (newStrokeArr: number[][]) => {
    // console.log("app level gets stroke change", newStrokeArr)
    setStroke(newStrokeArr)
    // const heatmap = convolution(newStrokeArr, target)
    // console.log(heatmap)
  };

  const handleTargetChange = (newTargetArr: number[][]) => {
    // console.log("app level gets target change", newTargetArr)
    setTarget(newTargetArr)
    const heatmap = convolution(stroke, newTargetArr)
    console.log("heat", heatmap)
  };

  return (
      <div>
      <PixelEditor blocks={20} width={80} height={80} title='stroke'
        colors={['#FF00FF', '#FFFFFF', '#000000']}
        onChange={handleStrokeChange}
        />
      <PixelEditor blocks={20} width={180} height={120} title='target'
        colors={['#FF00FF', '#FFFFFF', '#000000']}
        onChange={handleTargetChange}
        />

      </div>
  )
}
