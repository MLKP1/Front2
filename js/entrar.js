const baseApiUrl = 'https://back-mjk6.onrender.com/api'

const olho = document.querySelector('#olho')
const button = document.querySelector('#btn-entrar')

function mudarVisibilidadeSenha() {
  olho.classList.add('trocando')

  setTimeout(() => {
    const senhaInput = document.querySelector('#senha')
    const isPasswordVisible = senhaInput.type === 'text'

    senhaInput.type = isPasswordVisible ? 'password' : 'text'
    olho.innerHTML = isPasswordVisible ? '<i class="fa-regular fa-eye"></i>' : '<i class="fa-regular fa-eye-slash"></i>'

    olho.classList.remove('trocando');
  }, 50)
}

async function entrar(e) {
  e.preventDefault()

  const email = document.querySelector('#email').value
  const senha = document.querySelector('#senha').value

  if (!email || !senha) {
    alert('Preencha todos os campos')
    return
  }

  button.disabled = true
  button.textContent = 'Entrando...'

  try {
    const response = await axios.post(`${baseApiUrl}/auth/login`, {
      email: email,
      password: senha
    })

    localStorage.setItem('token', response.data.token)
    window.location.href = '/'
  } catch (error) {
    console.error('Erro:', error)
    alert('Ocorreu um erro ao tentar entrar. Tente novamente.')

    button.disabled = false
    button.textContent = 'Entrar'
  }
}
