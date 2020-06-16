const uuidv4 = require('uuid').v4;
const mongoose = require('mongoose');
const modelInterface = require('./model').ModelInterface;
const log = require('../utility/logger');
const {Schema} = mongoose;

const Diagram = Object.assign(modelInterface, {
  init: () => {
    this.dataSchema = new Schema({
      diagram_id: {
        type: String,
        required: true,
        unique: true
      }
      , type: {
        type: String,
        required: true,
        unique: false
      }
      , name: {
        type: String,
        required: true,
        unique: false
      }
      , content: String,
    },
    {
      timestamps: true
    });
    
    this.dataModel = mongoose.model('diagram', this.dataSchema, 'diagram');
    
    return this;
  }
  , save: async (data) => {
    if(!data['id']){
      const id = uuidv4();
      return await this.dataModel.create({
        diagram_id: id
        , type: data['type']
        , name: data['name']
        , content: data['content']
      }, (err, res)=>{
        if(err) log.error(err);
        return res;
      });
    } else {
      const id = data['diagram_id'];
      return await this.dataModel.updateOne({
        name: data['name']
        , content:data['content']
      }, {
        diagram_id: id
        , type: data['type']
      }, (err, res)=>{
        if(err){
          log.error(err);
        }
        return res;
      });
    }
  }
  , remove: async (where) =>{
    await this.dataModel.deleteOne(where, (err)=>{
      if(err) log.error(err);
    }); 
  }
  , modify: async (data, where) => {
    await this.dataModel.updateOne(data, where, (err, res)=>{
      if(err) log.error(err);
    });
  }
  , get: async (args) => {
    return await this.dataModel.find(args);
  }
  
  , getList: async (args, fields) => {
    return await this.dataModel.find(args.condition, fields);
  }
  
  , latest: async (args) => {
    log.info("latest");
    return await this.dataModel.find({
      type: args['type']
      })/sort({_id: -1}).limit(1);
    }
  });
  
  Diagram.init();
  
  module.exports = { Diagram };
   
       