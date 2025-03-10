// Toggle da linha do tempo (mostra a linha horizontal)
document.querySelector('.toggle-btn').addEventListener('click', function() {
    const timelineToggle = document.getElementById('timeline-toggle');
    const isActive = timelineToggle.classList.toggle('active');
    this.classList.toggle('active');

    if (isActive) {
        // Ao abrir, define max-height para mostrar a linha horizontal
        timelineToggle.style.maxHeight = '100px'; // Ajustado para a altura da linha horizontal
    } else {
        // Ao fechar, remove as classes active e redefine max-height
        document.querySelectorAll('.period').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.timeline-period-content').forEach(content => {
            content.classList.remove('active');
        });
        timelineToggle.style.maxHeight = '0'; // Fecha completamente
    }
});

// Toggle dos períodos (mostra a linha vertical correspondente)
document.querySelectorAll('.period').forEach(period => {
    period.addEventListener('click', function() {
        // Remove a classe 'active' de todos os períodos
        document.querySelectorAll('.period').forEach(p => p.classList.remove('active'));
        // Adiciona a classe 'active' ao período clicado
        this.classList.add('active');

        // Remove a classe 'active' de todas as seções de conteúdo
        document.querySelectorAll('.timeline-period-content').forEach(content => {
            content.classList.remove('active');
        });

        // Mostra o conteúdo correspondente ao período clicado
        const periodValue = this.getAttribute('data-period');
        const periodContent = document.querySelector(`.timeline-period-content[data-period="${periodValue}"]`);
        periodContent.classList.add('active');

        // Ajusta o max-height do timeline-toggle para acomodar o conteúdo
        const timelineToggle = document.getElementById('timeline-toggle');
        timelineToggle.style.maxHeight = '3000px'; // Ajustado para todos os itens

        // Inicia a observação dos itens da linha do tempo
        observeTimelineItems(periodContent);
    });
});

// Observar os itens da linha do tempo e a linha central ao rolar
function observeTimelineItems(periodContent) {
    const timelineItems = periodContent.querySelectorAll('.timeline-item');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // Animação da linha central com base no scroll
    window.addEventListener('scroll', () => updateTimelineLine(periodContent));
    updateTimelineLine(periodContent);
}

// Atualizar a altura da linha central com base no scroll
function updateTimelineLine(periodContent) {
    const timelineToggle = document.getElementById('timeline-toggle');
    if (!timelineToggle.classList.contains('active')) return;
    if (!periodContent.classList.contains('active')) return;

    const rect = periodContent.getBoundingRect();
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    const containerTop = rect.top + scrollPosition;
    const containerHeight = rect.height;

    const visibleHeight = Math.min(Math.max(windowHeight - rect.top, 0), containerHeight);
    const percentageVisible = Math.max(0, Math.min(visibleHeight / containerHeight, 1));

    periodContent.style.setProperty('--line-height', `${percentageVisible * 100}%`);
}

// Consumir a API do GitHub para carregar os projetos
async function loadGitHubProjects() {
    const projectsContainer = document.getElementById('projects-container');
    const fallback = document.getElementById('projects-fallback');
    const username = 'JhonatanNobreBarboza'; // Seu usuário do GitHub
    const url = `https://api.github.com/users/${username}/repos?per_page=100`; // Máximo de 100 repositórios por página

    try {
        // Faz a requisição à API do GitHub
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github+json',
                // Se você tiver um token, descomente a linha abaixo e substitua SEU_TOKEN_AQUI
                // 'Authorization': 'Bearer SEU_TOKEN_AQUI',
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar projetos do GitHub');
        }

        const repos = await response.json();

        // Filtra repositórios (ex.: ignora forks ou repositórios sem descrição, se desejar)
        const filteredRepos = repos.filter(repo => !repo.fork && repo.description);

        // Limpa o container
        projectsContainer.innerHTML = '';

        if (filteredRepos.length === 0) {
            projectsContainer.innerHTML = `
                <div class="project-card fallback">
                    <h4>Sem projetos disponíveis</h4>
                    <p>Não há projetos públicos com descrição no GitHub no momento.</p>
                </div>
            `;
            return;
        }

        // Ordena por número de estrelas (opcional)
        filteredRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);

        // Limita a 4 projetos (ajustado conforme solicitado)
        const limitedRepos = filteredRepos.slice(0, 4);

        // Renderiza os projetos
        limitedRepos.forEach(repo => {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card');
            projectCard.innerHTML = `
                <h4>${repo.name}</h4>
                <p>${repo.description || 'Sem descrição disponível'}</p>
                <div class="project-meta">
                    <span>⭐ ${repo.stargazers_count}</span>
                    <span>🍴 ${repo.forks_count}</span>
                    <span>📝 ${repo.language || 'Não especificado'}</span>
                </div>
                <a href="${repo.html_url}" class="project-link" target="_blank">Ver no GitHub</a>
            `;
            projectsContainer.appendChild(projectCard);
        });

    } catch (error) {
        console.error('Erro ao carregar projetos do GitHub:', error);
        projectsContainer.innerHTML = '';
        projectsContainer.appendChild(fallback);
    }
}

// Carrega os projetos ao carregar a página
document.addEventListener('DOMContentLoaded', loadGitHubProjects);

// Formulário WhatsApp
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = this;
    const nome = form.querySelector('input[name="Nome"]').value;
    const email = form.querySelector('input[name="Email"]').value;
    const mensagem = form.querySelector('textarea[name="Mensagem"]').value;

    const whatsappMessage = `Olá, Jhonatan! Nova mensagem de contato do site Consultoria Tech:\n\n` +
                           `Nome: ${nome}\n` +
                           `Email: ${email}\n` +
                           `Mensagem: ${mensagem}`;

    const whatsappUrl = `https://wa.me/5567996214608?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappUrl, '_blank');

    alert('Obrigado por entrar em contato com a Consultoria Tech! Sua mensagem foi enviada com sucesso.');
    form.reset();
});

// Scroll suave para o formulário
document.querySelector('.cta-btn').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#contact').scrollIntoView({
        behavior: 'smooth'
    });
});