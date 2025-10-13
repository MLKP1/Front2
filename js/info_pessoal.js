// Load personal info when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadPersonalInfo();
    
    // Add event listeners for buttons
    document.querySelector('.botao.alterar-senha').addEventListener('click', changePassword);
    document.querySelector('.botao.excluir-conta').addEventListener('click', deleteAccount);
});

// Function to load personal information from localStorage
function loadPersonalInfo() {
    // Mock user data from localStorage (replace with actual data source)
    const user = JSON.parse(localStorage.getItem('user')) || {
        fullName: 'Neymar Junior',
        email: 'neymar@example.com'
    };

    // Update the DOM with user data
    document.querySelector('.nome-completo').textContent = user.fullName;
    document.querySelector('.email').textContent = user.email;
    document.querySelector('.nome-principal').textContent = user.fullName;
}

// Function to handle back navigation
function goBack() {
    window.history.back();
}

// Function to handle password change (placeholder)
function changePassword() {
    // Placeholder: In a real app, this would open a form or modal to change the password
    alert('Funcionalidade de alteração de senha ainda não implementada. Entre em contato com o suporte.');
    // Example: Could redirect to a password change page
    // window.location.href = 'alterar_senha.html';
}

// Function to handle account deletion (placeholder)
function deleteAccount() {
    // Placeholder: In a real app, this would confirm and call a backend API to delete the account
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
        localStorage.removeItem('user'); // Clear user data (mock)
        alert('Conta excluída com sucesso. Você será redirecionado.');
        window.location.href = 'login.html'; // Redirect to login or home page
    }
}