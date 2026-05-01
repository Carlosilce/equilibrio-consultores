/* ============================================================
   main.js — Lógica principal del sitio Equilibrio Consultores
   Incluye: carga de secciones, navbar, scroll, acordeón, formulario
   ============================================================ */

/* ---- 1. CARGA DE SECCIONES HTML (sistema modular) ----
   Cada sección vive en su propio archivo dentro de /sections/
   Esta función los inserta en los placeholders del index.html
   -------------------------------------------------------- */
async function cargarSeccion(archivoHTML, idPlaceholder) {
  try {
    const respuesta = await fetch(archivoHTML);
    const html = await respuesta.text();
    document.getElementById(idPlaceholder).innerHTML = html;
  } catch (error) {
    console.error(`Error al cargar ${archivoHTML}:`, error);
  }
}

/* Carga todas las secciones al iniciar la página */
async function cargarTodasLasSecciones() {
  await Promise.all([
    cargarSeccion('hero.html',        'hero-placeholder'),
    cargarSeccion('servicios.html',   'servicios-placeholder'),
    cargarSeccion('testimonios.html', 'testimonios-placeholder'),
    cargarSeccion('faq.html',         'faq-placeholder'),
    cargarSeccion('contacto.html',    'contacto-placeholder'),
  ]);
  /* Después de cargar, inicializamos todo lo que depende del DOM */
  iniciarRevealAlScroll();
  iniciarAcordeonFAQ();
  iniciarFormularioContacto();
}

/* ---- 2. NAVBAR: cambio de estilo al hacer scroll ----
   Añade la clase .scrolled cuando el usuario baja más de 60px
   ------------------------------------------------------ */
function iniciarNavbar() {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('navLinks');

  /* Cambia fondo del navbar al hacer scroll */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* Menú hamburguesa: abre/cierra en móvil */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  /* Cierra el menú al hacer clic en cualquier enlace */
  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}

/* ---- 3. REVEAL AL SCROLL (Intersection Observer) ----
   Los elementos con clase .reveal aparecen con animación
   cuando entran al viewport al hacer scroll
   ------------------------------------------------------ */
function iniciarRevealAlScroll() {
  const elementos = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visible');
        /* Deja de observar una vez que ya es visible */
        observer.unobserve(entrada.target);
      }
    });
  }, {
    threshold: 0.12,   /* Se activa cuando el 12% del elemento es visible */
    rootMargin: '0px 0px -40px 0px'
  });

  elementos.forEach(el => observer.observe(el));
}

/* ---- 4. ACORDEÓN FAQ ----
   Al hacer clic en una pregunta, abre esa respuesta
   y cierra las demás
   ------------------------------------------------------ */
function iniciarAcordeonFAQ() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const boton = item.querySelector('.faq-item__question');
    boton.addEventListener('click', () => {
      const estaAbierto = item.classList.contains('open');

      /* Cierra todos los ítems */
      items.forEach(i => i.classList.remove('open'));

      /* Si no estaba abierto, ábrelo */
      if (!estaAbierto) {
        item.classList.add('open');
      }
    });
  });
}

/* ---- 5. FORMULARIO DE CONTACTO CON VALIDACIÓN ----
   Valida campos requeridos antes de "enviar"
   (sin backend: simula envío exitoso)
   ------------------------------------------------------ */
function iniciarFormularioContacto() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault(); /* Evita que la página se recargue */
    let valido = true;

    /* Función auxiliar para marcar error o limpiar */
    function validarCampo(idGrupo, condicion) {
      const grupo = document.getElementById(idGrupo);
      if (!grupo) return;
      if (!condicion) {
        grupo.classList.add('has-error');
        grupo.querySelector('input, select, textarea')?.classList.add('error');
        valido = false;
      } else {
        grupo.classList.remove('has-error');
        grupo.querySelector('input, select, textarea')?.classList.remove('error');
      }
    }

    /* Validaciones individuales */
    const nombre   = document.getElementById('nombre')?.value.trim();
    const correo   = document.getElementById('correo')?.value.trim();
    const servicio = document.getElementById('servicio')?.value;
    const mensaje  = document.getElementById('mensaje')?.value.trim();

    validarCampo('group-nombre',   nombre && nombre.length >= 2);
    validarCampo('group-correo',   correo && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo));
    validarCampo('group-servicio', servicio !== '');
    validarCampo('group-mensaje',  mensaje && mensaje.length >= 10);

    /* Si todo es válido, simula el envío */
    if (valido) {
      form.style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
      /* Aquí conectarías con tu backend, Formspree, EmailJS, etc. */
    }
  });

  /* Limpia el error al escribir en un campo */
  form.querySelectorAll('input, select, textarea').forEach(campo => {
    campo.addEventListener('input', () => {
      const grupo = campo.closest('.form-group');
      if (grupo) {
        grupo.classList.remove('has-error');
        campo.classList.remove('error');
      }
    });
  });
}

/* ---- INICIALIZACIÓN ----
   Se ejecuta cuando el DOM está listo
   ------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  iniciarNavbar();
  cargarTodasLasSecciones();
});
