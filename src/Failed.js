import Center from "./Center";
import { Typography } from '@mui/material';

export default function Failed() {
   return (<Center>
       <Typography variant="h5"
           sx={{ m: 2 }}>
           You have exhausted all your tries, Please Try Again Later!
       </Typography>
   </Center>);
}
