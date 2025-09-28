const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();


require('dotenv').config();
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_DATABASE:', process.env.DB_DATABASE);



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running on Port: ${PORT}`)
});