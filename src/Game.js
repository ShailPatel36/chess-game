import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BoardSet from "./BoardSet";
import { MemoButton } from "./Button";
import { useLogin } from "./LoginProvider";
import MiddelFlexBox from "./MiddelFlexBox";
import Status from "./Status";
import { leaveGame } from "./Controller";
import LoaderText from "./LoaderText";

export default function Game(){
   const nav = useNavigate();
   const [status , setStatus] = useState("");
   const [loader, setLoader] = useState(false);
   const {setPlayer2, changeGameFlag} = useLogin();

   const onClick = () => {
     setStatus("Leaving Game..");
     setLoader(true);
     changeGameFlag();
     leaveGame(() => {
       setPlayer2("");
       nav(`/newgame`, { replace : true});
     });
   };
  
   if(loader) return <LoaderText text={status}/>;
  
   return (<>
           <BoardSet />
           <Status />
           <MiddelFlexBox>
                 <MemoButton onSubmit={onClick}>Leave</MemoButton>
           </MiddelFlexBox>
         </>);
}
