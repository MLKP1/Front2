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

document.addEventListener('DOMContentLoaded', async () => {
    const baseUrlApi = "http://localhost:3333/products/pizzas"
    const pizzasSalgadas = document.getElementsByClassName('pizzas-salgadas')[0];

    try {
        const response = await axios.get(baseUrlApi, {
            withCredentials: true,
            headers: {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJvaXE3bXR5bzFwamIxMW1reng3MXU1NzUiLCJyZXN0YXVyYW50SWQiOiJseDFsZ3FhcDJyaHBldHVpNnljd2p5NDMifQ.mEo-afzDl0YaE6W_tmlBE1QuKR4KUGwTaFWmswkC8bA"
            }
        });
        const { pizzas } = response.data;
        console.log(pizzas);

        pizzasSalgadas.removeChild(pizzasSalgadas.firstChild);

        if (!pizzas) {
            pizzasSalgadas.innerHTML = '<p>Nenhuma pizza cadastrada.</p>';
            return;
        }

        pizzasSalgadas.innerHTML = '';

        pizzas.forEach(pizza => {
            const pizzaElement = document.createElement('div');
            pizzaElement.classList.add('menu-item');
            pizzaElement.innerHTML = `
                <img src="${pizza.image}" alt="${pizza.name}" height="150" width="150" class="item-img">
                <div class="item-info">
                    <h3>${pizza.name}</h3>
                    <p class="description">${pizza.description}</p>
                    <div class="price-add">
                        <span class="price">R$ ${(pizza.price / 100).toFixed(2).replace('.', ',')}</span>
                        <button class="add-to-cart-btn" data-name="${pizza.name}" data-price="${pizza.price / 100}">Adicionar</button>
                    </div>
                </div>
            `;
            pizzasSalgadas.appendChild(pizzaElement);
        });
    } catch (error) {
        console.error('Erro ao carregar as pizzas:', error);
        pizzasSalgadas.innerHTML = '<p>Erro ao carregar as pizzas. Tente novamente mais tarde.</p>';
        return;
    }
});
