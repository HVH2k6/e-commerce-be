const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

const route = require('./router/index.router');
const cors = require('cors');

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

route(app);
app.listen(port, () => console.log(`Listening on port ${port}`));
