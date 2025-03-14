import DataProvider from "./data-provider";
import { Routes, Route } from "react-router-dom";
import Game from "./Game";
import Welcome from "./Welcome";
import LoginProvider from "./LoginProvider";
import LoginAuth from "./LoginAuth";
import { BrowserRouter as Router } from 'react-router-dom';
import LoaderText from "./LoaderText";
import GameAuth from "./GameAuth";
import FailureAuth from "./FailureAuth";
import { Suspense } from "react";
import NewGameAuth from "./NewGameAuth";

export default function App() {
   return (<LoginProvider>
       <Router>
           <Routes>
               <Route path="/" element={<Welcome />} />
               <Route path="/login" element={
                   <Suspense fallback={<LoaderText text="Loading, Please Wait" />}>
                       <LoginAuth />
                   </Suspense>} />
               <Route path="/failed" element={
                   <Suspense fallback={<LoaderText text="Loading, Please Wait" />}>
                       <FailureAuth />
                   </Suspense>
               } />
               <Route path="/newgame" element={
                   <Suspense fallback={<LoaderText text="Loading, Please Wait" />}>
                       <NewGameAuth />
                   </Suspense>
               } />
               <Route path="/game" element={
                   <GameAuth>
                       <DataProvider>
                           <Game />
                       </DataProvider>
                   </GameAuth>
               } />
           </Routes>
       </Router>
   </LoginProvider>);
}
