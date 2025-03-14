import { useLogin } from './LoginProvider';
import { Navigate } from 'react-router-dom';

export default function GameAuth({children}){
   const { gameOn } = useLogin();
   if(gameOn) return children;
   return <Navigate to="/newgame" replace={true}></Navigate>     
}
