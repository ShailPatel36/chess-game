import React, {memo} from "react";
import { Typography } from '@mui/material';
import MiddleFlexBox from "./MiddelFlexBox";

export default function DisplayName({children}){
   return (
      <MiddleFlexBox>
            <Typography
               variant="h6"
               sx = {{m : 2}}>
                   {children}
           </Typography>
      </MiddleFlexBox> 
   );
}

export const MemoDisplayName = memo(DisplayName);
