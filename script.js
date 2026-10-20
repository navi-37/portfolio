// ── Theme toggle ──────────────────────────────────────────────────────────────

const SUN_ICON  = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
const MOON_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

const ICON_CHEVRON  = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

// ── Link icons ────────────────────────────────────────────────────────────────
const ICON_EXTERNAL = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`;
const ICON_VIDEO    = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
const ICON_IMAGES   = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
const ICON_CODE     = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
const ICON_DOC      = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
const ICON_MAIL     = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 6 12 13 2 6"/></svg>`;
const ICON_PHONE    = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/></svg>`;
const ICON_LINKEDIN = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>`;


function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    const prismLight = document.getElementById('prism-light');
    const prismDark = document.getElementById('prism-dark');
    if (prismLight && prismDark) {
        prismLight.media = theme === 'dark' ? 'not all' : 'all';
        prismDark.media = theme === 'dark' ? 'all' : 'not all';
    }

    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.innerHTML = theme === 'dark' ? SUN_ICON : MOON_ICON;
        btn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

// ── Función para convertir URL de YouTube a URL de embed ──────────────────────
function getYouTubeEmbedUrl(url) {
    // Extraer el ID del video de diferentes formatos de URL de YouTube
    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}`;
        }
    }
    
    // Si no es una URL de YouTube reconocida, devolver la URL original
    return url;
}
function renderProjects() {
    const container = document.getElementById('projects-container');
    
    if (!container || !projectsData || projectsData.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); padding: 2rem 0;">No hay proyectos disponibles.</p>';
        return;
    }

    container.innerHTML = projectsData.map((project, index) => `
        <div class="project-item reveal" data-project-id="${project.id}" style="--reveal-delay: ${Math.min(index, 6) * 0.05}s">
            <div class="project-header">
                <div style="flex: 1;">
                    <div class="project-title">${project.title}</div>
                    <div class="project-description">${project.summary || project.description}</div>
                    ${project.tags && project.tags.length > 0 ? `
                        <div class="project-header-tags">
                            ${project.tags.slice(0, 5).map(tag => `<span>${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
                <span class="project-toggle">${ICON_CHEVRON}</span>
            </div>
            <div class="project-content">
                <div class="project-details">
                    <div class="project-full-description">${project.description}</div>
                    ${project.tags && project.tags.length > 0 ? `
                        <div class="project-tags">
                            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="project-links">
                        ${project.letras ? project.letras.map(l => `<a href="${l.url}" target="_blank" rel="noopener noreferrer" class="project-link">${ICON_DOC}${l.name}</a>`).join('') : (project.letraUrl ? `<a href="${project.letraUrl}" target="_blank" rel="noopener noreferrer" class="project-link">${ICON_DOC}Propuesta</a>` : '')}
                        ${project.reportUrl ? `<a href="${project.reportUrl}" target="_blank" rel="noopener noreferrer" class="project-link">${ICON_DOC}Informe Final</a>` : ''}
                        ${project.images && project.images.length > 0 ? `<button class="project-link project-link--images" data-project-id="${project.id}">${ICON_IMAGES}Imágenes</button>` : ''}
                        ${project.videoUrl || project.videoPaths ? `<button class="project-link project-link--video" data-project-id="${project.id}">${ICON_VIDEO}Video demo</button>` : ''}
                        ${project.demoUrl && !project.videoUrl ? `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="project-link">${ICON_VIDEO}Video demo</a>` : ''}
                        ${project.codePaths ? `<button class="project-link project-link--code" data-project-id="${project.id}">${ICON_CODE}Código</button>` : ''}
                        ${project.codeUrl ? `<a href="${project.codeUrl}" target="_blank" rel="noopener noreferrer" class="project-link">${ICON_EXTERNAL}Repositorio</a>` : ''}
                        ${project.linkedInUrl ? `<a href="${project.linkedInUrl}" target="_blank" rel="noopener noreferrer" class="project-link">${ICON_EXTERNAL}LinkedIn</a>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Agregar event listeners para expandir/contraer
    document.querySelectorAll('.project-header').forEach(header => {
        header.addEventListener('click', function() {
            const projectItem = this.closest('.project-item');
            const isExpanded = projectItem.classList.contains('expanded');

            // Cerrar todos los demás proyectos
            document.querySelectorAll('.project-item').forEach(item => {
                if (item !== projectItem) {
                    item.classList.remove('expanded');
                    item.querySelector('.project-content').style.maxHeight = '0';
                }
            });

            // Toggle del proyecto clickeado
            const content = projectItem.querySelector('.project-content');
            if (isExpanded) {
                projectItem.classList.remove('expanded');
                content.style.maxHeight = '0';
            } else {
                projectItem.classList.add('expanded');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

// Funciones para el modal de código
async function openCodeModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    
    if (!project || !project.codePaths || project.codePaths.length === 0) {
        console.error('Proyecto o rutas del código no encontradas');
        return;
    }

    try {
        // Cargar todos los archivos de código
        const codeFiles = await Promise.all(
            project.codePaths.map(async (codeFile) => {
                const response = await fetch(codeFile.path);
                if (!response.ok) {
                    throw new Error(`Error al cargar ${codeFile.name}`);
                }
                return {
                    name: codeFile.name,
                    path: codeFile.path,
                    content: await response.text()
                };
            })
        );

        const modal = document.getElementById('code-modal');
        const modalTitle = modal.querySelector('.code-modal__title');
        const tabsContainer = modal.querySelector('.code-modal__tabs');
        const codeContent = document.getElementById('code-content');
        
        modalTitle.textContent = project.title;
        
        // Limpiar pestañas anteriores
        tabsContainer.innerHTML = '';
        
        // Crear pestañas
        codeFiles.forEach((file, index) => {
            const tab = document.createElement('button');
            tab.className = `code-modal__tab ${index === 0 ? 'active' : ''}`;
            tab.textContent = file.name;
            tab.dataset.index = index;
            tab.addEventListener('click', () => switchCodeTab(index, codeFiles, project.language));
            tabsContainer.appendChild(tab);
        });
        
        // Mostrar el primer archivo
        codeContent.textContent = codeFiles[0].content;
        codeContent.className = `language-${project.language || 'plaintext'}`;
        
        // Aplicar syntax highlighting
        if (typeof Prism !== 'undefined') {
            Prism.highlightElement(codeContent);
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Resetear el scroll al inicio del modal
        const modalBody = modal.querySelector('.code-modal__body');
        if (modalBody) {
            modalBody.scrollTop = 0;
        }
    } catch (error) {
        console.error('Error al cargar el código:', error);
        alert('Error al cargar el código del proyecto.');
    }
}

// Función para cambiar entre pestañas de código
function switchCodeTab(index, codeFiles, language) {
    const modal = document.getElementById('code-modal');
    const tabs = modal.querySelectorAll('.code-modal__tab');
    const codeContent = document.getElementById('code-content');
    
    // Actualizar clase activa en pestañas
    tabs.forEach(tab => tab.classList.remove('active'));
    tabs[index].classList.add('active');
    
    // Mostrar código del archivo seleccionado
    codeContent.textContent = codeFiles[index].content;
    codeContent.className = `language-${language || 'plaintext'}`;
    
    // Aplicar syntax highlighting
    if (typeof Prism !== 'undefined') {
        Prism.highlightElement(codeContent);
    }
    
    // Resetear scroll
    const modalBody = modal.querySelector('.code-modal__body');
    if (modalBody) {
        modalBody.scrollTop = 0;
    }
}

function closeCodeModal() {
    const modal = document.getElementById('code-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Funciones para el modal de imágenes
let currentImageIndex = 0;
let currentImages = [];

function openImagesModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    
    if (!project || !project.images || project.images.length === 0) {
        console.error('Proyecto o imágenes no encontradas');
        return;
    }

    currentImages = project.images;
    currentImageIndex = 0;

    const modal = document.getElementById('images-modal');
    const modalTitle = modal.querySelector('.images-modal__title');
    const modalImage = document.getElementById('images-modal__image');
    const prevBtn = document.getElementById('images-modal__prev');
    const nextBtn = document.getElementById('images-modal__next');
    
    modalTitle.textContent = project.title;
    modalImage.src = currentImages[currentImageIndex];
    modalImage.alt = `Imagen ${currentImageIndex + 1} del proyecto ${project.title}`;
    
    // Mostrar/ocultar botones de navegación
    prevBtn.style.display = currentImages.length > 1 ? 'flex' : 'none';
    nextBtn.style.display = currentImages.length > 1 ? 'flex' : 'none';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImagesModal() {
    const modal = document.getElementById('images-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function showPrevImage() {
    if (currentImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    updateModalImage();
}

function showNextImage() {
    if (currentImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updateModalImage();
}

function updateModalImage() {
    const modalImage = document.getElementById('images-modal__image');
    const project = projectsData.find(p => p.title === document.querySelector('.images-modal__title').textContent);
    modalImage.src = currentImages[currentImageIndex];
    modalImage.alt = `Imagen ${currentImageIndex + 1} del proyecto ${project.title}`;
}

// Funciones para el modal de video
function openVideoModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    
    if (!project || (!project.videoUrl && !project.videoPaths)) {
        console.error('Proyecto o URL del video no encontrada');
        return;
    }

    const modal = document.getElementById('video-modal');
    const modalTitle = modal.querySelector('.video-modal__title');
    const videoFrame = document.getElementById('video-modal__iframe');
    const tabsContainer = modal.querySelector('.video-modal__tabs');
    
    modalTitle.textContent = project.title;
    
    // Determinar si es un único video o múltiples videos
    const videos = project.videoPaths ? project.videoPaths : [{ name: 'Video', url: project.videoUrl }];
    
    // Limpiar pestañas anteriores
    if (tabsContainer) {
        tabsContainer.innerHTML = '';
    }
    
    // Si hay múltiples videos, crear pestañas
    if (videos.length > 1 && tabsContainer) {
        videos.forEach((video, index) => {
            const tab = document.createElement('button');
            tab.className = `video-modal__tab ${index === 0 ? 'active' : ''}`;
            tab.textContent = video.name;
            tab.dataset.index = index;
            tab.addEventListener('click', () => switchVideoTab(index, videos));
            tabsContainer.appendChild(tab);
        });
        tabsContainer.style.display = 'flex';
    } else if (tabsContainer) {
        tabsContainer.style.display = 'none';
    }
    
    // Mostrar el primer video
    videoFrame.src = getYouTubeEmbedUrl(videos[0].url);
    
    // Guardar referencia de videos en el modal para el switcher
    modal.dataset.currentVideos = JSON.stringify(videos);
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Función para cambiar entre videos
function switchVideoTab(index, videos) {
    const modal = document.getElementById('video-modal');
    const tabs = modal.querySelectorAll('.video-modal__tab');
    const videoFrame = document.getElementById('video-modal__iframe');
    
    // Actualizar clase activa en pestañas
    tabs.forEach(tab => tab.classList.remove('active'));
    tabs[index].classList.add('active');
    
    // Mostrar video seleccionado
    videoFrame.src = getYouTubeEmbedUrl(videos[index].url);
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const videoFrame = document.getElementById('video-modal__iframe');
    
    // Detener el video al cerrar el modal
    videoFrame.src = '';
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ── Navegación ────────────────────────────────────────────────────────────────
const SECTION_IDS = ['sobre-mi', 'proyectos'];

function setActiveNav(id) {
    document.querySelectorAll('.topnav__link[data-nav]').forEach(link => {
        link.classList.toggle('is-active', link.dataset.nav === id);
    });
}

function initNav() {
    if ('IntersectionObserver' in window) {
        // Resaltar en el nav la sección visible
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setActiveNav(entry.target.id);
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        SECTION_IDS.forEach(id => observer.observe(document.getElementById(id)));
        observer.observe(document.getElementById('inicio'));
    }

    // Borde del nav al scrollear
    const nav = document.querySelector('.topnav');
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// ── Modal de contacto ─────────────────────────────────────────────────────────
function openContactModal() {
    const modal = document.getElementById('contact-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.contact-modal__close').focus();
}

function closeContactModal() {
    document.getElementById('contact-modal').classList.remove('active');
    document.body.style.overflow = '';
}

function initContactModal() {
    const modal = document.getElementById('contact-modal');
    const icons = { mail: ICON_MAIL, phone: ICON_PHONE, linkedin: ICON_LINKEDIN };
    modal.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icons[el.dataset.icon]; });

    // Ocultar LinkedIn mientras no tenga URL
    const linkedin = document.getElementById('contact-linkedin');
    if (!linkedin.getAttribute('href')) linkedin.closest('.contact-item').hidden = true;

    document.getElementById('contact-open').addEventListener('click', openContactModal);
    modal.querySelector('.contact-modal__overlay').addEventListener('click', closeContactModal);
    modal.querySelector('.contact-modal__close').addEventListener('click', closeContactModal);
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && modal.classList.contains('active')) closeContactModal();
    });

    modal.querySelectorAll('[data-copy]').forEach(button => {
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(button.dataset.copy);
                button.textContent = 'Copiado';
                button.classList.add('is-copied');
                setTimeout(() => {
                    button.textContent = 'Copiar';
                    button.classList.remove('is-copied');
                }, 1500);
            } catch (error) {
                console.error('No se pudo copiar:', error);
            }
        });
    });
}

function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('is-visible'));
        return;
    }
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    items.forEach(el => observer.observe(el));
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar botón de tema con el estado actual
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(currentTheme);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    renderProjects();
    document.getElementById('projects-count').textContent = projectsData.length;
    initNav();
    initContactModal();
    initReveal();

    // Event listeners para el modal de código
    const codeModal = document.getElementById('code-modal');
    const codeModalOverlay = codeModal.querySelector('.code-modal__overlay');
    const codeModalClose = codeModal.querySelector('.code-modal__close');

    // Cerrar modal al hacer clic en overlay o botón cerrar
    if (codeModalOverlay) {
        codeModalOverlay.addEventListener('click', closeCodeModal);
    }

    if (codeModalClose) {
        codeModalClose.addEventListener('click', closeCodeModal);
    }

    // Cerrar modal con Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && codeModal.classList.contains('active')) {
            closeCodeModal();
        }
    });

    // Event listeners para botones "Ver Código Local"
    document.addEventListener('click', async function(event) {
        const button = event.target.closest('.project-link--code');
        if (button) {
            const projectId = parseInt(button.dataset.projectId);
            await openCodeModal(projectId);
        }
    });

    // Event listeners para el modal de imágenes
    const imagesModal = document.getElementById('images-modal');
    const imagesModalOverlay = imagesModal.querySelector('.images-modal__overlay');
    const imagesModalClose = imagesModal.querySelector('.images-modal__close');
    const imagesModalPrev = document.getElementById('images-modal__prev');
    const imagesModalNext = document.getElementById('images-modal__next');

    // Cerrar modal al hacer clic en overlay o botón cerrar
    if (imagesModalOverlay) {
        imagesModalOverlay.addEventListener('click', closeImagesModal);
    }

    if (imagesModalClose) {
        imagesModalClose.addEventListener('click', closeImagesModal);
    }

    // Navegación de imágenes
    if (imagesModalPrev) {
        imagesModalPrev.addEventListener('click', showPrevImage);
    }

    if (imagesModalNext) {
        imagesModalNext.addEventListener('click', showNextImage);
    }

    // Cerrar modal con Escape, navegación con flechas
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && imagesModal.classList.contains('active')) {
            closeImagesModal();
        } else if (event.key === 'ArrowLeft' && imagesModal.classList.contains('active')) {
            showPrevImage();
        } else if (event.key === 'ArrowRight' && imagesModal.classList.contains('active')) {
            showNextImage();
        }
    });

    // Event listeners para botones "Ver Imágenes"
    document.addEventListener('click', function(event) {
        const button = event.target.closest('.project-link--images');
        if (button) {
            const projectId = parseInt(button.dataset.projectId);
            openImagesModal(projectId);
        }
    });

    // Event listeners para el modal de video
    const videoModal = document.getElementById('video-modal');
    const videoModalOverlay = videoModal.querySelector('.video-modal__overlay');
    const videoModalClose = videoModal.querySelector('.video-modal__close');

    // Cerrar modal al hacer clic en overlay o botón cerrar
    if (videoModalOverlay) {
        videoModalOverlay.addEventListener('click', closeVideoModal);
    }

    if (videoModalClose) {
        videoModalClose.addEventListener('click', closeVideoModal);
    }

    // Cerrar modal con Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });

    // Event listeners para botones "Ver Video"
    document.addEventListener('click', function(event) {
        const button = event.target.closest('.project-link--video');
        if (button) {
            const projectId = parseInt(button.dataset.projectId);
            openVideoModal(projectId);
        }
    });

    // Swipe táctil en el modal de imágenes
    let touchStartX = 0;
    let touchStartY = 0;

    imagesModal.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    imagesModal.addEventListener('touchend', function(e) {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            deltaX < 0 ? showNextImage() : showPrevImage();
        }
    }, { passive: true });
});
