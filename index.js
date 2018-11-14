const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const validator = require('./validator.js');
app.use(bodyParser.json());

let films = require('./top250.json');
let actors = require('./actors.json');
let readJSON = fs.readFileSync('./actors.json');
let jsonFile = JSON.parse(readJSON);

const errCreate = {code: 400, message: 'Error in creating '}
const validErr = {code: 400, message: 'Validating error '}
const idErr = {code: 400, message: 'Where is id?'}
const invId = {code: 400, message: 'Invalid id'}

var urlencodedParser = bodyParser.urlencoded({extended: false});

app.get('/', (req, res) => {
  res.send('Hello World!');
  if(!data) return res.redirect("/");
});

app.get('/api/films/readall', (req, res) => {
  films.sort((x, y) => {
    return x.position - y.position;
  })
  res.send(films);    
});

app.get('/api/film/read', (req, res) => {
  res.send(films.find(film => film.id == req.query.id))
})

app.post('/api/films/create', (req, res) => {
  console.log(req.body);
  let obj = {};
  obj.id = Date.now();
  req = req.body;
  if (!req.title || !req.rating || !req.year || !req.budget || !req.gross || !req.poster || !req.position) {
    res.json(errCreate);
    return;
  }
  let flag = true;
  obj.title = req.title;
  obj.rating = parseFloat(req.rating) < 0 ? flag = false : req.rating;
  obj.year = parseInt(req.year) < 1900 ? flag = false : req.year;
  obj.budget = parseInt(req.budget) < 0 ? flag = false : req.budget;
  obj.gross = parseInt(req.gross) < 0 ? flag = false : req.gross;
  obj.poster = req.poster;
  obj.position = parseInt(req.position) <= 0 ? flag = false : req.position;
  if (!flag) {
      res.json(validErr);
      return;
  }
  if (films[0].position > obj.position) 
    obj.position =  films[0].position -1;
  
  if (films[films.length - 1].position < obj.position) 
    obj.position = films[films.length - 1].position + 1;
  
  films = films.map((element) => {
    if(element.position >= obj.position)
      element.position++;
    return element;
  })
  films.push(obj);
  res.json(obj);
})

app.post('/api/films/update', (req, res) => {
  req = req.body;
  if(!req.id){
    res.json(idErr);
    return;
  }
  let id = parseInt(req.id);
  let film = films[films.findIndex(i => i.id == id)];
  if(film === undefined){
    res.json(invId);
    return;
  }
  req.position -=1;
  req.title ? film.title = req.title : null;
  req.rating ? film.rating = req.rating : null;
  req.budget ? film.budget = req.budget : null;
  req.gross ? film.gross = req.gross : null;
  req.poster ? film.poster = req.poster : null;
  req.position ? film.position = req.position : null;
  req.year ? film.year = req.year : null;
  films=films.map((element) =>{     
    if(element.position >= film.position)
      element.position++;
      return element;
  });
  films.sort((x, y) => {
    return x.position - y.position;
  })
  let pos = 1;
  films.map((element) => {
    if(element.position !== pos)
      element.position = pos;
    pos++;
  })
  res.json(film);
})

app.post('/api/films/delete', (req, res) => {
  let request = req.body;
  if(!request.id){
    res.json(idErr);
    return;
  }
  let id = parseInt(request.id);
  let filmIndex = films.findIndex(i => i.id === id);
  console.log(filmIndex);
  if(filmIndex < 0){
    res.json(invId);
    return;
  }
  let delPosition = films[filmIndex].position;
  films.splice(filmIndex, 1);
  films.map((element) => {
    if(element.position > delPosition)
      element.position--;
    return element;
  })
  res.json(films);
})

//------------

app.get('/api/actors/readAll', (req, res) => {
  actors.sort(compare).reverse();
  res.send(actors);
});

function compare(obj1, obj2){
  return obj1.liked - obj2.liked;
}

app.get('/api/actors/read', (req, res) => {
  res.send(actors.find(actors => actors.id == req.query.id))
})

app.post('/api/actors/createActor', urlencodedParser, (req, res) => {
  myActor = {};
  myActor.id = req.body.id;
  myActor.name = req.body.name;
  myActor.birth = req.body.birth;
  myActor.films = req.body.films;
  myActor.liked = req.body.liked;
  myActor.photo = req.body.photo;

  actors.push(myActor);

  res.send(JSON.stringify(myActor));
});

app.get('/api/actors/updateActor/:id/:liked', function(req, res) {
  let id = req.params.id;
  let liked = req.params.liked;

  for(let i = 0; i < actors.length; i++){
    if(id == actors.id){
      actors.liked = liked;

      res.send(actors[i]);

      break;
    }
  }
});

app.post('/api/actors/deleteActor', function(req, res) {
  //let id = req.params.id;

  let request = req.body;
  if(!request.id){
    res.json(idErr);
    return;
  }
  let id = parseInt(request.id);

  message = {};

  for(let i = 0; i < actors.length; i++){
    if(id == actors[i].id){
      message = actors[i];
      actors = null;
    }
    else if(actors[i].id > id){
      actors[i].id = actors[i].id - 1;
    }
  }

  res.send(message);
});


app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
})