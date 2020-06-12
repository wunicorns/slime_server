export default (nodeType)=> {
  if(nodeType === 'bpmn'){
    return require('./parser/BPMNParser');
  }
};