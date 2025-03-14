class queue{
  #ds = [];

  isThereElement(){
      return this.#ds.length > 0;
  }

  dequeue(){
      const val = this.#ds.shift();
      return val;
  }

  enqueue(val){
      this.#ds.push(val);
  }
}

module.exports = queue;
