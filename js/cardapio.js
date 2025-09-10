document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartCountSpan = document.getElementById('cart-count');

    // Função para atualizar o contador do carrinho
    function updateCartCount() {
        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem('cart')) || [];
        } catch (error) {
            console.error('Erro ao carregar o carrinho do localStorage:', error);
            cart = [];
        }
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        if (cartCountSpan) {
            cartCountSpan.textContent = totalItems;
            console.log(`Contador do carrinho atualizado: ${totalItems} itens`);
        } else {
            console.log('Elemento cart-count não encontrado, continuando sem atualizar contador');
        }
    }

    // Função para adicionar itens ao carrinho
    function addToCart(itemName, itemPrice) {
        if (!itemName || isNaN(itemPrice)) {
            console.error('Dados inválidos:', { itemName, itemPrice });
            return;
        }

        let cart = [];
        try {
            cart = JSON.parse(localStorage.getItem('cart')) || [];
        } catch (error) {
            console.error('Erro ao carregar o carrinho do localStorage:', error);
            cart = [];
        }

        // Verifica se a pizza já está no carrinho
        const existingItemIndex = cart.findIndex(item => item.name === itemName);

        if (existingItemIndex !== -1) {
            // Se a pizza já existe, incrementa a quantidade
            cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
            console.log(`Quantidade incrementada para ${itemName}: ${cart[existingItemIndex].quantity}`);
        } else {
            // Se a pizza não existe, adiciona um novo item
            cart.push({
                name: itemName,
                price: parseFloat(itemPrice),
                quantity: 1
            });
            console.log(`Novo item adicionado: ${itemName}, Preço: ${itemPrice}`);
        }

        try {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            alert(`${itemName} adicionado ao carrinho!`);
        } catch (error) {
            console.error('Erro ao salvar o carrinho no localStorage:', error);
        }
    }

    // Adiciona eventos aos botões "Adicionar"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemName = button.getAttribute('data-name');
            const itemPrice = parseFloat(button.getAttribute('data-price'));
            if (itemName && !isNaN(itemPrice)) {
                console.log(`Botão Adicionar clicado: ${itemName}, Preço: ${itemPrice}`);
                addToCart(itemName, itemPrice);
            } else {
                console.error('Dados inválidos no botão:', { itemName, itemPrice });
            }
        });
    });

    // Inicializa o contador do carrinho
    console.log('Inicializando cardápio');
    updateCartCount();
});