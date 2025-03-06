document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulação de envio (pode ser substituído por integração real)
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    this.reset();
});

// Smooth scroll para o botão CTA
document.querySelector('.cta-btn').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#contact').scrollIntoView({
        behavior: 'smooth'
    });
});