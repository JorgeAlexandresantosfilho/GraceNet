import { useState } from "react";
import { updateUser, getCurrentUser } from "../services/api";

const MeuPerfil = () => {
    const user = getCurrentUser();

    const [form, setForm] = useState({
        nome_completo: user?.nome_completo || "",
        login: user?.login || "",
    });

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await updateUser(user!.usuario_id, form);

            alert("Perfil atualizado com sucesso!");

            // Atualiza sessionStorage com as novas infos
            sessionStorage.setItem("currentUser", JSON.stringify({
                ...user,
                ...form
            }));

            window.location.reload();

        } catch (err) {
            alert("Erro ao atualizar o perfil.");
        }
    };

    return (
        <div className="p-6 bg-white rounded shadow max-w-xl mx-auto mt-6">
            <h1 className="text-2xl font-bold mb-4 text-gray-700">
                Meu Perfil
            </h1>

            <div className="mb-4">
                <label className="block text-gray-600 mb-1">Nome Completo</label>
                <input
                    name="nome_completo"
                    value={form.nome_completo}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-600 mb-1">Login</label>
                <input
                    name="login"
                    value={form.login}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
            </div>

            <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Salvar Alterações
            </button>
        </div>
    );
};

export default MeuPerfil;
