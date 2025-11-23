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
        const totalPizzasItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        if (cartCountSpan) {
            cartCountSpan.textContent = totalPizzasItems;
            console.log(`Contador do carrinho atualizado: ${totalPizzasItems} itens`);
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
    const baseUrlApi = "https://back.pizzastars.shop/api"
    // const baseUrlApi = "http://localhost:3334/api"

    // GET PIZZAS
    const pizzasSalgadas = document.getElementsByClassName('pizzas-salgadas')[0];

    let pizzas = []
    let totalPizzas = null
    try {
        const response = await axios.get(`${baseUrlApi}/pizzas`)

        pizzas = response.data.pizzas
        totalPizzas = response.data.meta.totalCount

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

    if (totalPizzas > 10) {
        const totalPizzasPages = Math.ceil(totalPizzas / 10)

        for (let page = 1; page <= totalPizzasPages; page++) {
            try {
                const response = await axios.get(`${baseUrlApi}/pizzas?pageIndex=${page}`)
                let morePizzas = response.data.pizzas
                if (Array.isArray(morePizzas)) {
                    pizzas = pizzas.concat(morePizzas)
                }
            } catch (error) {
                console.error(`Erro ao carregar página ${page} das pizzas:`, error)
            }
        }

        pizzasSalgadas.innerHTML = ''
        pizzas.forEach(pizza => {
            const pizzaElement = document.createElement('div')
            pizzaElement.classList.add('menu-item')
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
            pizzasSalgadas.appendChild(pizzaElement)
        })
    }

    // GET DRINKS
    const drinksContainer = document.getElementsByClassName('bebidas')[0]

    let drinks = []
    let totalDrinks = null
    try {
        const response = await axios.get(`${baseUrlApi}/drinks`)

        drinks = response.data.drinks
        totalDrinks = response.data.meta.totalCount

        drinksContainer.removeChild(drinksContainer.firstChild)

        if (!drinks) {
            drinksContainer.innerHTML = '<p>Nenhuma bebida cadastrada.</p>'
            return
        }

        drinksContainer.innerHTML = ''

        drinks.forEach(drink => {
            const drinkElement = document.createElement('div')
            drinkElement.classList.add('menu-item')
            drinkElement.innerHTML = `
                <img src="${drink.image}" alt="${drink.image}" height="150" width="150" class="item-img">
                <div class="item-info">
                    <h3>${drink.name}</h3>
                    <p class="description">${drink.description}</p>
                    <div class="price-add">
                        <span class="price">R$ ${(drink.price / 100).toFixed(2).replace('.', ',')}</span>
                        <button class="add-to-cart-btn" data-name="${drink.name}" data-price="${drink.price / 100}">Adicionar</button>
                    </div>
                </div>
            `
            drinksContainer.appendChild(drinkElement)
        })
    } catch (error) {
        console.error('Erro ao carregar as bebidas:', error)
        drinksContainer.innerHTML = '<p>Erro ao carregar as bebidas. Tente novamente mais tarde.</p>'
        return
    }

    if (totalDrinks > 10) {
        const totalDrinksPages = Math.ceil(totalDrinks / 10)

        for (let page = 1; page <= totalDrinksPages; page++) {
            try {
                const response = await axios.get(`${baseUrlApi}/drinks?pageIndex=${page}`)
                let moreDrinks = response.data.drinks
                if (Array.isArray(moreDrinks)) {
                    drinks = drinks.concat(moreDrinks)
                }
            } catch (error) {
                console.error(`Erro ao carregar página ${page} das bebidas:`, error)
            }
        }

        drinksContainer.innerHTML = ''
        drinks.forEach(drink => {
            const drinkElement = document.createElement('div')
            drinkElement.classList.add('menu-item')
            drinkElement.innerHTML = `
                <img src="${drink.image}" alt="${drink.name}" height="150" width="150" class="item-img">
                <div class="item-info">
                    <h3>${drink.name}</h3>
                    <p class="description">${drink.description}</p>
                    <div class="price-add">
                        <span class="price">R$ ${(drink.price / 100).toFixed(2).replace('.', ',')}</span>
                        <button class="add-to-cart-btn" data-name="${drink.name}" data-price="${drink.price / 100}">Adicionar</button>
                    </div>
                </div>
            `;
            drinksContainer.appendChild(drinkElement)
        })
    }
});
