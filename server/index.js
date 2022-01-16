const express = require('express');
const mongoose = require('mongoose');
const trackRouter = require('./routes/trackRouter');
const addRouter = require('./routes/addRouter');
const cors = require('cors');
const exphbs = require('express-handlebars');
const Handlebars = require("handlebars");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const path = require('path');

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

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));


app.use('/add', addRouter);
app.use('/tracks', trackRouter);
app.use('/', (req, res) => {
  res.render('index')
})



async function start() {
  try {
    await mongoose.connect('mongodb+srv://Pashka:pashka@cluster0.pskap.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
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