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
});