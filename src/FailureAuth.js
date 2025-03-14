import { Navigate } from 'react-router-dom';
import { checkLoginStatus } from './Controller';
import Failed from './Failed';

let promise = null;

const get = () => {
   if (promise === null) promise = checkLoginStatus();
   return promise.read();
};


export default function FailureAuth(){
   const ret = get();
   promise = null;
   if(ret.status === "loggedIn") return <Navigate to="/newgame" replace={true}/>;
   if(ret.status === "failed") return <Failed/>;
   if(ret.status === "login") return <Navigate to="/login" replace={true}/>;
}
