import React, { memo } from "react"

export default function File( { data } ){
   let items = data.map(
                   (val,i) =>  <th key = {i}
                                   className = "edge">
                                   {val}
                               </th>
               )
   return <tr>{items}</tr>
}

export const MemoFile = memo(File);
