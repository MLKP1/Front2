function adicionarCarrinho(e) {
    const itemId = e.target.getAttribute('data-id');
    const itemName = e.target.getAttribute('data-name');
    const itemPrice = parseFloat(e.target.getAttribute('data-price'));
    const itemImage = e.target.getAttribute('data-image');

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
    } else {
        // Se a pizza não existe, adiciona um novo item
        cart.push({
            id: itemId,
            name: itemName,
            price: itemPrice,
            image: itemImage,
            quantity: 1,
        });
    }

    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        // alert(`${itemName} adicionado ao carrinho!`);
        
    } catch (error) {
        console.error('Erro ao salvar o carrinho no localStorage:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const baseUrlApi = "https://back.pizzastars.shop/api"
    // const baseUrlApi = "http://localhost:3334/api"

    // GET PIZZAS
    const pizzasSalgadas = document.getElementsByClassName('pizzas-salgadas')[0];
    const pizzasDoces = document.getElementsByClassName('pizzas-doces')[0];

    let pizzas = []
    let totalPizzas = null
    try {
        const response = await axios.get(`${baseUrlApi}/pizzas`)

        pizzas = response.data.pizzas
        totalPizzas = response.data.meta.totalCount

        pizzasSalgadas.removeChild(pizzasSalgadas.firstChild);
        pizzasDoces.removeChild(pizzasDoces.firstChild);

        if (!pizzas || pizzas.length === 0) {
            pizzasSalgadas.innerHTML = '<p>Nenhuma pizza cadastrada.</p>';
            pizzasDoces.innerHTML = '<p>Nenhuma pizza cadastrada.</p>';
            return;
        }

        pizzasSalgadas.innerHTML = '';
        pizzasDoces.innerHTML = '';
        // console.log(pizzas);

        // Separa as pizzas entre salgadas e doces (quando possível)
        // helper disponível para uso em várias partes do fluxo
function isSweetPizza(pizza) {
    try {
        const name = (pizza.name || '').toLowerCase();
        const category = (pizza.category || pizza.type || '').toLowerCase();
        if (pizza.isSweet === true || pizza.sweet === true) return true;
        if (category && (category.includes('doce') || category.includes('sweet') || category.includes('dessert'))) return true;
        const sweetKeywords = ['doce', 'sobremesa', 'chocolate', 'nutella', 'brigadeiro', 'morango', 'banana', 'goiabada', 'creme de avelã', 'sorvete'];
        for (const keyword of sweetKeywords) {
            if (name.includes(keyword)) return true;
        }
        if (Array.isArray(pizza.tags) && pizza.tags.join(',').toLowerCase().includes('doce')) return true;
    } catch (err) {
    }
    return false;
}

        // Antes de renderizar, ordene as pizzas para garantir que as salgadas venham primeiro
        pizzas.sort((a, b) => {
            const aSweet = isSweetPizza(a) ? 1 : 0;
            const bSweet = isSweetPizza(b) ? 1 : 0;
            return aSweet - bSweet; // salgadas (0) antes das doces (1)
        });

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
                        <button
                            class="add-to-cart-btn"
                            data-id="${pizza.pizzaId}"
                            data-name="${pizza.name}"
                            data-price="${pizza.price / 100}"
                            data-image="${pizza.image}"
                            onClick="adicionarCarrinho(event)"
                        >Adicionar</button>
                    </div>
                </div>
            `;
            const target = isSweetPizza(pizza) ? pizzasDoces : pizzasSalgadas;
            target.appendChild(pizzaElement);
        });
    } catch (error) {
        console.error('Erro ao carregar as pizzas:', error);
        pizzasSalgadas.innerHTML = '<p>Erro ao carregar as pizzas. Tente novamente mais tarde.</p>';
        pizzasDoces.innerHTML = '<p>Erro ao carregar as pizzas. Tente novamente mais tarde.</p>';
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
        pizzasDoces.innerHTML = ''
        // Garantir que as salgadas fiquem antes das doces também após concatenar todas as páginas
        pizzas.sort((a, b) => {
            const aSweet = isSweetPizza(a) ? 1 : 0;
            const bSweet = isSweetPizza(b) ? 1 : 0;
            return aSweet - bSweet;
        });
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
                        <button
                            class="add-to-cart-btn"
                            data-name="${pizza.name}"
                            data-price="${pizza.price / 100}"
                            data-image="${pizza.image}"
                            onClick="adicionarCarrinho(event)"
                        >Adicionar</button>
                    </div>
                </div>
            `;
            const target = isSweetPizza(pizza) ? pizzasDoces : pizzasSalgadas;
            target.appendChild(pizzaElement)
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
                        <button
                            class="add-to-cart-btn"
                            data-name="${drink.name}"
                            data-price="${drink.price / 100}"
                            data-image="${drink.image}"
                            onClick="adicionarCarrinho(event)"
                        >Adicionar</button>
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
                        <button
                            class="add-to-cart-btn"
                            data-name="${drink.name}"
                            data-price="${drink.price / 100}"
                            data-image="${drink.image}"
                            onClick="adicionarCarrinho(event)"
                        >Adicionar</button>
                    </div>
                </div>
            `;
            drinksContainer.appendChild(drinkElement)
        })
    }
});

// Highlight category nav items based on scroll and enable smooth scrolling
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.category-nav .nav-cat');
    const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

    // Add click smooth scroll and set active class
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href');
            const target = document.querySelector(id);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // update active
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // IntersectionObserver to detect section on screen and set active link
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    const id = `#${entry.target.id}`;
                    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
                }
            });
        }, { root: null, threshold: [0.5] });

        sections.forEach(s => obs.observe(s));
    } else {
        // fallback: on scroll, calculate nearest
        window.addEventListener('scroll', () => {
            let current = sections[0];
            sections.forEach(s => {
                const rect = s.getBoundingClientRect();
                if (rect.top <= window.innerHeight/3 && rect.bottom >= window.innerHeight/4) current = s;
            });
            if (current && current.id) {
                navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current.id}`));
            }
        });
    }
});
