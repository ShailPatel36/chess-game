import React, { useEffect, useReducer } from 'react';
import TextField from '@mui/material/TextField';
import { Grid, Typography } from '@mui/material';
import { useState } from "react";
import { Navigate } from 'react-router-dom';
import LogicButton from './Button';
import { checkLogin } from './Controller.js';
import { useRef } from 'react';

export default function Login({tries}) {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [count, setCount] = useState(tries);
   const promise = useRef();
   const btnClicked = useRef();

   const valsEmpty = () => username === "" && password === "";

   const get = (username, password, count) => {
       if(!promise.current) promise.current = checkLogin(username, password, count);
       return promise.current.read();
   };

   if (count > 0 && btnClicked.current) {
       const ret = get(username, password, count);
       if (ret.status === "failed") return <Navigate to="/failed" replace={true}/>;
       if (ret.status === "success") return <Navigate to="/newgame" replace={true} />;
       btnClicked.current = false;
       if (ret.status === "restart") return <Navigate to="/"/>;
   }

   const setUsernameHelper = (e) => { setUsername(e.target.value) };
   const setPasswordHelper = (e) => { setPassword(e.target.value) };

   const onSubmit = () => {
       if (valsEmpty()) return;
       promise.current = null;
       btnClicked.current = true;
       setCount(prev => prev + 1);
   }

   return (
       <Grid
           container
           direction="column"
           justifyContent="center"
           alignItems="center"
           sx={{
               width: '100vw',
               height: '100vh'
           }}
       >
           <Grid
               justifyContent="center"
               display="flex">
               <Typography variant="h5"
                   sx={{ m: 2 }}>
                   Login
               </Typography>
           </Grid>

           {(count > 0) && <Grid
               justifyContent="center"
               display="flex">
               <Typography variant="h7"
                   sx={{ m: 2 }}>
                   Wrong usename or password, You have only {3 - count} tries left, Please try again!
               </Typography>
           </Grid>}

           <Grid
               justifyContent="center"
               display="flex">
               <TextField id="outlined-basic"
                   label="Username"
                   variant="outlined"
                   defaultValue=""
                   onChange={setUsernameHelper}
                   sx={{ m: 2 }} />
           </Grid>


           <Grid
               justifyContent="center"
               display="flex">
               <TextField id="outlined-password-input"
                   label="Password"
                   type="password"
                   defaultValue=""
                   variant="outlined"
                   onChange={setPasswordHelper}
                   sx={{ m: 2 }} />
           </Grid>


           <Grid
               justifyContent="center"
               display="flex">
                   <LogicButton onSubmit={onSubmit}>Submit</LogicButton>
           </Grid>
       </Grid>)
}
