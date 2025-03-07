document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = this;
    const nome = form.querySelector('input[name="Nome"]').value;
    const email = form.querySelector('input[name="Email"]').value;
    const mensagem = form.querySelector('textarea[name="Mensagem"]').value;

    // Mensagem que será enviada ao seu WhatsApp
    const whatsappMessage = `Olá, Jhonatan! Nova mensagem de contato do site Consultoria Tech:\n\n` +
                           `Nome: ${nome}\n` +
                           `Email: ${email}\n` +
                           `Mensagem: ${mensagem}`;

    // URL do WhatsApp com o número e a mensagem codificada
    const whatsappUrl = `https://wa.me/5567996214608?text=${encodeURIComponent(whatsappMessage)}`;

    // Abre o WhatsApp no celular do usuário
    window.open(whatsappUrl, '_blank');

    // Exibe uma mensagem de confirmação no navegador
    alert('Obrigado por entrar em contato com a Consultoria Tech! Sua mensagem foi enviada com sucesso. Em breve, Jhonatan responderá pelo WhatsApp.');
    
    // Limpa o formulário
    form.reset();
});

// Smooth scroll para o botão CTA
document.querySelector('.cta-btn').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#contact').scrollIntoView({
        behavior: 'smooth'
    });
});