const express = require('express');
const mongoose = require('mongoose');
const trackRouter = require('./routes/trackRouter');
const cors = require('cors');
const exphbs = require('express-handlebars');
const Handlebars = require("handlebars");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const path = require('path');
require('dotenv').config();
const fileMiddleware = require('./middleware/file');
const methodOverride = require('method-override')

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());

const hbs = exphbs.create({
  defaultLayout: 'main', 
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(fileMiddleware.fields([{name: 'img', maxCount: 1}, {name: 'audio', maxCount: 1}]));




app.use('/tracks', trackRouter);
app.use('/', (req, res) => {
  res.render('index')
})



async function start() {
  try {
    await mongoose.connect(
    process.env.MONGODB_URI,
    {useNewUrlParser: true}, 
    () => console.log('connected to DB')
    );
     app.listen(PORT, () => {
      console.log(`server run on port ${PORT}`);
    }) 
  } catch (e) {
    console.log(e);
  } 
}

start();