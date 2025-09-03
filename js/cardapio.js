document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartCountSpan = document.getElementById('cart-count');
    let cartItemCount = 0;

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemName = button.dataset.name;
            const itemPrice = parseFloat(button.dataset.price);

            // Aqui você faria a lógica real para adicionar ao carrinho (ex: array de itens)
            // Por enquanto, apenas incrementamos a contagem
            cartItemCount++;
            cartCountSpan.textContent = cartItemCount;

            console.log(`Adicionado: ${itemName} - R$ ${itemPrice.toFixed(2)}`);
            alert(`${itemName} adicionada ao carrinho!`);
        });
    });
    // Função para adicionar itens ao carrinho
function addToCart(itemName, itemPrice) {
    // Recupera o carrinho do localStorage ou inicializa um novo array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Adiciona o novo item ao carrinho
    cart.push({ name: itemName, price: parseFloat(itemPrice) });

    // Salva o carrinho atualizado no localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Exibe uma mensagem de confirmação
    alert(`${itemName} foi adicionado ao carrinho!`);
}

// Adiciona eventos aos botões "Adicionar"
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => {
        const itemName = button.getAttribute('data-name');
        const itemPrice = button.getAttribute('data-price');
        addToCart(itemName, itemPrice);
    });
});
});