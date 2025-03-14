import { createContext, useContext, useReducer, useState } from "react";
const LoginContext = createContext();

export const useLogin = () => useContext(LoginContext);

export default function LoginProvider({children}){
   const [player1, setPlayer1] = useState(sessionStorage.player1);
   const [player2, setPlayer2] = useState();
   const [gameOn, changeGameFlag] = useReducer((val) => !val, false);

   return (
       <LoginContext.Provider value={{player1,
                                      player2,
                                      setPlayer1,
                                      setPlayer2,
                                      gameOn,
                                      changeGameFlag}}>
           {children}
       </LoginContext.Provider>
   );
}
