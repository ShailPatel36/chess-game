const Manager = require("./manager");
const queue = require("./queue");

class gameManager {
   static #managerQueue = new queue();
   static #activeGames = [];

   static manager(socket){
       console.log("Player Connected");
       socket.on("newgame", (data) => {
           socket.name = data;
           this.init(socket);
       });
       socket.on("end", () => {
           console.log("Player Disconnected");
           socket.disconnect(false)
       });
   }

   static init(socket) {
       if(this.#managerQueue.isThereElement()){
           const man = this.#managerQueue.dequeue();
           man.init(socket); 
           this.activateGame(man);
       }else{
           const man = new Manager(this);
           man.init(socket);
           this.#managerQueue.enqueue(man);
       }
   }

   static activateGame(man){
       this.#activeGames.push(man);
   }

   static deactivateGame(man){
       if(!man) return;
       const index = this.#activeGames.indexOf(man);
       if(index !== -1) this.#activeGames.splice(index, 1);
       man.removed = true;
   }
}

module.exports = gameManager;
