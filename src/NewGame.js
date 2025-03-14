import React, { useEffect, useState } from "react";
import { Grid, Typography } from '@mui/material';
import {  useNavigate } from "react-router-dom";
import LogicButton from './Button';
import { createNewGame, disconnect, initSocket, logout } from "./Controller";
import { useLogin } from "./LoginProvider";
import LoaderText from "./LoaderText";


export default function NewGame({name}){
   const nav = useNavigate();
   const {setPlayer1, setPlayer2, changeGameFlag} = useLogin();
   const [status , setStatus] = useState("");
   const [loader, setLoader] = useState(false);

   const onNewGame = () => {
       setStatus("Created New Game, Searching for another Player...");
       setLoader(true);
       createNewGame(name, (player1, player2) => {
           setPlayer1(player1);
           setPlayer2(player2);
           changeGameFlag();
           nav(`/game`,{replace: true});
       });
   };

   const onLogout = () => {
       setStatus("Loggin Out...");
       setLoader(true);
       disconnect();
       logout(() => nav(`/login`,{replace: true}));
   };

   useEffect(() => {
       initSocket();
   }, []);

   if(loader) return <LoaderText text={status}/>;

   return (
       <Grid
       container
       direction="column"
       justifyContent="center"
       alignItems="center"
       sx = {{ width: '100vw',
       height: '100vh'}}
     >
       <Grid
           justifyContent = "center"
           display = "flex">
           <Typography variant="h5"
           sx = {{m : 2}}>
              Start a New Game!
           </Typography>
       </Grid>


       <Grid
           justifyContent = "center"
           display = "flex">
           <LogicButton onSubmit={onNewGame}>
               New Game
           </LogicButton>
       </Grid>

       <Grid
           justifyContent = "center"
           display = "flex">
           <LogicButton onSubmit={onLogout}>
               Logout
           </LogicButton>
       </Grid>
     </Grid>
   );
}
