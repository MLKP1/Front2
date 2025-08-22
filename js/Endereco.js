const baseApiUrl = 'https://back-mjk6.onrender.com/api';

const cadastrarButton = document.querySelector('.primary-button');

async function cadastrarEndereco(e) {
  e.preventDefault();

  const camposObrigatorios = [
    { id: 'cep', nome: 'CEP' },
    { id: 'numero', nome: 'Número' },
    { id: 'logradouro', nome: 'Logradouro' },
    { id: 'bairro', nome: 'Bairro' },
    { id: 'cidade', nome: 'Cidade' },
    { id: 'estado', nome: 'Estado' },
  ];

  let camposFaltando = false;

  // Verifica quais campos estão vazios e aplica a borda vermelha
  camposObrigatorios.forEach(campo => {
    const input = document.querySelector(`#${campo.id}`);
    if (!input.value.trim()) {
      input.style.border = '2px solid red';
      camposFaltando = true;
    } else {
      input.style.border = ''; // Remove a borda vermelha caso o campo esteja preenchido
    }
  });

  if (camposFaltando) {
    return; // Interrompe o envio se houver campos obrigatórios não preenchidos
  }

  cadastrarButton.disabled = true;
  cadastrarButton.textContent = 'Cadastrando...';

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Usuário não autenticado. Faça login novamente.');
      window.location.href = '/Front2/pages/login/entrar.html';
      return;
    }

    const response = await axios.post(`${baseApiUrl}/enderecos`, {
      cep: document.querySelector('#cep').value.trim(),
      numero: document.querySelector('#numero').value.trim(),
      logradouro: document.querySelector('#logradouro').value.trim(),
      complemento: document.querySelector('#complemento').value.trim(),
      bairro: document.querySelector('#bairro').value.trim(),
      cidade: document.querySelector('#cidade').value.trim(),
      estado: document.querySelector('#estado').value.trim(),
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert('Endereço cadastrado com sucesso!');
    window.location.href = '/Front2/pages/sucesso.html';
  } catch (error) {
    console.error('Erro:', error);
    alert('Ocorreu um erro ao tentar cadastrar o endereço. Tente novamente.');
  } finally {
    cadastrarButton.disabled = false;
    cadastrarButton.textContent = 'Cadastrar';
  }
  ['cep', 'numero'].forEach(id => {
  const input = document.getElementById(id);
  if (input) {
    input.addEventListener('input', function () {
      this.value = this.value.replace(/\D/g, '');
    });
  }
});
}

cadastrarButton.addEventListener('click', cadastrarEndereco);