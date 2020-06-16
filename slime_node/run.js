const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const PORT = 3333;

mongoose.Promise = global.Promise;

let {user, pwd, host, port, database} = {
  user: 'appadmin'
  , pwd: 'appadmin'
  , host: 'localhost'
  , port: '27017'
  , database: 'diagram'
};

const mongoUrl = ['mongodb://', user, ':', pwd, '@', host, ':', port, '/', database].join('');

mongoose.connect(mongoUrl, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then((mongoInfo)=>{
  console.log('mongo is ready');
}).catch((err)=>{
  console.log(err);
});

const app = express();

const httpServer = http.createServer(app);

app.use(cors());

app.use(bodyParser.json());

require('./router/routes')(app);
require('./router/realtime')(httpServer);

app.use(express.static('build'));
app.use('/static', express.static(path.resolve(__dirname, '..', 'static')));

httpServer.listen(PORT, ()=>{
  console.log("server Listen ::: ");
});