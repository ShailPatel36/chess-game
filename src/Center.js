import { Grid } from "@mui/material"

export default function Center({ children }){
   return  (<Grid
               container
               direction="column"
               justifyContent="center"
               alignItems="center"
               sx = {{ width: '100vw',
                       height: '100vh'}}>
               <Grid
                   justifyContent = "center"
                   display = "flex">
                       {children}
               </Grid>
           </Grid>);
}
