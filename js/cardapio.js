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
            const target = pizza.type === 'SALTY' ? pizzasSalgadas : pizzasDoces;
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
            const target = pizza.type === 'SALTY' ? pizzasSalgadas : pizzasDoces
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

    function updateActiveLink() {
        let current = null;
        let maxVisibility = 0;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            
            // Se a seção está totalmente acima ou abaixo da viewport, pula
            if (rect.bottom < 0 || rect.top > viewHeight) {
                return;
            }

            // Calcula quanto da seção está visível
            const visibleHeight = Math.min(rect.bottom, viewHeight) - Math.max(rect.top, 0);
            const sectionHeight = rect.height;
            const visibility = visibleHeight / sectionHeight;

            // Prioriza a seção que está mais no topo da viewport
            if (visibility > maxVisibility || (visibility === maxVisibility && (current === null || rect.top < current.getBoundingClientRect().top))) {
                maxVisibility = visibility;
                current = section;
            }
        });

        // Remove active de todos
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Adiciona active apenas ao link correspondente da seção mais visível
        if (current && current.id) {
            const activeLink = Array.from(navLinks).find(l => l.getAttribute('href') === `#${current.id}`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    // Add click smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href');
            const target = document.querySelector(id);
            if (target) {
                link.blur(); // Remove o foco do link
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Atualizar link ativo durante scroll
    window.addEventListener('scroll', () => {
        updateActiveLink();
    }, { passive: true });

    // Atualiza na carga inicial
    updateActiveLink();
});

(function(){
    function ensureToastContainer(){
        let c = document.querySelector('.toast-container');
        if (!c) {
            c = document.createElement('div');
            c.className = 'toast-container';
            document.body.appendChild(c);
        }
        return c;
    }

    function showToast(message, type = 'success', timeout = 2500){
        const container = ensureToastContainer();
        const t = document.createElement('div');
        t.className = `toast ${type}`;
        t.setAttribute('role','status');
        t.setAttribute('aria-live','polite');
        t.textContent = message;
        container.appendChild(t);
        // force reflow para animar
        requestAnimationFrame(()=> t.classList.add('show'));
        // remover depois
        setTimeout(()=> {
            t.classList.remove('show');
            t.addEventListener('transitionend', ()=> t.remove(), { once: true });
        }, timeout);
    }

    // Se seu código já adiciona ao carrinho, chame showToast() dentro dessa função.
    // Caso não, esta captura global de clique funciona para botões com essa classe:
    document.addEventListener('click', function(e){
        const btn = e.target.closest('.add-to-cart-btn');
        if (!btn) return;
        // Opcional: ler nome da pizza/prévia no card
        const item = btn.closest('.menu-item');
        const title = item ? (item.querySelector('h3')?.textContent || 'Item') : 'Item';
        showToast(`${title} adicionada ao carrinho`);
        // Se necessário, espere e permita que seu código continue a adicionar ao carrinho aqui.
    }, false);

})();
