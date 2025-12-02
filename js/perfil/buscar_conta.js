const fieldName = document.querySelector('h1.profile-name')
const fieldEmail = document.querySelector('p.profile-email')
const token = localStorage.getItem('token')

document.addEventListener('DOMContentLoaded', async () => {
  if (!token) {
    console.warn('Você não está autenticado. Nenhum token encontrado.')
    alert('Você não está autenticado. Por favor, faça login para acessar seu perfil.')
    window.location.href = '../login/entrar.html'
    return
  }

  try {
    const response = await axios.get(`${baseUrlApi}/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    })

    const user = response.data.user
    fieldName.textContent = user.name
    fieldEmail.textContent = user.email

  } catch (err) {
    if (err.response && err.response.status === 401) {
      console.warn('Não autorizado (401). Removendo token e redirecionando para login.')
      localStorage.removeItem('token')
      alert('Sessão expirada. Por favor, faça login novamente.')
      window.location.href = '../login/entrar.html'
    }

    console.error('Erro ao buscar conta:', err.message ? err.message : err)
  }
})
