const express = require('express');
const app = express();
const cors = require('cors');
const Clients_routes = require('./routes/Clients_routes');
const exports_routes = require('./routes/exports_routes');
const plans_controller = require('./routes/plans_routes');

app.use(cors());

app.use(express.json());

app.use('/Customer', Clients_routes);

app.use('/', exports_routes);

app.use('/Plans', plans_controller);

module.exports = app;