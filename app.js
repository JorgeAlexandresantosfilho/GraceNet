const express = require('express');
const app = express();
const cors = require('cors');
const Clients_routes = require('./routes/Clients_routes');
const exports_routes = require('./routes/exports_routes');

app.use(cors());

app.use(express.json());

app.use('/Customer', Clients_routes);

app.use('/', exports_routes);

module.exports = app;