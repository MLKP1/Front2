// Function to handle back navigation
function goBack() {
    window.history.back();
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('passwordForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const newPassword = document.getElementById('nova-senha').value;
        if (newPassword) {
            // Update password in localStorage (mock)
            const user = JSON.parse(localStorage.getItem('user')) || {};
            user.password = newPassword; // In a real app, this would be hashed and sent to a backend
            localStorage.setItem('user', JSON.stringify(user));
            
            alert('Senha alterada com sucesso!');
            window.location.href = 'info_pessoal.html'; // Redirect back to info_pessoal.html
        } else {
            alert('Por favor, insira uma nova senha.');
        }
    });
});