import Button from '@mui/material/Button';
import { memo } from 'react';

export default function LogicButton({children, onSubmit}){
   return (
       <Button variant="contained"
       sx = {{m : 2}}
       onClick={onSubmit}>{children}</Button>
   );
}

export const MemoButton = memo(LogicButton);
