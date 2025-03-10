document.addEventListener('DOMContentLoaded', () => {
    // Toggle da Linha do Tempo
    const toggleBtn = document.querySelector('.toggle-btn');
    const timelineToggle = document.getElementById('timeline-toggle');
    const periods = document.querySelectorAll('.period');
    const periodContents = document.querySelectorAll('.timeline-period-content');

    toggleBtn.addEventListener('click', () => {
        const isActive = timelineToggle.classList.toggle('active');
        toggleBtn.classList.toggle('active');

        if (isActive) {
            timelineToggle.style.maxHeight = '100px';
            if (periods.length > 0) periods[0].click();
        } else {
            periods.forEach(p => p.classList.remove('active'));
            periodContents.forEach(content => content.classList.remove('active'));
            timelineToggle.style.maxHeight = '0';
        }
    });

    // Toggle dos Períodos
    periods.forEach(period => {
        period.addEventListener('click', () => {
            periods.forEach(p => p.classList.remove('active'));
            period.classList.add('active');

            const periodValue = period.getAttribute('data-period');
            periodContents.forEach(content => {
                content.classList.remove('active');
                if (content.getAttribute('data-period') === periodValue) {
                    content.classList.add('active');
                    observeTimelineItems(content);
                }
            });

            timelineToggle.style.maxHeight = '3000px';
        });
    });

    // Observar os itens da linha do tempo e atualizar a linha central
    function observeTimelineItems(periodContent) {
        const timelineItems = periodContent.querySelectorAll('.timeline-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    updateTimelineLine(periodContent); // Atualiza a linha quando um item se torna visível
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        timelineItems.forEach(item => observer.observe(item));

        // Adiciona o evento de scroll para atualizar a linha central
        window.addEventListener('scroll', () => updateTimelineLine(periodContent));
        updateTimelineLine(periodContent);
    }

    // Atualizar a altura da linha central com base nos itens visíveis
    function updateTimelineLine(periodContent) {
        const timelineToggle = document.getElementById('timeline-toggle');
        if (!timelineToggle.classList.contains('active')) return;
        if (!periodContent.classList.contains('active')) return;

        const timelineItems = periodContent.querySelectorAll('.timeline-item');
        let lastVisibleItem = null;

        // Encontra o último item visível
        timelineItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                lastVisibleItem = item;
            }
        });

        if (lastVisibleItem) {
            const rect = lastVisibleItem.getBoundingClientRect();
            const containerRect = periodContent.getBoundingClientRect();
            const height = (rect.bottom - containerRect.top) + (rect.height / 2); // Ajusta até o centro do último item visível
            periodContent.style.setProperty('--line-height', `${Math.max(height, 0)}px`); // Aplica a altura em pixels
        } else {
            periodContent.style.setProperty('--line-height', '0px'); // Reseta a altura se não houver itens visíveis
        }
    }

    // Carrega projetos do GitHub
    async function loadGitHubProjects() {
        const projectsContainer = document.getElementById('projects-container');
        const fallback = document.getElementById('projects-fallback');
        const username = 'JhonatanNobreBarboza';
        const url = `https://api.github.com/users/${username}/repos?per_page=100`;

        try {
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/vnd.github+json'
                }
            });

            if (!response.ok) throw new Error('Erro ao buscar projetos do GitHub');

            const repos = await response.json();
            projectsContainer.innerHTML = '';

            const filteredRepos = repos.filter(repo => !repo.fork && repo.description);
            if (filteredRepos.length === 0) {
                projectsContainer.innerHTML = `
                    <div class="project-card fallback">
                        <h4>Sem projetos disponíveis</h4>
                        <p>Não há projetos públicos com descrição no GitHub no momento.</p>
                    </div>
                `;
                return;
            }

            const limitedRepos = filteredRepos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 4);
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

    loadGitHubProjects();

    // Formulário de Contato
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = form.querySelector('input[name="Nome"]').value;
        const email = form.querySelector('input[name="Email"]').value;
        const mensagem = form.querySelector('textarea[name="Mensagem"]').value;
        const whatsappMessage = `Olá, Jhonatan! Nova mensagem de contato do site Consultoria Tech:\n\nNome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}`;
        const whatsappUrl = `https://wa.me/5567996214608?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
        alert('Obrigado por entrar em contato com a Consultoria Tech! Sua mensagem foi enviada com sucesso.');
        form.reset();
    });

    // Scroll suave
    document.querySelector('.cta-btn').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
    });
});