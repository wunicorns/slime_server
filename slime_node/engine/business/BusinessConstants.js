const NodeType = {
Event: "event"
, TASK: "task"
, CONTROL: "control"
, DATA: "data"
, ROOT: "root"
, PIPE: "pipe"
, STORAGE: "storage"
, PAAMETER: "parameter"
, UNKNOWN: "unknown"
};

const FlowType = {
START: "start"
, END: "end"
, PROCESS: "process"
};

module.exports = {
NodeType, FlowType
};