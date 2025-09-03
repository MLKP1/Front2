// Função para carregar os itens do carrinho
function loadCart() {
    // Recupera o carrinho do localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Seleciona o elemento onde os itens serão exibidos
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    // Limpa o conteúdo atual
    cartItemsElement.innerHTML = '';

    // Calcula o total
    let total = 0;

    // Adiciona cada item ao carrinho
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('menu-item');
        itemElement.innerHTML = `
            <div class="item-info">
                <h3>${item.name}</h3>
                <p class="price">R$ ${item.price.toFixed(2)}</p>
            </div>
        `;
        cartItemsElement.appendChild(itemElement);
        total += item.price;
    });

    // Atualiza o total
    cartTotalElement.textContent = `Total: R$ ${total.toFixed(2)}`;
}

// Função para limpar o carrinho
function clearCart() {
    // Remove o carrinho do localStorage
    localStorage.removeItem('cart');

    // Recarrega o carrinho
    loadCart();
}

// Adiciona evento ao botão "Limpar Carrinho"
document.getElementById('clear-cart-btn').addEventListener('click', clearCart);

// Carrega o carrinho ao abrir a página
loadCart();