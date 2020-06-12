const BusinessNode = require('./BusinessNode');

class BPMNNode extends BusinessNode {
  constructor(nodeId=uuid(), name="", options={}){
    super(nodeId, name, options);
  }
  action = (_depth, _pipe) => {
    _pipe(this, _depth);
    console.log(this.getData());
    return this.getNodeId();
  }
}

module.exports = {
  BPMNNode
};      