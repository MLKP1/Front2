const btnDeletarConta = document.querySelector("a#btn-delete")

async function deletarConta() {
  try {
    await axios.delete(`${baseUrlApi}/user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
      },
      withCredentials: true
    })

    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')

    alert('Conta deletada com sucesso!')
    window.location.href = '/'
  } catch (err) {
    console.error('Erro ao deletar conta:', err)
  }
}
