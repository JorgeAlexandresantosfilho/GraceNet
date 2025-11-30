const axios = require('axios');

async function testLogin() {
    try {
        console.log('Testing Login API...');
        const response = await axios.post('http://localhost:3000/auth/login', {
            login: 'admin',
            senha: 'admin123'
        });
        console.log('Success:', response.status, response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.status : error.message);
        if (error.response && error.response.data) {
            console.error('Data:', error.response.data);
        }
    }
}

testLogin();
