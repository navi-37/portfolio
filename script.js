// Función para convertir URL de YouTube a URL de embed
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

    container.innerHTML = projectsData.map(project => `
        <div class="project-item" data-project-id="${project.id}">
            <div class="project-header">
                <div style="flex: 1;">
                    <div class="project-title">${project.title}</div>
                    <div class="project-description">${project.summary || project.description}</div>
                </div>
                <span class="project-toggle">›</span>
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
                        ${project.letras ? project.letras.map(l => `<a href="${l.url}" target="_blank" rel="noopener noreferrer" class="project-link">${l.name}</a>`).join('') : (project.letraUrl ? `<a href="${project.letraUrl}" target="_blank" rel="noopener noreferrer" class="project-link">Propuesta</a>` : '')}
                        ${project.reportUrl ? `<a href="${project.reportUrl}" target="_blank" rel="noopener noreferrer" class="project-link">Informe Final</a>` : ''}
                        ${project.images && project.images.length > 0 ? `
                            <button class="project-link project-link--images" 
                                    data-project-id="${project.id}">
                                Imágenes
                            </button>
                        ` : ''}
                        ${project.videoUrl || project.videoPaths ? `
                            <button class="project-link project-link--video" 
                                    data-project-id="${project.id}">
                                Video demo
                            </button>
                        ` : ''}
                        ${project.demoUrl && !project.videoUrl ? `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="project-link">Video demo</a>` : ''}
                        ${project.codePaths ? `
                            <button class="project-link project-link--code" 
                                    data-project-id="${project.id}">
                                Código
                            </button>
                        ` : ''}
                        ${project.codeUrl ? `<a href="${project.codeUrl}" target="_blank" rel="noopener noreferrer" class="project-link">Repositorio</a>` : ''}
                        ${project.linkedInUrl ? `<a href="${project.linkedInUrl}" target="_blank" rel="noopener noreferrer" class="project-link">LinkedIn</a>` : ''}
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
                }
            });
            
            // Toggle del proyecto clickeado
            if (isExpanded) {
                projectItem.classList.remove('expanded');
            } else {
                projectItem.classList.add('expanded');
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

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    renderProjects();

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
        if (event.target.classList.contains('project-link--code')) {
            const projectId = parseInt(event.target.dataset.projectId);
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
        if (event.target.classList.contains('project-link--images')) {
            const projectId = parseInt(event.target.dataset.projectId);
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
        if (event.target.classList.contains('project-link--video')) {
            const projectId = parseInt(event.target.dataset.projectId);
            openVideoModal(projectId);
        }
    });
});
