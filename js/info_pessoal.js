document.addEventListener('DOMContentLoaded', () => {
  const alterarBtn = document.getElementById('alterar-senha');
  const excluirBtn = document.getElementById('excluir-conta');

  // Populate profile fields from localStorage
  const profileNameEl = document.querySelector('.profile-name');
  const infoValues = Array.from(document.querySelectorAll('.info-fields .value'));
  const storedName = localStorage.getItem('userName');
  const storedEmail = localStorage.getItem('userEmail');

  if (storedName) {
    if (profileNameEl) profileNameEl.textContent = storedName;
    if (infoValues[0]) infoValues[0].textContent = storedName;
  } else {
    if (profileNameEl) profileNameEl.textContent = 'Meu Perfil';
  }

  if (storedEmail && infoValues[1]) {
    infoValues[1].textContent = storedEmail;
  }

  if (alterarBtn) {
    alterarBtn.addEventListener('click', (e) => {
      // allow default anchor navigation if it's an <a>, otherwise navigate
      if (alterarBtn.tagName.toLowerCase() === 'a') return;
      e.preventDefault();
      window.location.href = '../../login/nao_terminadas/nova_senha.html';
    });
  }

  if (excluirBtn) {
    excluirBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const ok = confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.');
      if (!ok) return;

      const apiHref = excluirBtn.getAttribute('data-href');

      // If data-href points to an API endpoint, call it; otherwise just clear local storage
      if (apiHref && apiHref !== '#') {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(apiHref, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : ''
            }
          });

          if (!res.ok) {
            const data = await res.json().catch(() => null);
            alert(data?.message || 'Erro ao excluir conta.');
            return;
          }
        } catch (err) {
          alert('Erro de rede. Verifique sua conexão.');
          return;
        }
      }

      // Clear local session data and redirect to home (index)
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      alert('Conta excluída / sessão encerrada.');
      // redirect to project's index.html relative to this page
      window.location.href = '../../index.html';
    });
  }
});