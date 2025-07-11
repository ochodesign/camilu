// ================================
// CONFIGURACIÓN INICIAL Y VARIABLES
// ================================

// Estado global de la aplicación
const AppState = {
    isLoaded: false,
    currentSection: 'home',
    galleryImages: [],
    currentImageIndex: 0,
    isMobileMenuOpen: false
};

// ================================
// CONFIGURACIÓN DE GALERÍA DINÁMICA DESDE CARPETA
// ================================

// Lista los nombres de tus imágenes aquí (solo el nombre, no la ruta completa)
const galleryFilenames = [
    // Cortes
    'corte-dk.webp',
    
    // Corte + Color + Peinado
    'corte-color-peinado1-dk.webp',
    'corte-color-peinado2-dk.webp',
    'corte-color-peinado3-dk.webp',
    'corte-color-peinado4-dk.webp',
    
    // Peinados
    'peinado1-dk.webp',
    'peinado2-dk.webp',
    'rulo1-dk.webp',
    
    // Trenzas
    'trenza1-dk.webp',
    'trenza2-dk.webp',
    'trenza3-dk.webp'
];

// Asigna los filtros/categorías para cada imagen aquí:
const galleryImageCategories = {
    'corte-dk.webp': ['cortes'],
    'corte-color-peinado1-dk.webp': ['color', 'cortes', 'peinados'],
    'corte-color-peinado2-dk.webp': ['color', 'cortes', 'peinados'],
    'corte-color-peinado3-dk.webp': ['color', 'cortes', 'peinados'],
    'corte-color-peinado4-dk.webp': ['color', 'cortes', 'peinados'],
    'peinado1-dk.webp': ['peinados'],
    'peinado2-dk.webp': ['peinados'],
    'rulo1-dk.webp': ['peinados'],
    'trenza1-dk.webp': ['trenzas'],
    'trenza2-dk.webp': ['trenzas'],
    'trenza3-dk.webp': ['trenzas']
};

function getGalleryDataFromFilenames() {
    return galleryFilenames.map((filename, i) => {
        // Usa la configuración personalizada, o todos los filtros si no está definido
        const categories = galleryImageCategories[filename] || ['cortes', 'color', 'peinados'];
        
        // Genera las rutas responsive con manejo especial para nombres inconsistentes
        const filenameWithoutExt = filename.replace('-dk.webp', '');
        const desktopSrc = `imagenes/galeria/galeria-desktop/${filename}`;
        
        // Mapeo especial para archivos con nombres diferentes en mobile
        let mobileName = filenameWithoutExt + '-mb.webp';
        
        // Correcciones específicas para archivos con nombres diferentes
        if (filename === 'peinado1-dk.webp') {
            mobileName = 'peinado-1-mb.webp';
        } else if (filename === 'peinado2-dk.webp') {
            mobileName = 'peinado-2-mb.webp';
        }
        
        const mobileSrc = `imagenes/galeria/galeria-mobile/${mobileName}`;
        
        return {
            src: desktopSrc,
            srcMobile: mobileSrc,
            category: categories, // array de categorías
            alt: `Trabajo ${i + 1} - ${categories.join(', ')}`
        };
    });
}

// Reemplaza el array manual por la función dinámica
const galleryData = getGalleryDataFromFilenames();

// ================================
// UTILIDADES
// ================================

// Función para mezclar array aleatoriamente (Fisher-Yates shuffle)
function shuffleArray(array) {
    const shuffled = [...array]; // Crear copia para no modificar el original
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Función para crear SVG placeholder
function createSVGPlaceholder(category, alt) {
    const icons = {
        'cortes': '✂️',
        'color': '🎨',
        'peinados': '💅',
        'default': '📷'
    };
    
    const icon = icons[category] || icons['default'];
    
    return `data:image/svg+xml;base64,${btoa(`
        <svg width="300" height="250" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#EFF8A9;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#E8F39A;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad)" rx="8"/>
            <text x="150" y="110" font-family="Arial, sans-serif" font-size="40" text-anchor="middle" fill="#9A5CFF">${icon}</text>
            <text x="150" y="150" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#7A3FCC">Próximamente</text>
            <text x="150" y="170" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#7A3FCC">${alt}</text>
        </svg>
    `)}`;
}

// ================================
// DOM ELEMENTS
// ================================

const DOM = {
    // Header y navegación
    header: document.getElementById('header'),
    navToggle: document.getElementById('nav-toggle'),
    navMenu: document.getElementById('nav-menu'),
    navLinks: document.querySelectorAll('.nav-link'),
    
    // Loading screen
    loadingScreen: document.getElementById('loading-screen'),
    
    // Galería
    galleryGrid: document.getElementById('gallery-grid'),
    galleryModal: document.getElementById('gallery-modal'),
    modalImage: document.getElementById('modal-image'),
    modalClose: document.querySelector('.modal-close'),
    modalPrev: document.getElementById('modal-prev'),
    modalNext: document.getElementById('modal-next'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    
    // Formulario
    contactForm: document.getElementById('contact-form'),
    formResponse: document.getElementById('form-response'),
    
    // Scroll to top
    scrollTop: document.getElementById('scroll-top')
};

// ================================
// LOADING SCREEN
// ================================

function initLoadingScreen() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            DOM.loadingScreen.style.opacity = '0';
            setTimeout(() => {
                DOM.loadingScreen.style.display = 'none';
                AppState.isLoaded = true;
                
                // Inicializar AOS después de que cargue la página
                if (typeof AOS !== 'undefined') {
                    AOS.init({
                        duration: 800,
                        easing: 'ease-out-cubic',
                        once: true,
                        offset: 100
                    });
                }
            }, 500);
        }, 1000);
    });
}

// ================================
// NAVEGACIÓN Y HEADER
// ================================

function initNavigation() {
    // Mobile menu toggle
    DOM.navToggle.addEventListener('click', toggleMobileMenu);
    
    // Smooth scrolling para navegación
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Cerrar menú móvil si está abierto
                if (AppState.isMobileMenuOpen) {
                    toggleMobileMenu();
                }
                
                // Scroll suave a la sección
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Actualizar enlace activo
                updateActiveNavLink(link);
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', handleHeaderScroll);
    
    // Intersection Observer para navegación activa
    initActiveNavigation();
}

function toggleMobileMenu() {
    AppState.isMobileMenuOpen = !AppState.isMobileMenuOpen;
    DOM.navMenu.classList.toggle('active');
    DOM.navToggle.classList.toggle('active');
    
    // Prevenir scroll en body cuando el menú está abierto
    document.body.style.overflow = AppState.isMobileMenuOpen ? 'hidden' : '';
}

function handleHeaderScroll() {
    const scrolled = window.scrollY > 100;
    DOM.header.classList.toggle('scrolled', scrolled);
    
    // Solo aplicar la lógica de ocultar botones en dispositivos móviles
    const isMobile = window.innerWidth <= 768;
    let hideButtons = false;
    
    if (isMobile) {
        // Obtener el elemento footer-bottom-content
        const footerBottom = document.querySelector('.footer-bottom-content');
        
        if (footerBottom) {
            const footerBottomRect = footerBottom.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Ocultar botones cuando el footer-bottom-content es visible en pantalla
            hideButtons = footerBottomRect.top < windowHeight && footerBottomRect.bottom > 0;
        }
    }
    
    // Mostrar/ocultar botón scroll to top (solo si no debe estar oculto por el footer en mobile)
    DOM.scrollTop.classList.toggle('visible', scrolled && !hideButtons);
    
    // Mostrar/ocultar WhatsApp container (solo en mobile)
    const whatsappContainer = document.querySelector('.whatsapp-container');
    if (whatsappContainer) {
        whatsappContainer.classList.toggle('hidden-by-footer', hideButtons);
    }
}

function updateActiveNavLink(activeLink) {
    DOM.navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const correspondingLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (correspondingLink) {
                    updateActiveNavLink(correspondingLink);
                    AppState.currentSection = id;
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px'
    });
    
    sections.forEach(section => observer.observe(section));
}

// ================================
// GALERÍA
// ================================

function initGallery() {
    // Mezclar las imágenes aleatoriamente al inicializar
    AppState.galleryImages = shuffleArray(galleryData);
    renderGallery('all');
    initGalleryFilters();
    initGalleryModal();
}

function renderGallery(filter = 'all') {
    const filteredImages = filter === 'all'
        ? AppState.galleryImages
        : AppState.galleryImages.filter(img =>
            Array.isArray(img.category)
                ? img.category.includes(filter)
                : img.category === filter
        );

    // Mezclar las imágenes aleatoriamente para mejor UX
    const shuffledImages = shuffleArray(filteredImages);

    DOM.galleryGrid.innerHTML = '';

    shuffledImages.forEach((image, index) => {
        const galleryItem = createGalleryItem(image, index);
        DOM.galleryGrid.appendChild(galleryItem);
    });

    // Animar entrada de elementos
    animateGalleryItems();
}

function createGalleryItem(image, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.setAttribute('data-category', image.category);
    item.setAttribute('data-index', index);
    
    // Verificar si la imagen existe antes de crearla
    const img = new Image();
    img.onload = function() {
        // La imagen cargó correctamente
        item.innerHTML = `
            <picture>
                <source media="(max-width: 768px)" srcset="${image.srcMobile}">
                <img src="${image.src}" alt="${image.alt}" loading="lazy">
            </picture>
            <div class="gallery-overlay">
                <i class="fas fa-search-plus"></i>
            </div>
        `;
        // Habilitar click para modal
        item.addEventListener('click', () => openGalleryModal(index));
    };
    
    img.onerror = function() {
        // La imagen no existe, mostrar placeholder SVG
        const placeholderSrc = createSVGPlaceholder(image.category, image.alt);
        item.innerHTML = `
            <img src="${placeholderSrc}" alt="${image.alt}" style="object-fit: cover;">
            <div class="gallery-overlay" style="opacity: 0.6;">
                <i class="fas fa-camera"></i>
            </div>
        `;
        // Deshabilitar click en placeholder
        item.style.cursor = 'default';
        item.style.opacity = '0.7';
    };
    
    img.src = image.src;
    
    // Mostrar placeholder inicial mientras carga
    item.innerHTML = `
        <div class="placeholder-img loading">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i>
            <span style="font-size: 0.9rem;">Cargando...</span>
        </div>
    `;
    
    return item;
}

function animateGalleryItems() {
    const items = DOM.galleryGrid.querySelectorAll('.gallery-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
}

function initGalleryFilters() {
    DOM.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualizar botón activo
            DOM.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filtrar galería
            const filter = btn.getAttribute('data-filter');
            renderGallery(filter);
        });
    });
}

function initGalleryModal() {
    // Eventos del modal
    DOM.modalClose.addEventListener('click', closeGalleryModal);
    DOM.modalPrev.addEventListener('click', showPreviousImage);
    DOM.modalNext.addEventListener('click', showNextImage);
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.galleryModal.style.display === 'block') {
            closeGalleryModal();
        }
    });
    
    // Cerrar modal clickeando/tocando fuera de la imagen (mejorado)
    DOM.galleryModal.addEventListener('click', (e) => {
        // Verificar si el click fue en el modal mismo o en elementos que no son la imagen
        if (e.target === DOM.galleryModal || 
            (e.target.classList.contains('modal-content') && !e.target.classList.contains('modal-image'))) {
            closeGalleryModal();
        }
    });

    // Soporte táctil para cerrar modal en móviles
    DOM.galleryModal.addEventListener('touchstart', (e) => {
        if (e.target === DOM.galleryModal || 
            (e.target.classList.contains('modal-content') && !e.target.classList.contains('modal-image'))) {
            closeGalleryModal();
        }
    });

    // Prevenir que clicks en la imagen, botones de navegación y close cierren el modal
    DOM.modalImage.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    DOM.modalImage.addEventListener('touchstart', (e) => {
        e.stopPropagation();
    });
    
    // Prevenir cierre desde botones de navegación
    [DOM.modalPrev, DOM.modalNext, DOM.modalClose].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            btn.addEventListener('touchstart', (e) => {
                e.stopPropagation();
            });
        }
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (DOM.galleryModal.style.display === 'block') {
            if (e.key === 'ArrowLeft') showPreviousImage();
            if (e.key === 'ArrowRight') showNextImage();
        }
    });
}

function openGalleryModal(index) {
    AppState.currentImageIndex = index;
    const image = AppState.galleryImages[index];
    
    // Usar imagen desktop para el modal
    DOM.modalImage.src = image.src;
    DOM.modalImage.alt = image.alt;
    DOM.galleryModal.style.display = 'block';
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
    
    // Precargar imágenes adyacentes
    preloadAdjacentImages(index);
}

function closeGalleryModal() {
    DOM.galleryModal.style.display = 'none';
    document.body.style.overflow = '';
}

function showPreviousImage() {
    AppState.currentImageIndex = AppState.currentImageIndex > 0 
        ? AppState.currentImageIndex - 1 
        : AppState.galleryImages.length - 1;
    
    updateModalImage();
}

function showNextImage() {
    AppState.currentImageIndex = AppState.currentImageIndex < AppState.galleryImages.length - 1 
        ? AppState.currentImageIndex + 1 
        : 0;
    
    updateModalImage();
}

function updateModalImage() {
    const image = AppState.galleryImages[AppState.currentImageIndex];
    
    // Usar imagen desktop para el modal
    DOM.modalImage.src = image.src;
    DOM.modalImage.alt = image.alt;
    
    // Efecto de transición
    DOM.modalImage.style.opacity = '0';
    setTimeout(() => {
        DOM.modalImage.style.opacity = '1';
    }, 150);
}

function preloadAdjacentImages(currentIndex) {
    const preloadIndexes = [
        currentIndex - 1 >= 0 ? currentIndex - 1 : AppState.galleryImages.length - 1,
        currentIndex + 1 < AppState.galleryImages.length ? currentIndex + 1 : 0
    ];
    
    preloadIndexes.forEach(index => {
        const img = new Image();
        img.src = AppState.galleryImages[index].src;
    });
}

// ================================
// FORMULARIO DE CONTACTO
// ================================

function initContactForm() {
    DOM.contactForm.addEventListener('submit', handleFormSubmit);
    
    // Validación en tiempo real
    const inputs = DOM.contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validar formulario
    const isValid = validateForm();
    if (!isValid) return;
    
    // Mostrar estado de carga
    const submitBtn = DOM.contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    try {
        // Recopilar datos del formulario
        const formData = new FormData(DOM.contactForm);
        
        // Enviar datos al servidor
        const response = await fetch('php/contact.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showFormResponse('success', result.message || '¡Mensaje enviado correctamente! Te contactaremos pronto.');
            DOM.contactForm.reset();
        } else {
            showFormResponse('error', result.message || 'Error al enviar el mensaje. Por favor, intentá nuevamente.');
        }
    } catch (error) {
        console.error('Error:', error);
        showFormResponse('error', 'Error de conexión. Por favor, verificá tu conexión a internet e intentá nuevamente.');
    } finally {
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function validateForm() {
    const requiredFields = DOM.contactForm.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Limpiar errores previos
    clearFieldError({ target: field });
    
    // Validaciones específicas
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                errorMessage = 'El nombre debe tener al menos 2 caracteres';
                isValid = false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Por favor, ingresá un email válido';
                isValid = false;
            }
            break;
            
        case 'phone':
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
            if (!phoneRegex.test(value)) {
                errorMessage = 'Por favor, ingresá un número de teléfono válido';
                isValid = false;
            }
            break;
            
        case 'service':
            if (!value) {
                errorMessage = 'Por favor, seleccioná un servicio';
                isValid = false;
            }
            break;
    }
    
    // Mostrar error si existe
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.style.borderColor = '#dc3545';
    
    // Crear o actualizar mensaje de error
    let errorDiv = field.parentNode.querySelector('.field-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.marginTop = '0.25rem';
        field.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

function clearFieldError(e) {
    const field = e.target;
    field.style.borderColor = '';
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showFormResponse(type, message) {
    DOM.formResponse.className = `form-response ${type}`;
    DOM.formResponse.textContent = message;
    DOM.formResponse.style.display = 'block';
    
    // Scroll al mensaje
    DOM.formResponse.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-ocultar después de 5 segundos si es éxito
    if (type === 'success') {
        setTimeout(() => {
            DOM.formResponse.style.display = 'none';
        }, 5000);
    }
}

// ================================
// SCROLL TO TOP
// ================================

function initScrollToTop() {
    DOM.scrollTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ================================
// ANIMACIONES Y EFECTOS
// ================================

function initAnimations() {
    // Parallax suave en hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Efecto hover en cards
    const cards = document.querySelectorAll('.service-card, .promo-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ================================
// OPTIMIZACIÓN DE PERFORMANCE
// ================================

function initPerformanceOptimizations() {
    // Lazy loading para imágenes
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Debounce para eventos de scroll
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.onscroll = function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (originalScrollHandler) originalScrollHandler();
        }, 16); // ~60fps
    };
}

// ================================
// UTILIDADES
// ================================

// Función para detectar dispositivo móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Función para detectar soporte de WebP
function supportsWebP() {
    return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => resolve(webP.height === 2);
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

// Función para mostrar notificaciones toast
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--${type === 'error' ? 'accent' : 'primary'}-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remover
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, duration);
}

// ================================
// INICIALIZACIÓN PRINCIPAL
// ================================

function initApp() {
    // Verificar soporte del navegador
    if (!('querySelector' in document) || !('addEventListener' in window)) {
        console.error('Este navegador no es compatible');
        return;
    }
    
    // Inicializar todos los módulos
    initLoadingScreen();
    initNavigation();
    initGallery();
    initContactForm();
    initScrollToTop();
    initWhatsAppButton();
    initAnimations();
    initPerformanceOptimizations();
    initPrivacyModal();
    
    // Event listeners globales
    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    console.log('✨ Camilu Peluquería - Web iniciada correctamente');
}

function handleWindowResize() {
    // Cerrar menú móvil si se cambia a desktop
    if (!isMobile() && AppState.isMobileMenuOpen) {
        toggleMobileMenu();
    }
    
    // Recalcular dimensiones de galería
    if (AppState.galleryImages.length > 0) {
        // Throttle resize event
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(() => {
            renderGallery(document.querySelector('.filter-btn.active').getAttribute('data-filter'));
        }, 250);
    }
}

function handleOrientationChange() {
    // Cerrar modal de galería en cambio de orientación
    if (DOM.galleryModal.style.display === 'block') {
        closeGalleryModal();
    }
    
    // Recalcular layout después de cambio de orientación
    setTimeout(() => {
        window.scrollTo(0, window.scrollY + 1);
        window.scrollTo(0, window.scrollY - 1);
    }, 500);
}

// ================================
// ERROR HANDLING GLOBAL
// ================================

window.addEventListener('error', (e) => {
    console.error('Error en la aplicación:', e.error);
    
    // Mostrar mensaje de error amigable al usuario
    if (AppState.isLoaded) {
        showToast('Ocurrió un error inesperado. Por favor, recargá la página.', 'error', 5000);
    }
});

// Manejo de errores de red
window.addEventListener('online', () => {
    showToast('Conexión restaurada', 'success');
});

window.addEventListener('offline', () => {
    showToast('Sin conexión a internet', 'error', 10000);
});

// ================================
// SERVICE WORKER (OPCIONAL)
// ================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registrado:', registration);
            })
            .catch((registrationError) => {
                console.log('SW falló:', registrationError);
            });
    });
}

// ================================
// WHATSAPP FLOATING BUTTON
// ================================

function initWhatsAppButton() {
    const notification = document.getElementById('whatsapp-notification');
    const message = document.getElementById('whatsapp-message');
    const whatsappContainer = document.querySelector('.whatsapp-container');
    
    if (!notification || !message || !whatsappContainer) return;
    
    // Mostrar notificación y mensaje después de 5 segundos
    setTimeout(() => {
        // Mostrar notificación
        notification.classList.add('show');
        
        // Mostrar mensaje 500ms después de la notificación
        setTimeout(() => {
            message.classList.add('show');
            
            // Ocultar mensaje después de 4 segundos
            setTimeout(() => {
                message.classList.remove('show');
            }, 4000);
        }, 500);
    }, 5000);
    
    // Ocultar notificación cuando se haga click en el botón
    whatsappContainer.addEventListener('click', () => {
        notification.classList.remove('show');
        message.classList.remove('show');
    });
    
    // Ocultar mensaje al hacer click fuera de él
    document.addEventListener('click', (e) => {
        if (!whatsappContainer.contains(e.target)) {
            message.classList.remove('show');
        }
    });
}

// ================================
// INICIALIZACIÓN CUANDO EL DOM ESTÉ LISTO
// ================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Exportar funciones para testing (opcional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppState,
        initApp,
        validateForm,
        showToast
    };
}

// ===== MODAL DE POLÍTICA DE PRIVACIDAD =====
function initPrivacyModal() {
    const privacyModal = document.getElementById('privacy-modal');
    const privacyLink = document.getElementById('privacy-link');
    const privacyClose = document.getElementById('privacy-modal-close');
    const privacyAccept = document.getElementById('privacy-accept');
    const modalContent = privacyModal?.querySelector('.privacy-modal-content');

    if (!privacyModal || !privacyLink) return;

    // Abrir modal
    privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        openPrivacyModal();
    });

    // Cerrar modal con botón X
    privacyClose?.addEventListener('click', () => {
        closePrivacyModal();
    });

    // Cerrar modal con botón Aceptar
    privacyAccept?.addEventListener('click', () => {
        closePrivacyModal();
    });

    // Cerrar modal tocando fuera del contenido
    privacyModal.addEventListener('click', (e) => {
        if (e.target === privacyModal) {
            closePrivacyModal();
        }
    });

    // Prevenir que el clic en el contenido del modal lo cierre
    modalContent?.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && privacyModal.classList.contains('show')) {
            closePrivacyModal();
        }
    });

    function openPrivacyModal() {
        privacyModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Scroll al inicio del modal
        const modalBody = privacyModal.querySelector('.privacy-modal-body');
        if (modalBody) {
            modalBody.scrollTop = 0;
        }
    }

    function closePrivacyModal() {
        privacyModal.classList.remove('show');
        document.body.style.overflow = '';
    }
}
