import { empty } from "./helper-funcs"
import { memo } from "react";

export default function Tile({ style, click = empty, children, colNo, listner, disable}){
   return (<>
            <td onClick = {click(colNo, listner, disable)}
                className = {style}>
                { children }
            </td>
          </>);
}

export const MemoTile = memo(Tile,
      (oldProp,newProp) => {
                           return ((oldProp.style === newProp.style)
                           && (oldProp.children === newProp.children)
                           && (oldProp.click === newProp.click)
                           && (oldProp.disable === newProp.disable))});
