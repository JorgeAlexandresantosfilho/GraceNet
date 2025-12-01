const http = require('http');

function testDashboardApi() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/Dashboard',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const req = http.request(options, (res) => {
        let data = '';

        console.log('Status:', res.statusCode);

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                console.log('Data:', JSON.stringify(jsonData, null, 2));

                if (typeof jsonData.novosClientes === 'number' &&
                    typeof jsonData.clientesAtivos === 'number' &&
                    typeof jsonData.chamadosAbertos === 'number' &&
                    Array.isArray(jsonData.distribuicaoPlanos) &&
                    Array.isArray(jsonData.clientesRecentes) &&
                    Array.isArray(jsonData.crescimentoBase)) {
                    console.log('Structure verification: PASSED');
                } else {
                    console.error('Structure verification: FAILED');
                }
            } catch (e) {
                console.error('Error parsing JSON:', e.message);
                console.log('Raw data:', data);
            }
        });
    });

    req.on('error', (e) => {
        console.error('Problem with request:', e.message);
    });

    req.end();
}

testDashboardApi();
