const {FlowType, NodeType} = require('../../business/BusinessConstants');
const {Utils} = require('../../utility/Func');
const BusinessNode = require('../node/BusinessNode');

class AbstractParser {
  createNode (_key, _value){}
  build(){}
  
  parse(_process){
    const root = new BusinessNode(_process.id, _process.name, {
      nodeType: NodeType.ROOT
      , flowType: FlowType.START
    });
    
    const nodeMapper = {};
    
    for(let [key, value] of Object.entries(_process)){
      if(typeof(value) === "object"){
        if(Utils.isList(value)){
          for(let _node of value){
            nodeMapper[_node.id] = this.createNode(key, _node);
          }
        }else{
          nodeMapper[value.id] = this.createNode(key, value);
        }
      }
    }
    
    for (let [ _, obj ] of Object.entries(nodeMapper)){
      if(!!obj.prevId){
        let nodeList = [];
        if(Utils.isList(obj.prevId)){
          for(let _id of obj.prevId){
            if(!_id || !nodeMapper[_id]) continue;
            nodeList.push(nodeMapper[_id].node);
          }
        }else nodeList.push(nodeMapper[obj.prevId].node);
        obj.node.bindPrev(nodeList);
      }
      
      if(!!obj.nextId){
        let nodeList = [];
        if(Utils.isList(obj.nextId)){
          for(let _id of obj.nextId){
            if(!_id || !nodeMapper[_id]) continue;
            nodeList.push(nodeMapper[_id].node);
          }
        }else nodeList.push(nodeMapper[obj.nextId].node);
        obj.node.bindNext(nodeList);
      }else{
        obj.node.bindNext([ new BusinessNode()
          .setNodeType(NodeType.EVENT)
          .setFlowType(FlowType.END) ]);
      }
    }
    
    let startNodes = Object.entries(nodeMapper).filter(([key, obj])=>{
      return obj.node.getNodeType() === NodeType.EVENT
        && obj.node.getFlowType() === FlowType.START
          && !obj.node.hasPrev();
    });
    
    for(let [key, obj] of startNodes){
      obj.node.bindPrev(root);
    }
    
    return root;
  }
}

class InfiniteLoopError extends Error {
  constructor(nodeKey){
    super('infinite loop error');
    this.nodeKey = nodeKEy;
  }
}

class NodeActionError extends Error {
  constructor(nodeKey, error){
    super('action error');
    this.nodeKey = nodeKey;
    this.error = error;
  }
}

module.exports = {
  AbstractParser
  , InfiniteLoopError
  , NodeActionError
};
 