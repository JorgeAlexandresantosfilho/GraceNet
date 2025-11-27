import React, { useState } from 'react';
import { Wifi, RefreshCw, AlertCircle } from 'lucide-react';

const SpeedTest: React.FC = () => {
    const [loading, setLoading] = useState(true);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Teste de Velocidade</h1>
                <p className="text-slate-500 mt-1">Verifique a qualidade da sua conexão em tempo real.</p>
            </header>

            <div className="bg-white rounded-2xl p-1 shadow-sm border border-slate-100 overflow-hidden relative min-h-[600px]">
                {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-slate-600 font-medium">Carregando servidor de teste...</p>
                    </div>
                )}

                <iframe
                    src="https://openspeedtest.com/Get-widget.php"
                    className="w-full h-[600px] border-0"
                    title="Speed Test"
                    onLoad={() => setLoading(false)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                        <Wifi className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Como funciona?</h3>
                    <p className="text-sm text-slate-600">
                        O teste mede a velocidade de download (recebimento) e upload (envio) da sua conexão, além da latência (ping).
                    </p>
                </div>

                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                        <RefreshCw className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Dicas para melhor resultado</h3>
                    <p className="text-sm text-slate-600">
                        Para um resultado mais preciso, conecte seu computador via cabo de rede e feche outros programas que usam internet.
                    </p>
                </div>

                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-4">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Velocidade baixa?</h3>
                    <p className="text-sm text-slate-600">
                        Se o resultado estiver muito abaixo do contratado, reinicie seu roteador e refaça o teste. Se persistir, abra um chamado.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SpeedTest;
