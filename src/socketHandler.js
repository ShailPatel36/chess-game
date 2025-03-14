import { io } from "socket.io-client";
import { empty } from "./helper-funcs";


export default class socketHandler {
   static #socket = null;
   static #res = null;
    static resolveData(data){
       this.#res(data);
       this.#res = null;
   }

   static init(){
       if(this.#socket) return;
       this.#socket = io("http://localhost:5000");
       this.#socket.on("getdata", (data) => {
           this.resolveData(data);
       });
       this.#socket.on("to", (data) => {
           this.resolveData(data);
       });
       this.#socket.on("from", (data) => {
           this.resolveData(data);
       });
       this.#socket.on("move", (data) => {
           this.resolveData(data);
       });
       this.#socket.on("left", () => {
           this.resolveData(0);
       });
   }

   static newGame(name){
       this.#socket.emit("newgame", name);
   }

   static from(data){
       this.#socket.emit("pt", data);
   }

   static to(data){
       this.#socket.emit("to", data);
   }

   static leaveGame(){
       this.#socket.emit("leavegame");
   }

   static disconnect(){
       this.#socket.emit("end");
   }
  
   static createSuspensfulResource(callback){
       let response, error, promise;
       promise = new Promise((res, rej) => {
           this.#res = res;
           callback();
       })
       .then((res) => (response = res))
       .catch((err) => (error = err));
       return {
           read(){
               if(error) throw error;
               if(response) return response;
               throw promise;
           }           
       }
   }

   static createPromise(callback){
       return new Promise((res, rej) => {
           this.#res = res;
           callback();
       })
   }

   static createNewGame(name){
       return this.createPromise(() => this.newGame(name));
   }

   static makeDataRequest(name){
       return this.createPromise(() => this.getData(name));
   }

   static makeMoveFrom(data){
       return this.createPromise(() => this.from(data));
   }

   static makeMoveTo(data){
       return this.createPromise(() => this.to(data));
   }

   static getMove(){
       return this.createPromise(empty);
   }

   static sendLeaveMessage(){
       return this.createPromise(() => this.leaveGame());
   }
  

   static listenPlayerLeft(){
       return new Promise((res) => {
           this.#socket.on("playerleft", () => {
               res(0);
           })
       })
   }
  
}

