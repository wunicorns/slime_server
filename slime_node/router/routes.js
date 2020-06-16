const Diagram = require('../models/diagrams').Diagram;
const {BpmnParser} = require('../engine/modules/parser/BPMNParser');
const parser = require('xml2json');

module.exports = (app) => {
  const _router = require('express').Router();

  _router.get('/diagram/:type', async (req, res, next)=>{
    try{
      const diagramList = await Diagram.getList({
        type: req.params.type
      }, { content: false });
      
      res.send({
        diagrams: diagramList
      });
    }catch(err){
      next(err);
    }  
  });
  
  _router.get('/diagram/:type/latest', async (req, res, next)=>{
    try{
      const diagramList = await Diagram.latest({
        type: req.params.type
      });
      
      res.send({
        diagrams: diagramList
      });
    }catch(err){
      next(err);
    }  
  });
  
  _router.get('/diagram/:type/:id', async (req, res, next)=>{
    try{
      const diagram = await Diagram.get({
        diagram_id: req.params.id
        , type: req.params.type
      });
      
      res.send({
        diagrams: diagram
      });
      
    }catch(err){
      next(err);
    }  
  });
  
  _router.post('/diagram/:type', async (req, res, next)=>{
    try{
      const command = req.body.command;
      const diagram_id = req.body.diagram_id;
      const content = req.body.content;
      
      const xml = decodeURIComponent(content);
      const bpmn = new BpmnParser();
      const nodes = bpmn.build(xml);
      
      for(let node of nodes){
        await Diagram.save({
          diagram_id: diagram_id
          , type: req.params.type
          , name: node.getName()
          , content: content
        });
      }
      
      if('apply' === command){
      
      }
      
      res.send({
        error: 0
      });
      
    }catch(err){
      next(err);
    }  
  });
  
  app.use('/api', _router);

};
  
  