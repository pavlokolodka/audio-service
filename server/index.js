const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const exphbs = require('express-handlebars');
const Handlebars = require("handlebars");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const flash = require('connect-flash');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const fileMiddleware = require('./middleware/file');
const accessMiddlware = require('./middleware/contentAccess');
const errorMiddleware = require('./middleware/404');
const methodOverride = require('method-override');
const trackRouter = require('./routes/trackRouter');
const albumRouter = require('./routes/albumRouter');
const authRouter = require('./routes/authRouter');
const mainRouter = require('./routes/mainRouter');


const app = express();
const PORT = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());

const hbs = exphbs.create({
  defaultLayout: 'main', 
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

const store = new MongoStore({
  collection: 'sessions',
  uri: process.env.MONGODB_URI
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(fileMiddleware.fields([{name: 'img', maxCount: 1}, {name: 'audio', maxCount: 1}]));



app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {maxAge: parseInt(process.env.TIME_TO_LIVE)},
  resave: false,
  saveUninitialized: false,
  store: store
}));
app.use(flash());
app.use(accessMiddlware);



app.use('/tracks', trackRouter);
app.use('/album', albumRouter);
app.use('/auth', authRouter);
app.use('/', mainRouter);



app.use(errorMiddleware);


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