
const config = require('config');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


const traderSchema = new mongoose.Schema({
  firstName: {type: String, required: true, minlength: 1, maxlength: 30},
  lastName: {type: String, required: true, minlength: 1, maxlength: 30},
  phone: {type: String},
  email: {type: String, minlength: 4, required: true, unique: true, default: "none"},
  password: {type: String, minlength: 8, required: true, default: "none"},
  facebook: {type: String, minlength: 4, default: "none"},
});

const Traders = mongoose.model('traders', traderSchema);//database w model

  
  router.get('/', async (req, res) => {
    const numberOfTraders = await Traders.count();
    const traders = await Traders.find().sort('name');
    res.send(traders);
  });
  router.get('/new', async (req, res) => {
    res.render("users/new");
  });
  router.get('/:id', async (req, res) => {
    const trader = await Traders.findById(req.params.id);//PARAMS NOT PARAM
    console.log(trader);
    if (!trader) {
      return res.status(404).send('The Trader with the given name was not found... Please Try again');
    }
    res.send(trader);
  });

  router.post('/', async (req, res) => {
    const { error } = validateTrader(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let trader = new Traders({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      facebook: req.body.facebook,
    });
    trader = await trader.save();
    res.send(trader);
  });
  
  router.put('/:id', async (req, res) => {

    const { error } = validateTrader(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const trader = await Traders.findByIdAndUpdate(req.params.id, {firstName: req.body.firstName, lastName: req.body.lastName, phone: req.body.phone, email: req.body.phone, facebook: req.body.facebook}, {new: true});
   
    if (!trader) {  
      return res.status(404).send("The Trader with the given ID was not found.");
    }
    res.send(trader);
  });
  
  router.delete('/:id', async (req, res) => {
    const trader = await Traders.findByIdAndRemove(req.params.id);
    if (!trader) return res.status(404).send('The Trader with the given ID was not found.');
  
    res.send(trader);
  });
  
    
  function validateTrader(trader) {
    const schema = {
      firstName: Joi.string().min(1).required(),
      lastName: Joi.string().min(1).required(),
      phone: Joi.string().min(7),
      email: Joi.string().required(),
      password: Joi.string().required(),
      facebook: Joi.string()
    };
  
    return Joi.validate(trader, schema);
  }

  module.exports = router;