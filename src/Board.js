import React from "react";
import BoardRow from "./BoardRow";
import {MemoFile} from "./File";
import "./Chess.css";


export default function Board( { board, file, func, disable } ){
   return (<table>
               <thead>
                   <MemoFile data = {file} />
               </thead>
               <tbody>
                   { board.map((r,i) =>
                       <BoardRow key = {i}
                                 row = {r}
                                 rowId = {i}
                                 func = {func}
                                 disable = {disable}/>
                   )}
               </tbody>
               <tfoot>
                   <MemoFile data = {file} />
               </tfoot>
          </table>);
}
