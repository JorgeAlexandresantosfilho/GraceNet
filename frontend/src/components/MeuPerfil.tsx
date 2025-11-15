import { useState, useEffect } from "react";
import { updateUser, getCurrentUser } from "../services/api";

const MeuPerfil = () => {
  const user = getCurrentUser();

  const [form, setForm] = useState({
    nome_completo: user?.nome_completo || "",
    login: user?.login || "",
    matricula: user?.matricula || "",
    telefone: user?.telefone || "",
    email: user?.email || "",
  });

  const [fotoPreview, setFotoPreview] = useState<string | null>(
    user?.foto_perfil || null
  );

  const [fotoBase64, setFotoBase64] = useState<string | null>(
    user?.foto_perfil || null
  );

  const [senhaForm, setSenhaForm] = useState({
    atual: "",
    nova: "",
    confirmar: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSenhaChange = (e: any) => {
    setSenhaForm({ ...senhaForm, [e.target.name]: e.target.value });
  };

  const handleFotoUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;
      setFotoPreview(base64);
      setFotoBase64(base64);
    };

    reader.readAsDataURL(file);
  };

  const salvarPerfil = async () => {
    try {
      await updateUser(user!.usuario_id, {
        nome_completo: form.nome_completo,
        login: form.login,
        matricula: form.matricula,
        telefone: form.telefone,
        email: form.email,
        perfil_id: user!.perfil_id,
        status_usuario: user!.status_usuario,
        foto_perfil: fotoBase64,
      });

      sessionStorage.setItem(
        "currentUser",
        JSON.stringify({
          ...user,
          ...form,
          foto_perfil: fotoBase64,
        })
      );

      alert("Perfil atualizado com sucesso!");
      window.location.reload();

    } catch (error) {
      alert("Erro ao atualizar o perfil.");
    }
  };

  const alterarSenha = async () => {
    if (!senhaForm.atual || !senhaForm.nova || !senhaForm.confirmar)
      return alert("Preencha todos os campos.");

    if (senhaForm.nova.length < 6)
      return alert("A nova senha deve ter pelo menos 6 caracteres.");

    if (senhaForm.nova !== senhaForm.confirmar)
      return alert("A confirmação da senha não confere.");

    try {
      const response = await fetch("http://localhost:3000/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: user!.usuario_id,
          senhaAtual: senhaForm.atual,
          novaSenha: senhaForm.nova,
        }),
      });

      if (!response.ok) throw new Error();

      alert("Senha alterada com sucesso!");
      setSenhaForm({ atual: "", nova: "", confirmar: "" });

    } catch {
      alert("Senha atual incorreta.");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">

      {/* FOTO DO PERFIL */}
      <div className="bg-white p-6 shadow rounded-lg flex items-center space-x-6">
        <img
          src={
            fotoPreview ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          className="w-28 h-28 rounded-full object-cover border shadow"
        />

        <div>
          <label className="block font-medium mb-2">Alterar foto</label>
          <input type="file" accept="image/*" onChange={handleFotoUpload} />
        </div>
      </div>

      {/* DADOS DO PERFIL */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-bold mb-4">Informações do Perfil</h2>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="block mb-1 text-gray-600">Nome completo</label>
            <input
              name="nome_completo"
              value={form.nome_completo}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Login</label>
            <input
              name="login"
              value={form.login}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Matrícula</label>
            <input
              name="matricula"
              value={form.matricula}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Telefone</label>
            <input
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

        </div>

        <button
          onClick={salvarPerfil}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Salvar Alterações
        </button>
      </div>

      {/* SENHA */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-bold mb-4">Alterar Senha</h2>

        <input
          type="password"
          name="atual"
          placeholder="Senha atual"
          value={senhaForm.atual}
          onChange={handleSenhaChange}
          className="border p-2 rounded w-full mb-3"
        />

        <input
          type="password"
          name="nova"
          placeholder="Nova senha"
          value={senhaForm.nova}
          onChange={handleSenhaChange}
          className="border p-2 rounded w-full mb-3"
        />

        <input
          type="password"
          name="confirmar"
          placeholder="Confirmar nova senha"
          value={senhaForm.confirmar}
          onChange={handleSenhaChange}
          className="border p-2 rounded w-full mb-3"
        />

        <button
          onClick={alterarSenha}
          className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
        >
          Alterar Senha
        </button>
      </div>

      {/* ÁREA DE INFORMAÇÕES DE SEGURANÇA */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-bold mb-2">Segurança</h2>
        <p className="text-gray-600">
          Status da conta:{" "}
          <span className="font-semibold">{user?.status_usuario}</span>
        </p>
        <p className="text-gray-600">
          Último login:{" "}
          <span className="font-semibold">
            {user?.ultimo_login || "Nunca registrado"}
          </span>
        </p>
      </div>

    </div>
  );
};

export default MeuPerfil;
