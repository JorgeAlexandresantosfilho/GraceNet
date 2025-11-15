const express = require('express');
const app = express();
const cors = require('cors');
const Clients_routes = require('./routes/Clients_routes');
const exports_routes = require('./routes/exports_routes');
const plans_routes = require('./routes/plans_routes');
const os_routes = require('./routes/support_routes');
const equip_routes = require('./routes/equip_routes');
const pop_routes = require('./routes/pop_routes');
const mov_routes = require('./routes/mov_routes');
const user_routes = require('./routes/user_routes');
const public_routes = require('./routes/public_routes');
const perfil_routes = require('./routes/perfil_routes')
app.use(cors());

app.use(express.json());

app.use('/Customer', Clients_routes);

app.use('/', exports_routes);

app.use('/Plans', plans_routes);

app.use('/Support', os_routes); 

app.use('/Equip', equip_routes);

app.use('/Pop', pop_routes);

app.use('/Mov', mov_routes);

app.use('/auth', user_routes);

app.use('/public', public_routes);

app.use('/perfis', perfil_routes);

module.exports = app;