import { useMemo } from "react";
import Board from "./Board";
import { useData } from "./data-provider";
import DisplayName from "./DisplayName";
import {compose, reverseData, inc, dsc, asc} from "./helper-funcs"
import { useLogin } from "./LoginProvider";
import MiddelFlexBox from "./MiddelFlexBox";

export default function BoardSet(){
   let {board, file, turn, gameOver, side} = useData();
   const {player1, player2} = useLogin();
   const getStatus = (val) => gameOver ? true : val;
   const memoReverseFile = useMemo(()=> reverseData(file), [file]);
   return  (<>
       <MiddelFlexBox>
            <DisplayName>{`${player1} VS ${player2}`}</DisplayName>
      </MiddelFlexBox>
      <MiddelFlexBox>
             {side === "white"
             && <Board board = {board}
                    file  = {file}
                    func  = {compose(inc,dsc)}
                    disable = {getStatus(turn)}/>}
             {side === "black"
             && <Board board = {reverseData(board)}
                    file  = {memoReverseFile}
                    func  = {compose(inc,asc)}
                    disable = {getStatus(turn)}/>}
           
      </MiddelFlexBox>
   </>)
}
