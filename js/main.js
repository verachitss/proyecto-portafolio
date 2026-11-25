/* ==========================================================================
   js/main.js
   Lógica global compartida por las 5 páginas del portafolio:
   1. Menú móvil interactivo (hamburguesa).
   2. Detección automática del enlace de navegación activo (.active).
   3. Año dinámico en el pie de página (footer).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar las funcionalidades globales
  initMobileMenu();
  setActiveNavLink();
  setCurrentYear();
});

/* --------------------------------------------------------------------------
   1. MENÚ MÓVIL (Toggle de la clase .open)
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (!menuToggle || !navMenu) return;

  const setMenuState = (isOpen) => {
    navMenu.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    menuToggle.textContent = isOpen ? '✕' : '☰';
  };

  // Alternar apertura/cierre al hacer clic en el botón hamburguesa
  menuToggle.addEventListener('click', () => {
    const isOpen = !navMenu.classList.contains('open');
    setMenuState(isOpen);
  });

  // Cerrar el menú al hacer clic en cualquier enlace de navegación
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        setMenuState(false);
      }
    });
  });

  // Cerrar el menú si se hace clic fuera del encabezado
  document.addEventListener('click', (event) => {
    const isClickInside = menuToggle.contains(event.target) || navMenu.contains(event.target);
    if (!isClickInside && navMenu.classList.contains('open')) {
      setMenuState(false);
    }
  });

  // Cerrar el menú con la tecla Escape para accesibilidad
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('open')) {
      setMenuState(false);
      menuToggle.focus();
    }
  });

  // Restablecer estado si la pantalla vuelve a escritorio
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
      setMenuState(false);
    }
  });
}

/* --------------------------------------------------------------------------
   2. ENLACE ACTIVO DINÁMICO
   Identifica la página actual según la URL y asigna la clase .active
   -------------------------------------------------------------------------- */
function setActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  if (!navLinks.length) return;

  // Obtener el nombre del archivo actual desde la ruta (ej: 'about.html')
  const path = window.location.pathname;
  let currentPage = path.substring(path.lastIndexOf('/') + 1);

  // Si la ruta termina en / o está vacía, estamos en la página de inicio
  if (currentPage === '' || currentPage === '/') {
    currentPage = 'index.html';
  }

  // Recorrer los enlaces y activar el que coincida
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');

    // Limpiar estado previo
    link.classList.remove('active');

    // Comparar si el href coincide con la página actual
    if (linkHref === currentPage) {
      link.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   3. AÑO DINÁMICO EN FOOTER
   Inserta el año actual para mantener los derechos de autor actualizados
   -------------------------------------------------------------------------- */
function setCurrentYear() {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}
