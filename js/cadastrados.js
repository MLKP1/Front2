document.addEventListener('DOMContentLoaded', async () => {
    const enderecosList = document.getElementById('enderecos-list');

    try {
        // Altere para o mesmo backend usado no cadastro
        // const response = await axios.get('http://localhost:3334/api/enderecos');
        const response = await axios.get('https://back.pizzastars.shop/api/enderecos');
        const enderecos = response.data;

        if (enderecos.length === 0) {
            enderecosList.innerHTML = '<p>Nenhum endereço cadastrado.</p>';
            return;
        }

        enderecos.forEach(endereco => {
            const enderecoElement = document.createElement('div');
            enderecoElement.classList.add('endereco-item');
            enderecoElement.innerHTML = `
                <div class="endereco-info">
                    <p><strong>CEP:</strong> ${endereco.cep}</p>
                    <p><strong>Logradouro:</strong> ${endereco.logradouro}</p>
                    <p><strong>Número:</strong> ${endereco.numero}</p>
                    <p><strong>Complemento:</strong> ${endereco.complemento || 'N/A'}</p>
                    <p><strong>Bairro:</strong> ${endereco.bairro}</p>
                    <p><strong>Cidade:</strong> ${endereco.cidade}</p>
                    <p><strong>Estado:</strong> ${endereco.estado}</p>
                </div>
            `;
            enderecosList.appendChild(enderecoElement);
        });
    } catch (error) {
        console.error('Erro ao carregar os endereços:', error);
        enderecosList.innerHTML = '<p>Erro ao carregar os endereços. Tente novamente mais tarde.</p>';
    }
});