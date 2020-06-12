const Utils = {
  isList: (obj)=>{
    return typeof(obj) === 'object' && Reflect.has(obj, 'length');
  },
  indexNode: (list, node, first=true) => {
    let indexes = [];
    for(let i = 0 ; i < list.length ; i++){
      if(list[i].getNodeId() == node.getNodeId()){
        if(first){
          return i;
        }else{
          indexes.push(i);
        }
      }
    }
    return indexes.length > 0? indexes : -1;
  }
}

module.exports = {
  Utils
}  