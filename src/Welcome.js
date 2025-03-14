import React from "react";
import { Grid, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import LogicButton from './Button';

export default function Welcome(){
   const nav = useNavigate();
   const onContinue = () => { nav(`/login`,{replace: true}); };
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
               Welcome to Chaturanga!
           </Typography>
       </Grid>


       <Grid
           justifyContent = "center"
           display = "flex">
           <LogicButton onSubmit={onContinue}>
               Continue
           </LogicButton>
       </Grid>
     </Grid>
   );
}
