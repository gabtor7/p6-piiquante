const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');  
const authRoutes = require('./routes/auth');
const app = express(); 

app.use(express.json());

app.use('./routes/auth', authRoutes);

app.use((req, res, next) => {
  res.json({ message: 'Votre requête a bien été reçue !' });
  next(); 
});

mongoose.connect('mongodb+srv://gabriel:PiRvBZc5fmyu5MoK@piiquante.iw8entn.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

module.exports = app;