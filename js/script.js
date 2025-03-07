document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = this;
    const data = {
        Nome: form.querySelector('input[name="Nome"]').value,
        Email: form.querySelector('input[name="Email"]').value,
        Mensagem: form.querySelector('textarea[name="Mensagem"]').value
    };

    fetch(form.action, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(result => {
        if (result.result === 'success') {
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            form.reset();
        } else {
            alert('Ocorreu um erro ao enviar a mensagem. Tente novamente.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro: ' + error.message);
    });
});

// Smooth scroll para o botão CTA
document.querySelector('.cta-btn').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#contact').scrollIntoView({
        behavior: 'smooth'
    });
});