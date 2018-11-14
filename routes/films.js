const express = require('express');
const router = express.Router();
let films = require('../top250.json');

const errCreate = {code: 400, message: 'error in creating '}
const validErr = {code: 400, message: 'validating error '}
const invId = {code: 400, message: 'invalid id'}
const idErr = {code: 400, message: 'Where is id?'}


router.get('/readall', (req, res) => {
    films.sort((x, y) => {
      return x.position - y.position;
    })
    res.send(films);    
  });
 
  router.get('/read', (req, res) => {
    res.send(films.find(film => film.id == req.query.id))
  });


router.post('/create', (req, res) => {
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
    obj.position = parseInt(req.position) < 0 ? flag = false : req.position;
    if (!flag) {
        resp.json(validErr);
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

  router.post('/update', (req, res) => {
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
  
  router.post('/delete', (req, res) => {
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

module.exports = router;