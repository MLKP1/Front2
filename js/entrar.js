// const baseApiUrl = 'http://localhost:3334/api'
const baseApiUrl = 'http://back.pizzatars.shop/api'

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
    // store email used to login
    try {
      localStorage.setItem('userEmail', email)
      // try to store user name if backend returned it
      const user = response.data.user || response.data
      if (user) {
        const name = user.name || user.username || user.fullName || user.nome
        if (name) localStorage.setItem('userName', name)
      }
    } catch (err) {
      console.warn('Could not store user info locally', err)
    }

    window.location.href = '/'
  } catch (error) {
    button.disabled = false
    button.textContent = 'Entrar'

    if (error.response.data.message === 'Invalid credentials.') {
      alert('Credenciais inválidas. Tente novamente.')
      return
    }

    console.error('Erro:', error)
    alert('Ocorreu um erro ao tentar entrar. Tente novamente.')
  }
}
