const express = require('express')

const app = express();
const PORT = process.env.PORT || 3000; 

app.use('/', (req, res) => {
  res.send(`<h1>Hi!</h1>`)
})
function start() {
  app.listen(PORT, () => {
    console.log(`server run on port ${PORT}`);
  }) 
}

start();