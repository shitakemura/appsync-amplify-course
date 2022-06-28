const express = require('express');

const app = express();

app.listen(4000, () => {
  console.log('Listening for requests on my awesome port 4000');
})