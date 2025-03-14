let { createNewGame } = require('./game');

class Manager {
   #turn = true;
   #whitePlayer = null;
   #blackPlayer = null;
   #from;
   #to;
   #game;
   #gameManager = null;
   #pt = null;
   removed = false;

   constructor(gameManager){
       console.log("New Game Created");
       this.#gameManager = gameManager;
       this.#game = createNewGame();
   }

   isBlack(){
       return this.#whitePlayer;
   }
  
   isWhite(){
       return !this.#whitePlayer;
   }

   isGameOn() {
      return this.#whitePlayer && this.#blackPlayer;
   }

   getBoard(){ return this.#game.getBoard(); }

   getSide(side) {
       if(side === "black") return this.#blackPlayer;
       else return this.#whitePlayer;
   }

   getOthersName(side){
       if(side === "black") return this.#whitePlayer.name;
       else return this.#blackPlayer.name;
   }

   sendMove(data) {
       if (!this.#turn) this.#whitePlayer.emit("move", data);
       else this.#blackPlayer.emit("move", data);
   }

   createData(side){
       const freeze = this.toFreeze(side);
       const name = this.getOthersName(side);
       return {
           board: this.getBoard(),
           freeze,
           name,
           side
       };
   }
  
   initSocket(socket){
       if (this.isBlack()) {
           this.saveSocket(socket, "black");
           this.emitToSockets("black" ,"getdata", this.createData("black"));
           this.emitToSockets("white" ,"getdata", this.createData("white"));
       }
       else if(this.isWhite()) this.saveSocket(socket, "white");
   }

   emitToSockets(side, emit, data){
       this.getSide(side).emit(emit, data);
   }

   saveSocket(socket, side){
       socket.inUse = true;
       socket.side = side;
       this.write(side, socket);
   }

   toFreeze(side){
       if(side === "black" && !this.#turn) return false;
       else if(side === "white" && this.#turn) return false;
       return true;
   }

   write(side, val){
       if(side === "black") this.#blackPlayer = val;
       else this.#whitePlayer = val;
   }

   emitLeft(side){
       if(side === "black") this.#whitePlayer.emit("playerleft");
       else this.#blackPlayer.emit("playerleft");
   }

   playerLeft(socket){
       if(!this.removed) this.#gameManager.deactivateGame(this);
       if(!this.isGameOn()) {
           this.write(socket.side, null);
           return;
       }
       if(this.#game.isOver()) return;
       this.emitLeft(socket.side);
       this.write(socket.side, null);
   }


   removeConf(socket){
       socket.side = null;
       socket.removeAllListeners("getdata");
       socket.removeAllListeners("leavegame");
       socket.removeAllListeners("pt");
       socket.removeAllListeners("to");
       socket.removeAllListeners("disconnect");
   }

   init(socket){
       console.log("Player Joined a Game");

       socket.on("getdata", () => {
           socket.emit("getdata", this.createData(socket.side));
       });

       socket.on("leavegame", () => {
           console.log(`Player ${socket.name} leaving game`);
           this.playerLeft(socket);
           this.removeConf(socket);
           socket.emit("left");
       });
      
       socket.on("pt", (data) => {
           if (!this.isGameOn()) return socket.emit("from", "invalid");
           this.#from = this.#game.board.getTile(data.row, data.col);
           if(!this.#from) return socket.emit("from", "invalid");
           if (!this.#from.piece) return socket.emit("from", "invalid");
           if (this.#from.piece.color !== this.#turn) return socket.emit("from", "invalid");
           let permittedTiles = this.#from.piece.permittedTiles;
           permittedTiles = permittedTiles.map(element => {
               return {
                   row: element.row,
                   col: element.col
               }
           });
           this.#pt = permittedTiles;
           socket.emit("from", permittedTiles);
       });
  
       socket.on("to", (data) => {
           for(let v of this.#pt){
               if(v.row === data.row && v.col === data.col) {
                   this.#to = this.#game.board.getTile(data.row, data.col);
                   const ret = this.#game.move(this.#from, this.#to);
                   this.#to = null;
                   this.#from = null;
                   this.#pt = null;
                   socket.emit("to", ret);
                   this.sendMove(ret);
                   this.#turn = !this.#turn;
                   return;
               }
           }
           socket.emit("to", "invalid");
       })
      
       socket.on('disconnect', () => {
           console.log('Player disconnected');
           this.playerLeft(socket);
       });

       this.initSocket(socket);
   }
}

module.exports = Manager;
