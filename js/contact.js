/* ==========================================================================
   js/contact.js
   Lógica específica para la página de Contacto (contact.html):
   1. Copiar correo al portapapeles con confirmación visual.
   2. Validación de campos obligatorios y formato de correo electrónico.
   3. Envío de mensaje mediante cliente de correo (mailto:).
   4. Envío de mensaje directo hacia WhatsApp (wa.me) sin backend.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Datos de contacto configurables de Cristhian Vera
  const CONTACT_CONFIG = {
    email: 'cristhianvera131102@gmail.com',
    whatsappPhone: '593961440055' // Ecuador (+593 96 144 0055) sin signos '+' ni espacios
  };

  initCopyEmail(CONTACT_CONFIG.email);
  initContactForm(CONTACT_CONFIG);
});

/* --------------------------------------------------------------------------
   1. COPIAR CORREO AL PORTAPAPELES
   -------------------------------------------------------------------------- */
function initCopyEmail(emailToCopy) {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  const originalText = copyBtn.textContent;

  copyBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // Método moderno estándar
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        // Fallback para navegadores antiguos o entornos sin HTTPS
        const tempInput = document.createElement('textarea');
        tempInput.value = emailToCopy;
        tempInput.style.position = 'fixed';
        tempInput.style.left = '-9999px';
        document.body.appendChild(tempInput);
        tempInput.focus();
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      // Confirmación visual temporal
      copyBtn.textContent = '¡Correo copiado!';
      copyBtn.classList.add('btn-primary');
      copyBtn.classList.remove('btn-outline');

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove('btn-primary');
        copyBtn.classList.add('btn-outline');
      }, 2500);

    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
      alert(`No se pudo copiar automáticamente. El correo es: ${emailToCopy}`);
    }
  });
}

/* --------------------------------------------------------------------------
   2. FORMULARIO: VALIDACIÓN Y ENVÍO A CORREO / WHATSAPP
   -------------------------------------------------------------------------- */
function initContactForm(config) {
  const form = document.getElementById('contact-form');
  const whatsappBtn = document.getElementById('send-whatsapp-btn');
  const feedbackEl = document.getElementById('form-feedback');

  if (!form || !whatsappBtn || !feedbackEl) return;

  // Manejador del botón "Enviar por Correo" (Submit del formulario)
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita la recarga por defecto de la página

    const formData = getFormData(form);
    const validation = validateFormData(formData);

    if (!validation.isValid) {
      showFeedback(feedbackEl, validation.message, 'error');
      return;
    }

    // Construcción de la URL mailto:
    const mailtoSubject = encodeURIComponent(`[Portafolio] ${formData.subject}`);
    const mailtoBody = encodeURIComponent(
      `Hola,\n\nHas recibido un mensaje desde tu portafolio web:\n\n` +
      `Nombre: ${formData.name}\n` +
      `Correo de contacto: ${formData.email}\n` +
      `Asunto: ${formData.subject}\n\n` +
      `Mensaje:\n${formData.message}\n`
    );

    const mailtoUrl = `mailto:${config.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

    showFeedback(feedbackEl, '¡Abriendo tu cliente de correo predeterminado...', 'success');

    // Abre el cliente de correo del usuario (Outlook, Thunderbird, Mail, etc.)
    window.location.href = mailtoUrl;
  });

  // Manejador del botón "Enviar por WhatsApp"
  whatsappBtn.addEventListener('click', () => {
    const formData = getFormData(form);
    const validation = validateFormData(formData);

    if (!validation.isValid) {
      showFeedback(feedbackEl, validation.message, 'error');
      return;
    }

    // Construcción del mensaje para WhatsApp con formato negrita (*)
    const whatsappMessage =
      `*Nuevo mensaje desde el Portafolio Web*\n\n` +
      `*Nombre:* ${formData.name}\n` +
      `*Correo:* ${formData.email}\n` +
      `*Asunto:* ${formData.subject}\n` +
      `*Mensaje:* ${formData.message}`;

    const whatsappUrl = `https://wa.me/${config.whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`;

    showFeedback(feedbackEl, '¡Redirigiendo a WhatsApp...', 'success');

    // Abre WhatsApp Web o la App en una nueva pestaña
    window.open(whatsappUrl, '_blank');
  });
}

/* --------------------------------------------------------------------------
   3. FUNCIONES AUXILIARES DE FORMULARIO
   -------------------------------------------------------------------------- */

// Extrae y limpia los valores de los campos del formulario
function getFormData(form) {
  return {
    name: form.elements['name'] ? form.elements['name'].value.trim() : '',
    email: form.elements['email'] ? form.elements['email'].value.trim() : '',
    subject: form.elements['subject'] ? form.elements['subject'].value.trim() : '',
    message: form.elements['message'] ? form.elements['message'].value.trim() : ''
  };
}

// Valida que no haya campos vacíos y que el correo tenga formato válido
function validateFormData(data) {
  if (!data.name) {
    return { isValid: false, message: 'Por favor, ingresa tu nombre completo.' };
  }

  if (!data.email) {
    return { isValid: false, message: 'Por favor, ingresa tu correo electrónico.' };
  }

  // Expresión regular para validar formato de correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { isValid: false, message: 'El formato del correo electrónico no es válido.' };
  }

  if (!data.subject) {
    return { isValid: false, message: 'Por favor, indica el asunto del mensaje.' };
  }

  if (!data.message) {
    return { isValid: false, message: 'Por favor, escribe el contenido de tu mensaje.' };
  }

  return { isValid: true, message: '' };
}

// Muestra alertas visuales de éxito o error
function showFeedback(element, message, type) {
  element.textContent = message;
  element.className = `form-feedback ${type}`;
  element.style.display = 'block';

  // Si es un error, enfocar el mensaje para accesibilidad
  if (type === 'error') {
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
