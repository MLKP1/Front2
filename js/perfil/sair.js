const baseUrlApi = 'https://back.pizzastars.shop/api'
const btnSair = document.querySelector("a#btn-sair")

async function sair() {
  try {
    await axios.delete(`${baseUrlApi}/auth/logout`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
      },
      withCredentials: true
    })
  
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')

    alert('Logout realizado com sucesso!')
    window.location.href = '/'
  } catch (err) {
    console.error('Erro ao fazer logout:', err)
  }
}
