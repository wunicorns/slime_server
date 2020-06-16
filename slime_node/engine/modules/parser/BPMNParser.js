const log = require('../../../utility/logger');
const parser = require('xml2json');
const {AbstractParser} = require('./BusinessParser');
const {BPMNNode} = require('../node/BPMNNode');
const {FlowType, NodeType} = require('../../business/BusinessConstants');
const {Utils} = require('../../utility/Func');

class BPMNParser extends AbstractParser {
  discover(store, obj){
    for(let [_key, _value] of Object.entries(obj)){
      const key = this.keyParse(_key);
      if(typeof(_value) === "object"){
        if(!!_value.length){
          let subobj = [];
          for(let elem of _value){
            if(typeof(elem) === "string"){
              subobj.push(elem);
            }else{
              let substore = {};
              this.discover(substore, _value);
              subobj.push(substore);
            }
            store[key] = subobj;
          }
        } else {
          let substore = {};
          this.discover(substore, _value);
          store[key] = substore;
        }
      } else {
        store[key] = _value;
      }
    }
      return store;
  }
    
    createNode(key, xmlNode){
      const new_node = this.typeMatch(key, xmlNode);
      const keyword = this.checkKeyword(new_node);
      
      let prev = null;
      let next = null;
      
      const data = {};
      for(let valueKey in xmlNode){
        let obj = xmlNode[valueKey];
        if(valueKey.endsWith(keyword.prev)){
          prev = obj;
        }else if(valueKey.endsWith(keyword.next)){
          next = obj;
        }else {
          const key = this.keyParse(valueKey);
          if(typeof(obj) === "string"){
            data[key] = obj;
          }else {
            this.discover(data, obj);
          }
        }
      }
      new_node.setData(data);
      return {
        'node': new_node
        , 'prevId': prev ? (prev['$t'] ? prev['$t'] : prev) : null
        , 'nextId': next ? (next['t$'] ? next['$t'] : next) : null
      };
    }
    
    typeMatch(key, xmlNode){
      const id = xmlNode.id;
      const name = xmlNode.name;
      if(!id) return;
      let node = new BPMNNode(id, name);
      switch(this.keyParse(key)){
        case 'startEvent':
          node.setNodeType(NodeType.EVENT).setFlowType(FlowType.START);
          break;
        case 'endEvent':
          node.setNodeType(NodeType.EVENT).setFlowType(FlowType.END);
          break;
        case 'sequenceFlow':
          node.setNodeType(NodeType.PIPE);
          break;
        case 'task':
          node.setNodeType(NodeType.TASK);
          break;
        case 'intermediateThrowEvent':
          node.setNodeType(NodeType.EVENT);
          break;
        case 'receiveTask':
          node.setNodeType(NodeType.TASK);
          break;
        case 'intermediateCatchEvent':
          node.setNodeType(NodeType.EVENT);
          break;
        case 'userTask':
          node.setNodeType(NodeType.TASK);
          break;
        case 'dataStoreReference':
          node.setNodeType(NodeType.STORAGE);
          break;
        default:
          log.debug("unknown node type");
          break;  
      }
      return node;
    }
    
    checkKeyword(__node){
      let prevKeyword = "incoming";
      let nextKeyword = "outgoing";
      if(__node.getNodeType() == NodeType.PIPE){
        prevKeyword = "sourceRef";
        nextKeyword = "targetRef";
      }
      return { prev: prevKeyword, next: nextKeyword };
    }
    
    keyParse(key){
      return key.indexOf(":") > -1 ? key.substring(key.indexOf(":")+1) : key;
    }
    
    build(next) {
      const processes = [];
      const textParsed = parser.toJson(text, { reversible: true });
      const json = JSON.parse(textParsed);
      
      /*
      this.xmlns = [];
      for(let _root in this._spec){
        for(let xmlns in _root){
          if(xmlns.startsWith(xmlns)){
            this.xmlns.push(xmlns.substring(6));
          }
        }
      }
      */
      
      for(let _root in json){
        for(let [key, $process] of Object.entries(json[_root])){
          if(typeof($process) === "object"){
            if(key.endsWith("process")){
              if(!!$process){
                if(Utils.isList($process)){
                  for(let _process of $process){
                    processes.push(this.parse(_process));
                  }
                } else {
                  processes.push(this.parse($process));
                }
              }
            }else{
            
            }
          }
        }
      }
      return processes;
    }
  }
  
  module.exports = BPMNParser;
                      
          
          
        
           