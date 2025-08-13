const baseApiUrl = 'https://back-mjk6.onrender.com/api'

const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('toggle-password');

togglePassword.addEventListener('click', function () {
    // Alterna o tipo do input entre 'password' e 'text'
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Alterna o ícone de 'olho fechado' para 'olho aberto'
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

const formulario = document.getElementById('formulario');
const botao = document.getElementById('btn-entrar')

formulario.addEventListener('submit', async function (e) {
    e.preventDefault()

    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    if (!email || !password || !name) {
        alert('Preencha todos os campos')
        return
    }

    botao.disabled = true
    botao.textContent = 'Criando usuario...'

    try {
        await axios.post(`${baseApiUrl}/users`, {
            name,
            email,
            password
        })

        alert('Usuário cadastrado com sucesso')
        window.location.href = '/'
    } catch (error) {
        console.error('Erro:', error)
        alert('Ocorreu um erro ao cadastrar. Tente novamente.')

        botao.disabled = false
        botao.textContent = 'Cadastrar'
    } finally {
        botao.disabled = false
        botao.textContent = 'Cadastrar'
    }
});

