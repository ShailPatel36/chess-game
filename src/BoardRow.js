import React, { useCallback } from "react";
import { useData } from "./data-provider";
import { select, getVal, dec, mod, asc, empty } from "./helper-funcs";
import { MemoTile } from "./Tile.js";

const  useCust = (rowID,func) => {
   let numStyle = "displayrow";
                                                     
   let { colSize, boardState, onSelect, rowSize } = useData();
   const rowNo = func(rowID, colSize);

   let stateHelper = useCallback((colNo,i,disable) => {
           let styles = ["black","white"];
           let selectedStyle = "selected"
           return disable ?
           mod(rowID,i,styles) :
           select(getVal(boardState, rowNo, colNo),
                  selectedStyle, rowID, i, styles)
   },[]);

   const click = useCallback(
       (colNo, call, disable) => () => call(...dec(rowNo, colNo), disable),
                           []);

   const emptyMemo = useCallback(empty,[]);

   const clickHelper = useCallback((disable) =>
                     disable ?
                     emptyMemo :
                     click,
                     [click,emptyMemo]);


  return { click, stateHelper, numStyle, rowNo, onSelect, rowSize }
  
}


export default function BoardRow( { row, rowId, func, disable } ){
   let {click, stateHelper,
       numStyle, rowNo,
       onSelect, rowSize } = useCust(rowId,func);
   return (<tr>
               <td className = {numStyle}>
                   {asc([rowNo,9])}
               </td>
                   {row.map(
                       (col,i) => {
                           const colNo = func(i, rowSize);
                           return <MemoTile key={i}
                                           click = {click}
                                           style = {stateHelper(colNo, i, disable)}
                                           colNo = {colNo}
                                           listner = {onSelect}
                                           disable = {disable}>
                                       {col}   
                                   </MemoTile>
                       }
                   )}
               <td className = { numStyle }>
                   {asc([rowNo,9])}
               </td>
          </tr>);
}
