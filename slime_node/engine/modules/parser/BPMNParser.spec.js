const fs = require("fs");
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let {user, pwd, host, port, database} = {
  user: 'appadmin',
  pwd: 'appadmin',
  host: 'localhost',
  port: '27017',
  database: 'diagram'
};

const {CONDITION, LOOP, BRANCHING} = require('../../business/LogicConstants')
const BPMNParser = require('./BPMNParser')

describe('BPMN test', ()=>{
  let conn = null;
  before((done)=>{
    const mongoUrl = ['mongodb://', user, ':', pwd, '@', host, ':', port, '/', database].join('');
    
    conn = mongoose.connect(mongoUrl, {
      useNewUrlParser: true, useUnifiedTopology: true
    }).then((mongoInfo)=>{
      console.log('mongo is ready');
      done();
    })
    .catch((err)=>{
      console.log(err);
    });
  });
  
  after(()=>{
    mongoose.disconnect();
  });
  
  describe('parse test', ()=>{
    const Diagram = require('../../../modles/diagram').Diagram;
    
    before(()=>{
    });
    
    it('db test', (done)=> {
      Diagram.latest({ type: 'flow' })
      .then((latestDiagram)=>{
        for(let doc of latestDiagram){
          let xml = decodeURIComponent(doc.content);
          let bpmn = new BPMNParser();
          let nodes = bpmn.build(xml);
          for(let node of nodes){
            node.walk();
          }
        }
        done();
      }).catch(err=>{
        done(err);
      });
    });
  });
});
