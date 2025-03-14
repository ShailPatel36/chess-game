import React, { useState, useContext, createContext, useReducer, useEffect } from "react";
import data from "./data.json"
import { getPermittedTiles, getMove,
        makeMove, gameData, listenPlayerLeft } from "./Controller";
import { asc, deepCopy } from "./helper-funcs";
import { useLogin } from "./LoginProvider";

// Creating a Context
const DataContext = createContext();
let movePhase = false;
// Custom Hook
export const useData = () => useContext(DataContext);
const changePhase = () => movePhase = !movePhase;

const updateBoardTiles = (board,tiles) => {
   for(let v of tiles){
       board[asc([v.row,7])][v.col] = true;
   }
}

const clearSelectedTiles = (board) => {
   for(let i in board){
       for(let j in board[i]){
           board[i][j] = false;
       }
   }
}

function changeBoardState(setBoardState, func, board, tiles = {} ) {
   const newBoard = [...board];
   func(newBoard, tiles)
   setBoardState(newBoard);
}


const getData = (key) => {
   if(!data[key]){
       switch(key){
           case "board" : return deepCopy(gameData.board);
           case "turn" : return gameData.freeze;
           case "side" : return gameData.side;
           case "gameWon" : return { won : false};
           case "movePhase" : return false;
           case "status" : {
               if(gameData.freeze === true) {
                   return "Waiting for other player";
               }
               return "Your Turn!";
           }
           default : new Error("Bad Value");
       }
   }
   return deepCopy(data[key]);
}  

export const clearData = () => {
   ["board",
    "state",
    "turn",
    "gameWon",
    "movePhase"].forEach((val) => sessionStorage.removeItem(val));
};


// A componenet which creates and returns the Context Provider
export default function DataProvider({ children }){
   const {player2} = useLogin();
   const [board, setBoard] = useState(getData("board"));
   const [boardState, setBoardState] = useState(getData("state"));
   const [file] = useState(data.file);
   const [rowSize] = useState(8);
   const [colSize] = useState(8);
   const [turn,changeTurn] = useReducer((val) => !val,getData("turn"));
   const [side, _] = useState(getData("side"));
   const [status, setStatus] = useState(getData("status"));
   const [gameOver, over] = useReducer((val) => !val, false);

   useEffect(() => {
       if(side === "black"){
           getMove((board) => {
               setBoard(board);
               setStatus("Your Turn!");
               changeTurn();
           });
       }
   },[]);

   useEffect(() => {
       listenPlayerLeft(() => {
           over();
           setStatus(`${player2} has left the game, Game Over!`);
       });
   }, []);

   const onSelect = (row, col, disable) => {
       if(disable) return;
       if(movePhase){
           changePhase();
           changeTurn();
           changeBoardState(setBoardState, clearSelectedTiles, boardState);
           setStatus("Waiting for Server..");
           makeMove(row, col, (data) => {
               const endGame = (data) => {
                   setBoard(data.board);
                   const helper = (val) => {
                       if(val === side) setStatus(`You Win!`);
                       else setStatus(`${player2} Wins!`);
                   }
                   switch(data.status){
                       case "Black" : helper("black");break;
                       case "White" : helper("white");break;
                   }          
                   over();
               };

               if(data === "invalid"){
                   setStatus("Your Turn!");
                   changeTurn();
               }
               else if(Array.isArray(data)){
                   setStatus("Waiting for other player");
                   setBoard(data);
                   getMove((data) => {
                       if(Array.isArray(data)){
                           setBoard(data);
                           setStatus("Your Turn!");
                           changeTurn();
                           return;
                       }
                       endGame(data);
                   });
               }
               else endGame(data);
           });
       }
       else {
           changePhase();
           changeTurn();
           setStatus("Waiting for Server..");
           getPermittedTiles(row, col, (pt) => {
               setStatus("Your Turn!");
               changeTurn();
               if(pt === "invalid")
               {  
                   changePhase();
                   return;
               }
             
               changeBoardState(setBoardState, updateBoardTiles, boardState, pt);
           });
          
       }
   }

   return (<DataContext.Provider value={{board,
                                       file,
                                       movePhase,
                                       onSelect,
                                       rowSize,
                                       colSize,
                                       boardState,
                                       turn,
                                       side,
                                       status,
                                       gameOver}}>
           {children}
          </DataContext.Provider>)
}
