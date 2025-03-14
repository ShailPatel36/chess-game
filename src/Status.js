import { useData } from "./data-provider";
import { useLogin } from "./LoginProvider";
import MiddelFlexBox from "./MiddelFlexBox";
import { MemoDisplayName } from "./DisplayName";


export default function Status(){
   const { status } = useData();
   const { player2 } = useLogin();
   let text;
   switch(status){
       case "Waiting for other player" : text = `Waiting for ${player2} to make a move..`; break;
       default: text = status;
   }
   return (<MiddelFlexBox>
               <MemoDisplayName>{text}</MemoDisplayName>
           </MiddelFlexBox>);
 
}
