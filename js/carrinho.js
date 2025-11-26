const baseApiUrlAWSBucketS3 = 'https://tcc-api-4279.s3.sa-east-1.amazonaws.com'

// Função para carregar os itens do carrinho
function loadCart() {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        // Garante que cada item tenha a propriedade quantity
        cart = cart.map(item => ({
            ...item,
            quantity: item.quantity !== undefined ? item.quantity : 1
        }));
    } catch (error) {
        console.error('Erro ao carregar o carrinho do localStorage:', error);
        cart = [];
    }

    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartEmptyElement = document.getElementById('cart-empty');

    if (!cartItemsElement || !cartTotalElement || !cartEmptyElement) {
        console.error('Elementos do DOM não encontrados:', { cartItemsElement, cartTotalElement, cartEmptyElement });
        return;
    }

    // Mostra mensagem de carrinho vazio se aplicável
    cartItemsElement.innerHTML = '';
    if (cart.length === 0) {
        cartEmptyElement.style.display = 'block';
        cartTotalElement.textContent = `Total: R$ 0.00`;
        console.log('Carrinho vazio, exibindo mensagem.');
        return;
    } else {
        cartEmptyElement.style.display = 'none';
    }

    // Calcula o total
    let total = 0;

    // Adiciona cada item ao carrinho
    cart.forEach((item, index) => {
        const imageName = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        console.log(JSON.stringify(item))
        // https://tcc-api-4279.s3.sa-east-1.amazonaws.com/drinks/agua-com-gas
        const imagePath = `${baseApiUrlAWSBucketS3}/${imageName}`;

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        //  onerror="this.src='assets/images/mussarela.'"
        itemElement.innerHTML = `
            <img src="${imagePath}" alt="${item.name}" class="item-image">
            <div class="item-info">
                <h3>${item.name} (${item.quantity}x)</h3>
                <p class="price">R$ ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <div class="quantity-control">
                <button class="quantity-btn" data-index="${index}" data-action="decrease">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                <button class="quantity-btn" data-index="${index}" data-action="increase">+</button>
            </div>
            <button class="delete-btn" data-index="${index}">Excluir</button>
        `;
        cartItemsElement.appendChild(itemElement);
        total += item.price * item.quantity;
        console.log(`Item renderizado: ${item.name}, Quantidade: ${item.quantity}, Preço: ${item.price}`);
    });

    // Atualiza o total
    cartTotalElement.textContent = `Total: R$ ${total.toFixed(2)}`;

    // Adiciona eventos aos botões de exclusão
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            console.log(`Botão Excluir clicado para índice: ${index}`);
            removeCartItem(index);
        });
    });

    // Adiciona eventos aos botões de quantidade
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            const action = button.getAttribute('data-action');
            console.log(`Botão de quantidade clicado: índice=${index}, ação=${action}`);
            updateQuantity(index, action);
        });
    });

    // Adiciona eventos aos inputs de quantidade
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', () => {
            const index = parseInt(input.getAttribute('data-index'));
            let quantity = parseInt(input.value);
            if (isNaN(quantity) || quantity < 1) {
                quantity = 1;
                input.value = 1;
            }
            console.log(`Input de quantidade alterado: índice=${index}, quantidade=${quantity}`);
            updateQuantity(index, 'set', quantity);
        });
    });
}

// Função para atualizar a quantidade de um item
function updateQuantity(index, action, quantity = null) {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (error) {
        console.error('Erro ao carregar o carrinho do localStorage:', error);
        return;
    }

    if (index < 0 || index >= cart.length) {
        console.error('Índice inválido:', index);
        return;
    }

    if (action === 'increase') {
        cart[index].quantity = (cart[index].quantity || 1) + 1;
        console.log(`Quantidade aumentada para ${cart[index].name}: ${cart[index].quantity}`);
    } else if (action === 'decrease') {
        if ((cart[index].quantity || 1) > 1) {
            cart[index].quantity = (cart[index].quantity || 1) - 1;
            console.log(`Quantidade diminuída para ${cart[index].name}: ${cart[index].quantity}`);
        } else {
            console.log(`Removendo item ${cart[index].name} (quantidade = 0)`);
            removeCartItem(index);
            return;
        }
    } else if (action === 'set' && quantity !== null && !isNaN(quantity) && quantity >= 1) {
        cart[index].quantity = quantity;
        console.log(`Quantidade definida para ${cart[index].name}: ${quantity}`);
    } else {
        console.error('Ação ou quantidade inválida:', { action, quantity });
        return;
    }

    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    } catch (error) {
        console.error('Erro ao salvar o carrinho no localStorage:', error);
    }
}

// Função para remover um item do carrinho
function removeCartItem(index) {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (index >= 0 && index < cart.length) {
            console.log(`Removendo item no índice ${index}: ${cart[index].name}`);
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
        } else {
            console.error('Índice inválido para remoção:', index);
        }
    } catch (error) {
        console.error('Erro ao remover item do carrinho:', error);
    }
}

// Função para limpar o carrinho
function clearCart() {
    try {
        console.log('Limpando o carrinho');
        localStorage.removeItem('cart');
        loadCart();
    } catch (error) {
        console.error('Erro ao limpar o carrinho:', error);
    }
}

// Adiciona evento ao botão "Limpar Carrinho"
document.addEventListener('DOMContentLoaded', () => {
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('dblclick', () => {
            console.log('Botão Limpar Carrinho clicado');
            clearCart();
        });
    }
    console.log('Carregando carrinho na inicialização');
    loadCart();
});

// Função para abrir o modal
function openModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Adiciona eventos para abrir e fechar o modal
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkout-btn');
    const closeModalBtn = document.querySelector('.close-btn');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            console.log('Abrindo modal de pagamento');
            openModal();
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            console.log('Fechando modal de pagamento');
            closeModal();
        });
    }

    // Fecha o modal ao clicar fora do conteúdo
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                console.log('Fechando modal ao clicar fora do conteúdo');
                closeModal();
            }
        });
    }
});