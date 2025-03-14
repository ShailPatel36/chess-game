function isValidRank(rank) {

  if (rank) {

      return (rank >= 1 && rank <= 8);

  }

  return false;

}



function isValidRow(row) {

  if (row == null || row == undefined) {

      return false;

  }

  else {

      return (row >= 0 && row <= 7);

  }

}



function isValidCol(col) {

  if (col == null || col == undefined) {

      return false;

  }

  else {

      return (col >= 0 && col <= 7);

  }

}



function isValidTile(row, col) {

  return isValidRow(row) && isValidCol(col);

}





function isValidFile(file) {

  if (file) {

      let list = {

          a: 'a', b: 'b',

          c: 'c', d: 'd',

          e: 'e', f: 'f',

          g: 'g', h: 'h'

      };

      return file in list;

  }

  return false;

}



function fileToCol(file) {

  let v = undefined;

  if (isValidFile(file)) {

      switch (file) {

          case 'a': v = 0; break;

          case 'b': v = 1; break;

          case 'c': v = 2; break;

          case 'd': v = 3; break;

          case 'e': v = 4; break;

          case 'f': v = 5; break;

          case 'g': v = 6; break;

          case 'h': v = 7; break;

          default: v = undefined; break;

      }

  }

  return v;

}





function getPieceFromChar(char, game) {

  switch (char) {

      case '♜': return new Rook("R", false, game);

      case '♞': return new Knight("N", false, game);

      case '♝': return new Bishop("B", false, game);

      case '♚': return new King("K", false, game);

      case '♛': return new Queen("Q", false, game);

      case '♟': return new Pawn("p", false, game);

      case '♖': return new Rook("R", true, game);

      case '♘': return new Knight("N", true, game);

      case '♗': return new Bishop("B", true, game);

      case '♔': return new King("K", true, game);

      case '♕': return new Queen("Q", true, game);

      case '♙': return new Pawn("p", true, game);

      default: return null;

  }

}



class Tile {

  #file = 'a';

  #rank = 1;

  #piece = null;

  constructor(file, rank) {

      if (isValidFile(file) && isValidRank(rank)) {

          this.#file = file;

          this.#rank = rank;

      }

  }

  get row() {

      return this.#rank - 1;

  }

  get col() {

      return fileToCol(this.#file);

  }

  get color() {

      if ((this.row + this.col) % 2 == 0) {

          return false;

      }

      else return true;

  }

  get hasPiece() {

      return !(this.#piece === null);

  }

  get piece() {

      return this.#piece;

  }

  set piece(piece) {

      this.#piece = piece;

  }

  print() {

      console.log(this.#file, this.#rank);

  }

  toString() {

      return `${this.#file}${this.#rank}`;

  }

}



class Board {

  #board = new Array(8);
  #game = null;
  constructor(boardposition, game) {
      this.#game = game;
      for (let rank = 1; rank <= 8; rank++) {

          this.#board[rank - 1] = [];

          for (let file of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {

              let t = new Tile(file, rank);

              t.piece = getPieceFromChar(boardposition[7 - t.row][t.col], this.#game);

              if (t.piece != null && t.piece.color == true) {

                  game.whiteArmy.push(t.piece);

              }

              else {

                  game.blackArmy.push(t.piece);

              }

              if (t.piece != null) {

                  t.piece.tile = t;

                  t.piece.history.push(t);

              }

              this.#board[t.row].push(t);

          }

      }

  }

  get board() {

      return this.#board;

  }

  print() {

      for (let i = 7; i >= 0; i--) {

          console.log(...(this.#board[i].map(element => {

              return element.piece == null ? ' ' : element.piece.id;

          })));

      }

  }

  display() {

      for (let col = 0; col <= 7; col++) {

          console.log("------------------------");

          let str = "";

          for (let row = 7; row >= 0; row--) {

              if (this.#board[row][col].piece != null) {

                  str = str + ` ${this.#board[row][col].piece.id} `;

              }

              else {

                  str = str + "   ";

              }

          }

          console.log(str);

      }

  }



  getTile(row, col) {

      if (row >= 0 && row <= 7 && col >= 0 && col <= 7) {

          let t = this.#board[row][col];

          if (t === undefined) return null;

          return t;

      }

      return null;

  }

  move(piece, tile) {

      return piece.move(tile);

  }

}



class Piece {

  #tile = null;

  #color = false;

  #id = "p";

  #history = [];

  #charCode = " ";

  game = null;

  constructor(id, color, game) {

      this.#id = id;

      this.#color = color;

      this.game = game;

  }

  move(tile) {

      if (tile == null) throw Error("Tile is null");

      if (this.permittedTiles.indexOf(tile) != -1) {

          if (tile.piece != null) {

              this.game.capture = tile.piece;

              if (this.game.status != null) return false;

          }

          tile.piece = this;

          this.tile.piece = null;

          this.tile = tile;

          this.history.push(tile);

          return true;

      }

      return false;

  }

  get permittedTiles() {

      throw new Error("abstract property permittedTiles of Piece class called");

  }

  get tile() {

      return this.#tile;

  }

  set tile(tile) {

      this.#tile = tile;

  }

  get color() {

      return this.#color;

  }

  get id() {

      return this.#id;

  }

  get history() {

      return this.#history;

  }

  get onBoard() {

      return this.#tile != null;

  }

  toString() {

      return `id=${this.#id},color=${this.#color},tile=${this.#tile}`;

  }

}



class Pawn extends Piece {

  constructor(id, color, game) {

      super(id, color, game);

  }

  get charCode() {

      return this.color ? '♙' : '♟';

  }

  get oneforward() {

      if (this.color == true) {

          return this.game.board.getTile(this.tile.row + 1, this.tile.col);

      }

      else {

          return this.game.board.getTile(this.tile.row - 1, this.tile.col);

      }

  }

  get twoforward() {

      if (this.color == true) {

          return this.game.board.getTile(this.tile.row + 2, this.tile.col);

      }

      else {

          return this.game.board.getTile(this.tile.row - 2, this.tile.col);

      }

  }

  get LeftTop() {

      if (this.color == true) {

          return this.game.board.getTile(this.tile.row + 1, this.tile.col - 1);

      }

      else {

          return this.game.board.getTile(this.tile.row - 1, this.tile.col + 1);

      }

  }

  get RightTop() {

      if (this.color == true) {

          return this.game.board.getTile(this.tile.row + 1, this.tile.col + 1);

      }

      else {

          return this.game.board.getTile(this.tile.row - 1, this.tile.col - 1);

      }

  }



  isLeftTopPermitted() {

      let lt = this.LeftTop;

      if (lt == null) return false;

      else {

          if (lt.piece == null) return false;

          else {

              if (lt.piece.color == this.color) return false;

              else return true

          }

      }

  }



  isRightTopPermitted() {

      let rt = this.RightTop;

      if (rt == null) return false;

      else {

          if (rt.piece == null) return false;

          else {

              if (rt.piece.color == this.color) return false;

              else return true;

          }

      }

  }



  isOneForwardPermitted() {

      let onef = this.oneforward;

      if (onef == null) return false;

      if (onef.piece == null) return true;

      else {

          return false;

      }

  }



  isTwoForwardPermitted() {

      if (!this.isOneForwardPermitted) return false;

      let twof = this.twoforward;

      if (twof == null) return false;

      if (twof.piece == null) return true;

      else return false;

  }



  get permittedTiles() {

      let result = null;

      if (!this.onBoard) {

          return result;

      }

      result = [];

      if (this.isOneForwardPermitted()) {

          result.push(this.oneforward);

      }

      if (this.history.length == 1 && this.isTwoForwardPermitted()) {

          result.push(this.twoforward);

      }

      if (this.isLeftTopPermitted()) {

          result.push(this.LeftTop);

      }

      if (this.isRightTopPermitted()) {

          result.push(this.RightTop);

      }

      return result;

  }

}



class Knight extends Piece {

  constructor(id, color, game) {

      super(id, color, game);

  }

  get charCode() {

      return this.color ? '♘' : '♞';

  }



  /* Knight 8 possible moves
      r1,r2,r3,r4,r5,r6,r7,r8
   */



  get r1() {

      if (this.color == true) {

          return this.game.board.getTile(this.tile.row + 1, this.tile.col - 2);

      }

      else {

          return this.game.board.getTile(this.tile.row - 1, this.tile.col + 2);

      }

  }

  get r2() {

      if (this.color == true) {

          return this.game.board.getTile(this.tile.row + 2, this.tile.col - 1);

      }

      else {

          return this.game.board.getTile(this.tile.row - 2, this.tile.col + 1);

      }

  }

  get r3() {

      if (this.color == true) {

          return this.game.board.getTile(this.tile.row + 2, this.tile.col + 1);

      }

      else {

          return this.game.board.getTile(this.tile.row - 2, this.tile.col - 1);

      }

  }



  get r4() {

      if (this.color == true) {

          return this.game.board.getTile(this.tile.row + 1, this.tile.col + 2);

      }

      else {

          return this.game.board.getTile(this.tile.row - 1, this.tile.col - 2);

      }

  }



  get r5() {

      if (this.color == true) {

          return this.game.board.getTile(this.tile.row - 1, this.tile.col + 2);

      }

      else {

          return this.game.board.getTile(this.tile.row + 1, this.tile.col - 2);

      }

  }



  get r6() {

      if (this.color == true) {

          return this.game.board.getTile(this.tile.row - 2, this.tile.col + 1);

      }

      else {

          return this.game.board.getTile(this.tile.row + 2, this.tile.col - 1);

      }

  }

  get r7() {

      if (this.color == true) {

          return this.game.board.getTile(this.tile.row - 2, this.tile.col - 1);

      }

      else {

          return this.game.board.getTile(this.tile.row + 2, this.tile.col + 1);

      }

  }



  get r8() {

      if (this.color == true) {

          return this.game.board.getTile(this.tile.row - 1, this.tile.col - 2);

      }

      else {

          return this.game.board.getTile(this.tile.row + 1, this.tile.col + 2);

      }

  }



  isrPermitted(r) {

      if (r == null) return false;

      if (r.piece == null) return true;

      else {

          if (r.piece.color == this.color) return false;

          else return true;

      }

  }



  get permittedTiles() {

      let result = null;

      if (!this.onBoard) {

          return result;

      }

      result = [];

      if (this.isrPermitted(this.r1)) {

          result.push(this.r1);

      }

      if (this.isrPermitted(this.r2)) {

          result.push(this.r2);

      }

      if (this.isrPermitted(this.r3)) {

          result.push(this.r3);

      }

      if (this.isrPermitted(this.r4)) {

          result.push(this.r4);

      }

      if (this.isrPermitted(this.r5)) {

          result.push(this.r5);

      }

      if (this.isrPermitted(this.r6)) {

          result.push(this.r6);

      }

      if (this.isrPermitted(this.r7)) {

          result.push(this.r7);

      }

      if (this.isrPermitted(this.r8)) {

          result.push(this.r8);

      }

      return result;

  }

}





class Rook extends Piece {

  constructor(id, color, game) {

      super(id, color, game);

  }

  get charCode() {

      return this.color ? '♖' : '♜';

  }



  /* Rook 4 possible directions
      up, down , left , right
   */



  get up() {

      let tile = null;

      let uplocations = [];

      if (this.color == true) {

          for (let row = this.tile.row + 1; row <= 7; row++) {

              tile = this.game.board.getTile(row, this.tile.col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) break;

                  else {

                      uplocations.push(tile);

                      break;

                  }

              }

              else uplocations.push(tile);

          }

      }

      else {

          for (let row = this.tile.row - 1; row >= 0; row--) {

              tile = this.game.board.getTile(row, this.tile.col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) break;

                  else {

                      uplocations.push(tile);

                      break;

                  }

              }

              else uplocations.push(tile);

          }

      }

      return uplocations;

  }



  get down() {

      let tile = null;

      let downlocations = [];

      if (this.color == true) {

          for (let row = this.tile.row - 1; row >= 0; row--) {

              tile = this.game.board.getTile(row, this.tile.col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) break;

                  else {

                      downlocations.push(tile);

                      break;

                  }

              }

              else downlocations.push(tile);

          }

      }

      else {

          for (let row = this.tile.row + 1; row <= 7; row++) {

              tile = this.game.board.getTile(row, this.tile.col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) break;

                  else {

                      downlocations.push(tile);

                      break;

                  }

              }

              downlocations.push(tile);

          }

      }

      return downlocations;

  }





  get left() {

      let tile = null;

      let leftlocations = [];

      if (this.color == true) {

          for (let col = this.tile.col - 1; col >= 0; col--) {

              tile = this.game.board.getTile(this.tile.row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) break;

                  else {

                      leftlocations.push(tile);

                      break;

                  }

              }

              leftlocations.push(tile);

          }

      }

      else {

          for (let col = this.tile.col + 1; col <= 7; col++) {

              tile = this.game.board.getTile(this.tile.row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) break;

                  else {

                      leftlocations.push(tile);

                      break;

                  }

              }

              leftlocations.push(tile);

          }

      }

      return leftlocations;

  }



  get right() {

      let tile = null;

      let rightlocations = [];

      if (this.color == true) {

          for (let col = this.tile.col + 1; col <= 7; col++) {

              tile = this.game.board.getTile(this.tile.row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) break;

                  else {

                      rightlocations.push(tile);

                      break;

                  }

              }

              rightlocations.push(tile);

          }

      }

      else {

          for (let col = this.tile.col - 1; col >= 0; col--) {

              tile = this.game.board.getTile(this.tile.row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) break;

                  else {

                      rightlocations.push(tile);

                      break;

                  }

              }

              rightlocations.push(tile);

          }

      }

      return rightlocations;

  }



  get permittedTiles() {

      let result = null;

      // Piece must not be offboard

      if (!this.onBoard) {

          return result;

      }

      result = [];

      result.push(...this.left);

      result.push(...this.right);

      result.push(...this.up);

      result.push(...this.down);

      return result;

  }

}











class Bishop extends Piece {

  constructor(id, color, game) {

      super(id, color, game);

  }

  get charCode() {

      return this.color ? '♗' : '♝';

  }



  /* Bishop 4 possible directions
      leftup, rightup , leftdown , rightdown
   */



  get leftup() {

      let tile = null;

      let leftuplocations = [];

      if (this.color == true) {

          let row = this.tile.row + 1;

          let col = this.tile.col - 1;

          while (true) {

              tile = this.game.board.getTile(row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) {

                      break;

                  }

                  else {

                      leftuplocations.push(tile);

                      break;

                  }

              }

              leftuplocations.push(tile);

              row++; col--;

              if (row > 7 || col < 0) break;

          }

      }

      else {

          let row = this.tile.row - 1;

          let col = this.tile.col + 1;

          while (true) {

              tile = this.game.board.getTile(row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) {

                      break;

                  }

                  else {

                      leftuplocations.push(tile);

                      break;

                  }

              }

              leftuplocations.push(tile);

              row--; col++;

              if (row < 0 || col > 7) break;

          }

      }

      return leftuplocations;

  }



  get rightup() {

      let tile = null;

      let rightuplocations = [];

      if (this.color == true) {

          let row = this.tile.row + 1;

          let col = this.tile.col + 1;

          while (true) {

              tile = this.game.board.getTile(row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) {

                      break;

                  }

                  else {

                      rightuplocations.push(tile);

                      break;

                  }

              }

              rightuplocations.push(tile);

              row++; col++;

              if (row > 7 || col > 7) break;

          }

      }

      else {

          let row = this.tile.row - 1;

          let col = this.tile.col - 1;

          while (true) {

              tile = this.game.board.getTile(row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) {

                      break;

                  }

                  else {

                      rightuplocations.push(tile);

                      break;

                  }

              }

              rightuplocations.push(tile);

              row--; col--;

              if (row < 0 || col < 0) break;

          }

      }

      return rightuplocations;

  }



  get rightdown() {

      let tile = null;

      let rightdownlocations = [];

      if (this.color == true) {

          let row = this.tile.row - 1;

          let col = this.tile.col + 1;

          while (true) {

              tile = this.game.board.getTile(row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) {

                      break;

                  }

                  else {

                      rightdownlocations.push(tile);

                      break;

                  }

              }

              rightdownlocations.push(tile);

              row++; col++;

              if (row < 0 || col > 7) break;

          }

      }

      else {

          let row = this.tile.row + 1;

          let col = this.tile.col + 1;

          while (true) {

              tile = this.game.board.getTile(row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) {

                      break;

                  }

                  else {

                      rightdownlocations.push(tile);

                      break;

                  }

              }

              rightdownlocations.push(tile);

              row--; col--;

              if (row > 7 || col < 0) break;

          }

      }

      return rightdownlocations;

  }



  get leftdown() {

      let tile = null;

      let leftdownlocations = [];

      if (this.color == true) {

          let row = this.tile.row - 1;

          let col = this.tile.col - 1;

          while (true) {

              tile = this.game.board.getTile(row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) {

                      break;

                  }

                  else {

                      leftdownlocations.push(tile);

                      break;

                  }

              }

              leftdownlocations.push(tile);

              row--; col--;

              if (row < 0 || col < 0) break;

          }

      }

      else {

          let row = this.tile.row + 1;

          let col = this.tile.col + 1;

          while (true) {

              tile = this.game.board.getTile(row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) {

                      break;

                  }

                  else {

                      leftdownlocations.push(tile);

                      break;

                  }

              }

              leftdownlocations.push(tile);

              row++; col++;

              if (row > 7 || col < 7) break;

          }

      }

      return leftdownlocations;

  }





  get permittedTiles() {

      let result = null;

      // Piece must not be offboard

      if (!this.onBoard) {

          return result;

      }

      result = [];

      result.push(...this.leftup);

      result.push(...this.rightup);

      result.push(...this.rightdown);

      result.push(...this.leftdown);

      return result;

  }

}



class Queen extends Piece {

  constructor(id, color, game) {

      super(id, color, game);

  }

  get charCode() {

      return this.color ? '♕' : '♛';

  }



  get up() {

      let tile = null;

      let uplocations = [];

      if (this.color == true) {

          for (let row = this.tile.row + 1; row <= 7; row++) {

              tile = this.game.board.getTile(row, this.tile.col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) break;

                  else {

                      uplocations.push(tile);

                      break;

                  }

              }

              uplocations.push(tile);

          }

      }

      else {

          for (let row = this.tile.row - 1; row >= 0; row--) {

              tile = this.game.board.getTile(row, this.tile.col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) break;

                  else {

                      uplocations.push(tile);

                      break;

                  }

              }

              uplocations.push(tile);

          }

      }

      return uplocations;

  }



  get down() {

      let tile = null;

      let downlocations = [];

      if (this.color == true) {

          for (let row = this.tile.row - 1; row >= 0; row--) {

              tile = this.game.board.getTile(row, this.tile.col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) break;

                  else {

                      downlocations.push(tile);

                      break;

                  }

              }

              downlocations.push(tile);

          }

      }

      else {

          for (let row = this.tile.row + 1; row <= 7; row++) {

              tile = this.game.board.getTile(row, this.tile.col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) break;

                  else {

                      downlocations.push(tile);

                      break;

                  }

              }

              downlocations.push(tile);

          }

      }

      return downlocations;

  }





  get left() {

      let tile = null;

      let leftlocations = [];

      if (this.color == true) {

          for (let col = this.tile.col - 1; col >= 0; col--) {

              tile = this.game.board.getTile(this.tile.row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) break;

                  else {

                      leftlocations.push(tile);

                      break;

                  }

              }

              leftlocations.push(tile);

          }

      }

      else {

          for (let col = this.tile.col + 1; col <= 7; col++) {

              tile = this.game.board.getTile(this.tile.row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) break;

                  else {

                      leftlocations.push(tile);

                      break;

                  }

              }

              leftlocations.push(tile);

          }

      }

      return leftlocations;

  }



  get right() {

      let tile = null;

      let rightlocations = [];

      if (this.color == true) {

          for (let col = this.tile.col + 1; col <= 7; col++) {

              tile = this.game.board.getTile(this.tile.row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) break;

                  else {

                      rightlocations.push(tile);

                      break;

                  }

              }

              rightlocations.push(tile);

          }

      }

      else {

          for (let col = this.tile.col - 1; col >= 0; col--) {

              tile = this.game.board.getTile(this.tile.row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) break;

                  else {

                      rightlocations.push(tile);

                      break;

                  }

              }

              rightlocations.push(tile);

          }

      }

      return rightlocations;

  }







  get leftup() {

      let tile = null;

      let leftuplocations = [];

      if (this.color == true) {

          let row = this.tile.row + 1;

          let col = this.tile.col - 1;

          while (true) {

              tile = this.game.board.getTile(row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) {

                      break;

                  }

                  else {

                      leftuplocations.push(tile);

                      break;

                  }

              }

              leftuplocations.push(tile);

              row++; col--;

              if (row > 7 || col < 0) break;

          }

      }

      else {

          let row = this.tile.row - 1;

          let col = this.tile.col + 1;

          while (true) {

              tile = this.game.board.getTile(row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) {

                      break;

                  }

                  else {

                      leftuplocations.push(tile);

                      break;

                  }

              }

              leftuplocations.push(tile);

              row--; col++;

              if (row < 0 || col > 7) break;

          }

      }

      return leftuplocations;

  }



  get rightup() {

      let tile = null;

      let rightuplocations = [];

      if (this.color == true) {

          let row = this.tile.row + 1;

          let col = this.tile.col + 1;

          while (true) {

              tile = this.game.board.getTile(row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) {

                      break;

                  }

                  else {

                      rightuplocations.push(tile);

                      break;

                  }

              }

              rightuplocations.push(tile);

              row++; col++;

              if (row > 7 || col > 7) break;

          }

      }

      else {

          let row = this.tile.row - 1;

          let col = this.tile.col - 1;

          while (true) {

              tile = this.game.board.getTile(row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) {

                      break;

                  }

                  else {

                      rightuplocations.push(tile);

                      break;

                  }

              }

              rightuplocations.push(tile);

              row--; col--;

              if (row < 0 || col < 0) break;

          }

      }

      return rightuplocations;

  }



  get rightdown() {

      let tile = null;

      let rightdownlocations = [];

      if (this.color == true) {

          let row = this.tile.row - 1;

          let col = this.tile.col + 1;

          while (true) {

              tile = this.game.board.getTile(row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) {

                      break;

                  }

                  else {

                      rightdownlocations.push(tile);

                      break;

                  }

              }

              rightdownlocations.push(tile);

              row++; col++;

              if (row < 0 || col > 7) break;

          }

      }

      else {

          let row = this.tile.row + 1;

          let col = this.tile.col + 1;

          while (true) {

              tile = this.game.board.getTile(row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) {

                      break;

                  }

                  else {

                      rightdownlocations.push(tile);

                      break;

                  }

              }

              rightdownlocations.push(tile);

              row--; col--;

              if (row > 7 || col < 0) break;

          }

      }

      return rightdownlocations;

  }



  get leftdown() {

      let tile = null;

      let leftdownlocations = [];

      if (this.color == true) {

          let row = this.tile.row - 1;

          let col = this.tile.col - 1;

          while (true) {

              tile = this.game.board.getTile(row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) {

                      break;

                  }

                  else {

                      leftdownlocations.push(tile);

                      break;

                  }

              }

              leftdownlocations.push(tile);

              row--; col--;

              if (row < 0 || col < 0) break;

          }

      }

      else {

          let row = this.tile.row + 1;

          let col = this.tile.col + 1;

          while (true) {

              tile = this.game.board.getTile(row, col);

              if (tile == null) break;

              if (tile.piece != null) {

                  if (tile.piece.color == this.color) {

                      break;

                  }

                  else {

                      leftdownlocations.push(tile);

                      break;

                  }

              }

              leftdownlocations.push(tile);

              row++; col++;

              if (row > 7 || col < 7) break;

          }

      }

      return leftdownlocations;

  }





  get permittedTiles() {

      let result = null;

      // Piece must not be offboard

      if (!this.onBoard) {

          return result;

      }

      result = [];

      result.push(...this.leftup);

      result.push(...this.rightup);

      result.push(...this.rightdown);

      result.push(...this.leftdown);

      result.push(...this.up);

      result.push(...this.down);

      result.push(...this.left);

      result.push(...this.right);

      return result;

  }

}







class King extends Piece {

  constructor(id, color, game) {

      super(id, color, game);

  }

  get charCode() {

      return this.color ? '♔' : '♚';

  }



  get permittedTiles() {

      let result = null;

      if (!this.onBoard) {

          return result;

      }

      result = [];

      let isPermitted = (row, col) => {

          if (isValidTile(row, col)) {

              let t = this.game.board.getTile(row, col);

              if (t.piece != null) {

                  if (t.piece.color != this.color) {

                      result.push(t);

                  }

              }

              else result.push(t);

          }

      }

      let row = this.tile.row;

      let col = this.tile.col;

      //lefttop

      if (this.color == true) {

          row = this.tile.row + 1;

          col = this.tile.col - 1;

      }

      else {

          row = this.tile.row - 1;

          col = this.tile.col + 1;

      }

      isPermitted(row, col);

      //top

      if (this.color == true) {

          row = this.tile.row + 1;

          col = this.tile.col;

      }

      else {

          row = this.tile.row - 1;

          col = this.tile.col;

      }

      isPermitted(row, col);

      //right top

      if (this.color == true) {

          row = this.tile.row + 1;

          col = this.tile.col + 1;

      }

      else {

          row = this.tile.row - 1;

          col = this.tile.col - 1;

      }

      isPermitted(row, col);

      //right

      if (this.color == true) {

          row = this.tile.row;

          col = this.tile.col + 1;

      }

      else {

          row = this.tile.row;

          col = this.tile.col - 1;

      }

      isPermitted(row, col);

      //right down

      if (this.color == true) {

          row = this.tile.row - 1;

          col = this.tile.col + 1;

      }

      else {

          row = this.tile.row + 1

          col = this.tile.col - 1;

      }

      isPermitted(row, col);

      //down

      if (this.color == true) {

          row = this.tile.row - 1;

          col = this.tile.col;

      }

      else {

          row = this.tile.row + 1

          col = this.tile.col;

      }

      isPermitted(row, col);

      //left down

      if (this.color == true) {

          row = this.tile.row - 1;

          col = this.tile.col - 1

      }

      else {

          row = this.tile.row + 1

          col = this.tile.col + 1;

      }

      isPermitted(row, col);

      //left

      if (this.color == true) {

          row = this.tile.row;

          col = this.tile.col - 1

      }

      else {

          row = this.tile.row;

          col = this.tile.col + 1;

      }

      isPermitted(row, col);

      return result;

  }

}





class Player {

  #username

  #side

  constructor(username, side) {

      this.#username = username;

      this.#side = side;

  }

  toString() {

      return `Username ${this.#username} side ${this.#side}`;

  }

  get userName() {

      return this.#username;

  }

  get side() {

      return this.#side;

  }

}



class Game {

  #turn = true;

  #status = null;

  #player1

  #player2

  #board

  #whiteArmy = [];

  #blackArmy = [];

  #capturedWA = [];

  #capturedBA = [];

  #history = []

  newGame() {
      this.#turn = true;
      this.#status = null;
      this.#player1 = new Player("amit", true);
      this.#player2 = new Player("pradeep", false);
      this.#board = new Board(boardposition, this);
      this.#whiteArmy = [];
      this.#blackArmy = [];
      this.#capturedWA = [];
      this.#capturedBA = [];
      this.#history = [];
  }

  get status() {

      return this.#status;

  }

  set status(v) {

      this.#status = v;

  }

  #createWhiteArmy() {

      for (let i = 1; i <= 8; i++) {

          this.#whiteArmy.push(new Pawn(`p${i}`, true));

      }

      for (let j = 1; j <= 2; j++) {

          this.#whiteArmy.push(new Rook(`R${j}`, true));

          this.#whiteArmy.push(new Knight(`N${j}`, true));

          this.#whiteArmy.push(new Bishop(`B${j}`, true));

      }

      this.#whiteArmy.push(new Queen("Q", true));

      this.#whiteArmy.push(new King("K", true));

  }



  #createBlackArmy() {

      for (let i = 1; i <= 8; i++) {

          this.#blackArmy.push(new Pawn(`p${i}`, false));

      }

      for (let j = 1; j <= 2; j++) {

          this.#blackArmy.push(new Rook(`R${j}`, false));

          this.#blackArmy.push(new Knight(`N${j}`, false));

          this.#blackArmy.push(new Bishop(`B${j}`, false));

      }

      this.#blackArmy.push(new Queen("Q", false));

      this.#blackArmy.push(new King("K", false));

  }

  get history() {

      return this.#history;

  }

  get capturedBA() {

      return this.#capturedBA;

  }

  get capturedWA() {

      return this.#capturedWA;

  }

  get whiteArmy() {

      return this.#whiteArmy;

  }

  get blackArmy() {

      return this.#blackArmy;

  }

  get player1() {

      return this.#player1;

  }

  set player1(player) {

      if (player != null) {

          this.#player1 = player;

      }

  }

  get player2() {

      return this.#player2;

  }

  set player2(player) {

      if (player != null) {

          this.#player2 = player;

      }

  }

  get board() {

      return this.#board;

  }

  set board(board) {

      if (board != null) {

          this.#board = board;

      }

  }

  set capture(piece) {

      if (piece != null) {

          if (piece instanceof King) {

              if (piece.color == true) {

                  this.status = "Black";

                  return;

              }

              else {

                  this.status = "White";

                  return;

              }

          }

          piece.tile = null;

          if (piece.color == true) {

              this.#capturedWA.push(piece);

          }

          else {

              this.#capturedBA.push(piece);

          }

      }

  }

  move(tile1, tile2) {

      if (tile1 == tile2) return false;

      if (tile1 == null) return false;

      if (!tile1.hasPiece) return false;

      if (tile1.piece.color != this.#turn) return false;

      if (tile2 === null) return false;

      if (tile2.hasPiece && tile2.piece.color == this.turn) return false;

      let r = this.#board.move(tile1.piece, tile2);

      if (r) this.history.push({

          form: tile1,

          to: tile2,

          piece: tile1.peice

      });

      let b = [

          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

      ];

      for (let row = 0; row <= 7; row++) {

          for (let col = 0; col <= 7; col++) {

              let t = this.#board.getTile(row, col);



              if (t.piece != null) {

                  b[7 - row][col] = t.piece.charCode;

              }

          }

      }

      this.turn = !this.turn;

      if (this.status) return { board : b, status : this.status};

      return b;

  }

  get turn() {

      return this.#turn;

  }


  getBoard() {
      let b = [

          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

          [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],

      ];

      for (let row = 0; row <= 7; row++) {

          for (let col = 0; col <= 7; col++) {

              let t = this.#board.getTile(row, col);



              if (t.piece != null) {

                  b[7 - row][col] = t.piece.charCode;

              }

          }

      }

      return b;
  }

  isOver() {
      return this.status;
  }

  set turn(v) {

      this.#turn = v;

  }

}



let boardposition = [
  ['♜', '♞', '♝', '♚', '♛', '♝', '♞', '♜'],
  ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
  ['♖', '♘', '♗', '♔', '♕', '♗', '♘', '♖']
];



const createNewGame = () => {
  let game = new Game();
  game.newGame();
  return game;
}


module.exports = { createNewGame };  

