const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const message = process.env.CUSTOM_MESSAGE || 'Default fallback message';
  res.send(`Task 3.2: ${message}`);
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});