export const reverseData = (data) => [...data].map((val) => {
  if(Array.isArray(val)){
      return [...val].reverse();
  }
  else {
      return val;
  }
}).reverse();

export const deepCopy = (data) => [...data].map((val) => {
if(Array.isArray(val)){
return [...val];
}else return val;          
});

export const divide = (arr,size) => {

}

export const dsc = ([data]) => data;

export const asc = ([data,size]) => size - data;

export const inc = (data) => data.map((val) => val + 1);

export const dec = (...data) => data.map((val) => val - 1);

export const compose = (...funs) => (...vals) => funs.reduce((prev,curr) => curr(prev),vals);

export const mod = (val1,val2,ret) => ((val1 + val2) % 2) === 0 ? ret[0] : ret[1];

export const select = (cond,style,...vals) => cond ? style : mod(...vals);

export const getVal = (data,row,col) => data[row-1][col-1];

export const empty = ()=>{};
