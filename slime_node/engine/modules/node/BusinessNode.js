const uuidv4 = require("uuid/v4");

const log = require('../../../utility/logger');
const {Utils} = require('../../utility/Func');

const {FlowType, NodeType} = require('../../business/BusinessConstants');

class BUsinessNode {
  _prev = []
  _next = []
  
  _name = null
  _nodeId = null
  _options = null
  
  _loop = 0
  
  result = {
    error: null
    , data: null
    }
    
    constructor(nodeId=uuidv4(), name="", options={}){
      this._name = name;
      this._nodeId = nodeId;
      
      this._options = Object.assign({
        nodeType: NodeType.UNKNOWN
        , flowType: FlowType.PROCESS
        , asynchr: false
        , loop: 5
      }, options);
    }
    
    walk = () => {
      const iam = this;
      
      log.info('@@@ ', '{', iam._nodeId, '}'
        , iam._options.nodeType
        , iam._options.flowType
        , iam.getName());
      
      iam.toNext(1, (_node, _depth)=>{
        const delim = '|-' + Array(_depth).join('-');
        const prevNodes = _node._prev.map((item_=>{ return item._nodeId }).join(', ');
        log.info('@@@ ', delim, _depth, _node._nodeId
          , " [", prevNodes, "] "
          , _node._options.nodeType
          , _node._options.flowType
          , _node.getName());
      });  
    }
    
    getNodeId = () => {
      return this._nodeId;
    }
    
    getName = () => {
      return this._name;
    }
    
    setNodeType = (nodeType) => {
      this._options.nodeType = nodeType;
      return this;
    }
    
    getNodeType = () => {
      return this._options.nodeType;
    }
    
    setFlowType = (flowType) => {
      this._options.flowType = flowType;
      return this;
    }
    
    getFlowType = () => {
      return this._options.flowType;
    }
    
    setData = (data) => {
      this._data = data;
      return this;
    }
    
    getData = () => {
      return this._data;
    }
    
    remove = () => {
      if(!this._next) return;
      try {
        if(this._next.hasNext()){
          for(let elem of this._next){
            elem.remove();
          }
        }
        delete this._prev;
        delete this._next;
        this._prev = [];
        this._next = [];
      }catch(e) {
        log.error(e);
        throw e;
      }
    }
    
    hasNext = () => {
      return !!this._next && this._next.length > 0;
    }
    
    hasPrev = () => {
      return !!this._prev && this._prev.length > 0;
    }
    
    inPrev = (node) => {
      if(!this.hasPrev()) return false;
      let rst = Utils.indexNode(this._prev, node);
      if(typeof(rst) === "number"){
        return parseInt(rst) > -1;
      }else if(typeof(rst) === "object") {
        return rst.length > 0;
      }
      return false;
    }
    
    inNext = (node) => {
      if(!this.hasNext()) return false;
      let rst = Utils.indexNode(this._next, node);
      if(typeof(rst) === "number"){
        return parseInt(rst) > -1;
      } else if(typeof(rst) === "object") {
        return rst.legnth > 0;
      }
      return false;
    }
    
    bindNextItem = (next) => {
      if(!this.inNext(next)){
        this._next.push(next);
        next._prev.push(this);
      }
      return this;
    }
    
    bindPrevItem = (prev) => {
      if(!this.inPrev(prev)) {
        this._prev.push)prev);
        prev._next.push(this);
      }
      return this;
    }
    
    bindNext = (next) => {
      if(Utils.isList(next)){
        for(let _node of next) {
          if(!this.inNext(_node)) this.bindNextItem(_node);
        }
      } else {
        if(!this.inNext(next)) this.bindNextItem(this);
      }
      return this;
    }
    
    bindPrev = (prev) => {
      if(Utils.isList(prev)){
        for(let _node of prev){
          if(!this.inPrev(_node)) this.bindPrevItem(_node);
        }
      } else {
        if(!this.inPrev(prev)) this.bindPrevItem(prev);
      }
      return this;
    }
    
    isInfiniteLoop = () => {
      return this._options.loop != -1 && this._options.loop <= this._loop;
    }
    
    execute(depth, pipe){
      this._loop++;
      const that = this;
      if(that._options.asynchr){
        that.action(depth, pipe)
        .then((result)=>{
          that.result = Object.assign(that.result, { data: result });
          that.toNext(depth + 1, pipe);
        })
        .catch((err)=>{
          that.result = Object.assign(that.result, { error: err });
          throw new NodeActionError(that._nodeId, err);
        });
      }else{
        try{
          let result = that.action(depth, pipe);
          that.result = Object.assign(that.result, { data: result });
          that.toNext(depth + 1, pipe);
        }catch(err){
          that.result = Object.assign(that.result, { error: err });
          throw new NodeActionError(that._nodeId, err);
        }
      }
    }
    
    toNext = (depth=0, pipe=()=>{}) => {
      for(let _node of this._next){
        _node.execute(depth, pipe);
      }
    }
    
    action = (_depth, _pipe) => {
      return _pipe(this, _depth);
    }
  }
  
  module.exports = BusinessNode;
    
    