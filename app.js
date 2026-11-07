/**
 * GLOWFY — app.js
 * CSS Shadow & Glassmorphism Generator
 * 100% Client-Side | Vanilla JS | No dependencies
 * -----------------------------------------------
 * Módulos:
 *  1. CONFIG & CONSTANTS
 *  2. STATE MANAGEMENT & HISTORY (Undo/Redo)
 *  3. SHADOW ENGINE
 *  4. GLASS ENGINE
 *  5. CODE GENERATOR
 *  6. PRESETS
 *  7. UI BINDINGS
 *  8. FAVORITES (localStorage)
 *  9. SHARE BY URL
 * 10. CONTACT FORM
 * 11. KEYBOARD SHORTCUTS
 * 12. INIT
 */

(function () {
  'use strict';

  /* =============================================
   * 1. CONFIG & CONSTANTS
   * ============================================= */
  const MAX_LAYERS = 5;
  const MAX_HISTORY = 50;
  const MAX_FAVS = 20;
  const STORAGE_KEY_FAVS = 'glowfy_favorites_v1';
  const STORAGE_KEY_LANG = 'glowfy_lang_v1';
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyQoLcVK0jqdR3VKwQS4CMVA9VW9H3Kc_XiImOnHajy9zBoYHOSHr_EtM7bqi0UUKPTyQ/exec';

  /* =============================================
   * i18n — TRANSLATION SYSTEM
   * ============================================= */
  const TRANSLATIONS = {
    es: {
      'page_title': 'Glowfy — Generador de Sombras CSS y Glassmorphism Online',
      'layer_prefix': 'Capa ',
      // Header nav
      'nav.shadow': 'Sombras Multicapa',
      'nav.glass': 'Glassmorphism',
      'nav.contact': 'Contacto',
      // Controls panel
      'ctrl.presets': 'Presets rápidos',
      'ctrl.random': 'Aleatorio',
      'ctrl.undo': 'Deshacer',
      'ctrl.redo': 'Rehacer',
      'ctrl.layers': 'Capas de sombra',
      'ctrl.addLayer': '+ Añadir',
      'ctrl.activeLayer': 'Controles de capa activa',
      'ctrl.offsetX': 'Offset X',
      'ctrl.offsetY': 'Offset Y',
      'ctrl.blur': 'Blur',
      'ctrl.spread': 'Spread',
      'ctrl.opacity': 'Opacidad',
      'ctrl.color': 'Color',
      'ctrl.inset': 'Inset',
      'ctrl.glass': 'Parámetros de cristal',
      'ctrl.glassBg': 'Blur de fondo',
      'ctrl.glassBgOp': 'Opacidad de fondo',
      'ctrl.glassBorderOp': 'Opacidad borde',
      'ctrl.glassRadius': 'Radio de esquinas',
      'ctrl.glassSat': 'Saturación',
      'ctrl.glassTint': 'Color tinte',
      'ctrl.favorites': 'Favoritos guardados',
      'ctrl.save': 'Guardar',
      'ctrl.empty': 'Aún no hay favoritos guardados.',
      // Presets names
      'preset.soft': 'Sombra Suave',
      'preset.material': 'Elevación Material',
      'preset.neon': 'Sombra Neón',
      'preset.floating': 'Flotante Pro',
      'preset.appleGlass': 'Apple Glass',
      'preset.stripeUI': 'Stripe UI',
      'preset.frostedGlass': 'Vidrio Esmerilado',
      'preset.darkGlass': 'Cristal Oscuro',
      'preset.aurora': 'Aurora',
      'preset.crisp': 'Nítido',
      // Preview
      'preview.title': 'Vista previa en vivo',
      'preview.dark': 'Oscuro',
      'preview.light': 'Claro',
      'preview.gradient': 'Gradiente',
      'preview.image': 'Imagen',
      'preview.cardText': 'Vista Previa',
      'preview.cardSub': 'Tu efecto aparece aquí',
      // Code panel
      'code.title': 'Código generado',
      'code.copy': 'Copiar código',
      'code.copied': '¡Copiado!',
      'code.share': 'Compartir por URL',
      'code.shareOk': '¡Enlace copiado!',
      // Form
      'form.title': 'Contacto',
      'form.category': 'Motivo de contacto',
      'form.categoryPlaceholder': 'Selecciona un motivo…',
      'form.bug': 'Reportar un fallo',
      'form.feature': 'Sugerir una función',
      'form.general': 'Contacto general',
      'form.name': 'Nombre o alias',
      'form.namePlaceholder': 'Tu nombre o alias',
      'form.email': 'Correo electrónico',
      'form.emailPlaceholder': 'tu@correo.com',
      'form.message': 'Mensaje',
      'form.messagePh': 'Describe tu consulta con detalle…',
      'form.submit': 'Enviar mensaje',
      'form.sending': 'Enviando…',
      'form.successMsg': '¡Mensaje enviado con éxito!',
      'form.errCat': 'Por favor selecciona un motivo.',
      'form.errEmail': 'Por favor introduce un correo válido.',
      'form.errMsg': 'Por favor escribe un mensaje.',
      'form.errSend': 'Error al enviar. Intenta de nuevo más tarde.',
      // Toast / misc
      'toast.copied': 'Código copiado al portapapeles',
      'toast.errCopy': 'Error al copiar. Selecciona el texto manualmente.',
      'toast.shareOk': 'URL de compartir copiada',
      'toast.shareErr': 'No se pudo copiar. Copia la URL manualmente.',
      'toast.preset': 'Preset aplicado: ',
      'toast.random': 'Sombra aleatoria aplicada',
      'toast.favSaved': '¡Configuración guardada como favorito!',
      'toast.favLoaded': 'Favorito cargado',
      'toast.favDel': 'Favorito eliminado',
      'toast.favMax': 'favoritos. Elimina alguno.',
      'toast.layerMax': 'capas permitidas',
      'toast.layerMin': 'Debe haber al menos una capa',
      'toast.urlLoaded': 'Configuración cargada desde la URL',
      'toast.lang': 'Idioma: Español',
      // Ads
      'ad.label': 'PUBLICIDAD',
      'ad.placeholder': 'Espacio disponible para anuncio',
      // SEO
      'seo.h1': 'Generador de Sombras CSS y Glassmorphism Online — Gratis',
      'seo.lead': 'Crea efectos box-shadow multicapa y estilos de glassmorphism profesionales de forma visual, instantánea y completamente gratuita. Copia el código en CSS, Variables CSS o formato Tailwind.',
      'seo.art1Title': '¿Cómo usar el generador de sombras CSS?',
      'seo.art1P1': 'Mueve los deslizadores de Offset X, Offset Y, Blur y Spread para ajustar cada capa de sombra. Puedes añadir hasta 5 capas independientes para crear efectos de profundidad realistas. Una vez satisfecho, copia el código generado con un clic.',
      'seo.art1P2': 'El sistema de historial con Deshacer/Rehacer te permite experimentar libremente sin miedo a perder tu progreso, y puedes guardar tus configuraciones favoritas en el navegador.',
      'seo.art2Title': '¿Qué es el Glassmorphism?',
      'seo.art2P1': 'El glassmorphism (o efecto cristal) es una tendencia de diseño UI que simula vidrio esmerilado mediante la propiedad CSS backdrop-filter: blur() combinada con fondos semi-transparentes y bordes translúcidos.',
      'seo.art2P2': 'Con esta herramienta puedes ajustar el blur de fondo, la opacidad, el radio de esquinas y la saturación para obtener el efecto de cristal perfecto.',
      'seo.art3Title': 'Formatos de código disponibles',
      'seo.fmt1': 'CSS Tradicional: Listo para pegar directamente en tu hoja de estilos.',
      'seo.fmt2': 'Variables CSS: Código con custom properties para proyectos escalables.',
      'seo.fmt3': 'Tailwind CSS: Clases JIT para proyectos con Tailwind v3+.',
      // FAQ
      'faq.title': 'Preguntas frecuentes (FAQ)',
      'faq.q1': '¿Qué son los Presets Rápidos y cómo funciona el botón Aleatorio?',
      'faq.a1': 'Glowfy incluye 6 presets de nivel producción (\'Sombra Suave\', \'Elevación Material\', \'Sombra Neón\', \'Flotante Pro\', \'Apple Glass\' y \'Stripe UI\') diseñados para cubrir las elevaciones más demandadas en interfaces modernas. Además, el botón "Aleatorio" genera al instante combinaciones profesionales multicapa con proporciones curadas inspiradas en los sistemas de diseño de Apple, Stripe, Tailwind UI y Vercel, permitiéndote explorar estéticas pulidas con un solo clic.',
      'faq.q2': '¿El código generado funciona en todos los navegadores?',
      'faq.a2': 'Sí. Tanto box-shadow como backdrop-filter cuentan con soporte nativo total en todos los navegadores modernos (Chrome, Firefox, Safari, Edge y navegadores móviles). Ya no se requieren configuraciones especiales ni banderas experimentales para disfrutar de sombras multicapa y efectos glassmorphism de alto rendimiento.',
      'faq.q3': '¿Cuántas capas de sombra puedo añadir?',
      'faq.a3': 'Puedes añadir hasta 5 capas de sombra independientes. Cada capa tiene sus propios parámetros de offset, blur, spread, opacidad y color. Las capas se combinan automáticamente en la propiedad box-shadow.',
      'faq.q4': '¿Mis diseños se guardan de forma permanente?',
      'faq.a4': 'Los favoritos se guardan en el localStorage de tu navegador. Son persistentes mientras no borres los datos del navegador, pero son locales a tu dispositivo. Usa la función "Compartir por URL" para guardar configuraciones de forma universal.',
      'faq.q5': '¿Cómo usar el código Tailwind generado?',
      'faq.a5': 'El código Tailwind generado usa clases arbitrarias de JIT Mode compatibles con Tailwind CSS v3+. Simplemente añade las clases al elemento HTML correspondiente en tu proyecto.',
      // Footer
      'footer.tagline': 'Herramientas CSS gratuitas para diseñadores y desarrolladores.',
      'footer.status': 'Sistema operativo',
      'footer.privacy': 'Política de Privacidad',
      'footer.terms': 'Términos de Uso',
      'footer.contact': 'Contacto',
      'footer.copy': 'Todos los derechos reservados. Herramienta 100% gratuita y de código abierto.',
      // Legal modals
      'legal.privacyTitle': 'Política de Privacidad',
      'legal.termsTitle': 'Términos de Uso',
      'legal.close': 'Cerrar',
    },
    en: {
      'page_title': 'Glowfy — CSS Shadow & Glassmorphism Generator',
      'layer_prefix': 'Layer ',
      // Header nav
      'nav.shadow': 'Multilayer Shadows',
      'nav.glass': 'Glassmorphism',
      'nav.contact': 'Contact',
      // Controls panel
      'ctrl.presets': 'Quick presets',
      'ctrl.random': 'Randomize',
      'ctrl.undo': 'Undo',
      'ctrl.redo': 'Redo',
      'ctrl.layers': 'Shadow layers',
      'ctrl.addLayer': '+ Add',
      'ctrl.activeLayer': 'Active layer controls',
      'ctrl.offsetX': 'Offset X',
      'ctrl.offsetY': 'Offset Y',
      'ctrl.blur': 'Blur',
      'ctrl.spread': 'Spread',
      'ctrl.opacity': 'Opacity',
      'ctrl.color': 'Color',
      'ctrl.inset': 'Inset',
      'ctrl.glass': 'Glass parameters',
      'ctrl.glassBg': 'Background blur',
      'ctrl.glassBgOp': 'Background opacity',
      'ctrl.glassBorderOp': 'Border opacity',
      'ctrl.glassRadius': 'Corner radius',
      'ctrl.glassSat': 'Saturation',
      'ctrl.glassTint': 'Tint color',
      'ctrl.favorites': 'Saved favorites',
      'ctrl.save': 'Save',
      'ctrl.empty': 'No saved favorites yet.',
      // Presets names
      'preset.soft': 'Soft Shadow',
      'preset.material': 'Material Elevation',
      'preset.neon': 'Neon Glow',
      'preset.floating': 'Pro Floating',
      'preset.appleGlass': 'Apple Glass',
      'preset.stripeUI': 'Stripe UI',
      'preset.frostedGlass': 'Frosted Glass',
      'preset.darkGlass': 'Dark Glass',
      'preset.aurora': 'Aurora',
      'preset.crisp': 'Crisp Glass',
      // Preview
      'preview.title': 'Live preview',
      'preview.dark': 'Dark',
      'preview.light': 'Light',
      'preview.gradient': 'Gradient',
      'preview.image': 'Image',
      'preview.cardText': 'Preview',
      'preview.cardSub': 'Your effect appears here',
      // Code panel
      'code.title': 'Generated code',
      'code.copy': 'Copy code',
      'code.copied': 'Copied!',
      'code.share': 'Share by URL',
      'code.shareOk': 'Link copied!',
      // Form
      'form.title': 'Contact',
      'form.category': 'Reason for contact',
      'form.categoryPlaceholder': 'Select a reason…',
      'form.bug': 'Report a bug',
      'form.feature': 'Suggest a feature',
      'form.general': 'General contact',
      'form.name': 'Name or alias',
      'form.namePlaceholder': 'Your name or alias',
      'form.email': 'Email address',
      'form.emailPlaceholder': 'you@email.com',
      'form.message': 'Message',
      'form.messagePh': 'Describe your query in detail…',
      'form.submit': 'Send message',
      'form.sending': 'Sending…',
      'form.successMsg': 'Message sent successfully!',
      'form.errCat': 'Please select a reason.',
      'form.errEmail': 'Please enter a valid email.',
      'form.errMsg': 'Please write a message.',
      'form.errSend': 'Send error. Please try again later.',
      'toast.copied': 'Code copied to clipboard',
      'toast.errCopy': 'Copy failed. Select the text manually.',
      'toast.shareOk': 'Share URL copied',
      'toast.shareErr': 'Could not copy. Copy the URL manually.',
      'toast.preset': 'Preset applied: ',
      'toast.random': 'Random shadow applied',
      'toast.favSaved': 'Configuration saved as favorite!',
      'toast.favLoaded': 'Favorite loaded',
      'toast.favDel': 'Favorite deleted',
      'toast.favMax': 'favorites. Delete one first.',
      'toast.layerMax': 'layers allowed',
      'toast.layerMin': 'At least one layer is required',
      'toast.urlLoaded': 'Configuration loaded from URL',
      'toast.lang': 'Language: English',
      // Ads
      'ad.label': 'ADVERTISEMENT',
      'ad.placeholder': 'Ad space available',
      // SEO
      'seo.h1': 'Online CSS Shadow & Glassmorphism Generator — Free',
      'seo.lead': 'Create multilayer box-shadow effects and professional glassmorphism styles visually, instantly, and completely free. Copy code in CSS, CSS Variables, or Tailwind format.',
      'seo.art1Title': 'How to use the CSS shadow generator?',
      'seo.art1P1': 'Adjust Offset X, Offset Y, Blur, and Spread sliders to customize each shadow layer. You can add up to 5 independent layers for realistic depth effects. Once satisfied, copy the generated code with one click.',
      'seo.art1P2': 'The history system with Undo/Redo lets you experiment freely without fear of losing progress, and you can save your favorite configurations right in your browser.',
      'seo.art2Title': 'What is Glassmorphism?',
      'seo.art2P1': 'Glassmorphism is a UI design trend simulating frosted glass using the CSS backdrop-filter: blur() property combined with semi-transparent backgrounds and translucent borders.',
      'seo.art2P2': 'With this tool you can adjust background blur, opacity, corner radius, and saturation to achieve the perfect frosted glass look.',
      'seo.art3Title': 'Available code formats',
      'seo.fmt1': 'Standard CSS: Ready to paste directly into your stylesheet.',
      'seo.fmt2': 'CSS Variables: Code structured with custom properties for scalable projects.',
      'seo.fmt3': 'Tailwind CSS: JIT arbitrary classes for Tailwind CSS v3+ projects.',
      // FAQ
      'faq.title': 'Frequently Asked Questions (FAQ)',
      'faq.q1': 'What are the Quick Presets and how does the Randomize button work?',
      'faq.a1': 'Glowfy includes 6 production-grade presets (\'Soft Shadow\', \'Material Elevation\', \'Neon Glow\', \'Pro Floating\', \'Apple Glass\', and \'Stripe UI\') designed for modern user interfaces. The "Randomize" button instantly generates curated professional multilayer combinations inspired by Apple, Stripe, Tailwind UI, and Vercel design systems with a single click.',
      'faq.q2': 'Does the generated code work across all browsers?',
      'faq.a2': 'Yes. Both box-shadow and backdrop-filter have full native support across all modern browsers (Chrome, Firefox, Safari, Edge, and mobile browsers). No special configurations or experimental flags are needed for high-performance multilayer shadows and glassmorphism effects.',
      'faq.q3': 'How many shadow layers can I add?',
      'faq.a3': 'You can add up to 5 independent shadow layers. Each layer has its own offset, blur, spread, opacity, and color parameters, combined automatically into the box-shadow property.',
      'faq.q4': 'Are my designs saved permanently?',
      'faq.a4': 'Favorites are saved in your browser localStorage. They persist unless browser data is cleared, but remain local to your device. Use the "Share by URL" feature to save and share configurations universally.',
      'faq.q5': 'How do I use the generated Tailwind code?',
      'faq.a5': 'The generated Tailwind code uses arbitrary JIT Mode classes compatible with Tailwind CSS v3+. Simply add the classes to the corresponding HTML element in your project.',
      // Footer
      'footer.tagline': 'Free CSS tools for designers and developers.',
      'footer.status': 'System operational',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms of Use',
      'footer.contact': 'Contact',
      'footer.copy': 'All rights reserved. 100% free and open source tool.',
      // Legal modals
      'legal.privacyTitle': 'Privacy Policy',
      'legal.termsTitle': 'Terms of Use',
      'legal.close': 'Close',
    },
  };

  let currentLang = 'es';

  function t(key) {
    return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || key;
  }

  function applyTranslations() {
    const lang = currentLang;
    const T = TRANSLATIONS[lang];
    if (!T) return;

    // Update <title> tab
    if (T['page_title']) {
      document.title = T['page_title'];
    }

    // Direct DOM text targets
    const map = {
      'tab-shadow': T['nav.shadow'],
      'tab-glass': T['nav.glass'],
      'btn-add-layer': T['ctrl.addLayer'],
    };

    Object.keys(map).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = map[id];
    });

    // Language button label & accessibility
    const langLabel = document.getElementById('lang-label');
    if (langLabel) langLabel.textContent = lang.toUpperCase();
    const langBtn = document.getElementById('btn-lang');
    if (langBtn) {
      langBtn.setAttribute('aria-label', lang === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish');
      langBtn.title = lang === 'es' ? 'Cambiar idioma (EN)' : 'Switch language (ES)';
    }

    // Undo/redo preserve their SVG icons — update text node only
    const undoBtn = document.getElementById('btn-undo');
    if (undoBtn) {
      const svg = undoBtn.querySelector('svg');
      undoBtn.textContent = T['ctrl.undo'];
      if (svg) undoBtn.prepend(svg);
    }
    const redoBtn = document.getElementById('btn-redo');
    if (redoBtn) {
      const svg = redoBtn.querySelector('svg');
      redoBtn.textContent = T['ctrl.redo'];
      if (svg) redoBtn.appendChild(svg);
    }

    // Copy button label span
    const copyLabel = document.getElementById('copy-label');
    if (copyLabel && copyLabel.textContent !== T['code.copied']) {
      copyLabel.textContent = T['code.copy'];
    }

    // Share button (has SVG child)
    const shareBtn = document.getElementById('btn-share');
    if (shareBtn) {
      const svg = shareBtn.querySelector('svg');
      shareBtn.textContent = T['code.share'];
      if (svg) shareBtn.prepend(svg);
    }

    // Save fav button (has SVG child)
    const saveFavBtn = document.getElementById('btn-save-fav');
    if (saveFavBtn) {
      const svg = saveFavBtn.querySelector('svg');
      const labelSpan = document.getElementById('save-fav-label');
      if (labelSpan) {
        labelSpan.textContent = T['ctrl.save'];
      } else {
        saveFavBtn.textContent = T['ctrl.save'];
        if (svg) saveFavBtn.prepend(svg);
      }
    }

    // Randomize button
    const randomBtn = document.getElementById('btn-random');
    if (randomBtn) {
      randomBtn.setAttribute('aria-label', T['ctrl.random'] || 'Aleatorio');
    }
    const randomLabel = document.getElementById('random-label');
    if (randomLabel) {
      randomLabel.textContent = T['ctrl.random'] || 'Aleatorio';
    }

    // Dynamic data-i18n attributes across the entire DOM
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (T[key]) el.textContent = T[key];
    });

    // Legal modals content language toggle
    document.querySelectorAll('.legal-text-es').forEach(el => {
      el.classList.toggle('hidden', lang !== 'es');
    });
    document.querySelectorAll('.legal-text-en').forEach(el => {
      el.classList.toggle('hidden', lang !== 'en');
    });

    // Background toggle buttons
    const bgBtnMap = { dark: 'preview.dark', light: 'preview.light', gradient: 'preview.gradient', image: 'preview.image' };
    document.querySelectorAll('.bg-btn').forEach(btn => {
      const key = bgBtnMap[btn.dataset.bg];
      if (key && T[key]) btn.textContent = T[key];
    });

    // Preview card
    const cardText = document.querySelector('.preview-card-text');
    const cardSub = document.querySelector('.preview-card-sub');
    if (cardText) cardText.textContent = T['preview.cardText'];
    if (cardSub) cardSub.textContent = T['preview.cardSub'];

    // Contact modal
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) modalTitle.textContent = T['form.title'];
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const msgTextarea = document.getElementById('contact-message');
    const submitLabel = document.getElementById('submit-label');
    const nameLabel = document.querySelector('label[for="contact-name"]');
    const emailLabel = document.querySelector('label[for="contact-email"]');
    const msgLabel = document.querySelector('label[for="contact-message"]');
    if (nameLabel) nameLabel.textContent = T['form.name'];
    if (emailLabel) emailLabel.textContent = T['form.email'];
    if (msgLabel) msgLabel.textContent = T['form.message'];
    if (nameInput) nameInput.placeholder = T['form.namePlaceholder'];
    if (emailInput) emailInput.placeholder = T['form.emailPlaceholder'];
    if (msgTextarea) msgTextarea.placeholder = T['form.messagePh'];
    if (submitLabel) submitLabel.textContent = T['form.submit'];

    // Presets and favorites re-render with active language
    renderPresets();
    renderFavorites();
    renderLayers();
    generateCode();

    // html lang attribute
    document.documentElement.lang = lang;
  }

  function bindLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG) || localStorage.getItem('cssforge_lang_v1');
      if (saved === 'en' || saved === 'es') currentLang = saved;
    } catch (e) { }

    const btn = document.getElementById('btn-lang');
    const label = document.getElementById('lang-label');
    if (!btn) return;

    // Set initial label
    if (label) label.textContent = currentLang.toUpperCase();

    btn.addEventListener('click', () => {
      currentLang = currentLang === 'es' ? 'en' : 'es';
      try { localStorage.setItem(STORAGE_KEY_LANG, currentLang); } catch (e) { }
      if (label) label.textContent = currentLang.toUpperCase();
      applyTranslations();
      showToast(t('toast.lang'), 'success');
    });

    // Apply stored language on load
    applyTranslations();
  }

  /* =============================================
   * 2. STATE MANAGEMENT
   * ============================================= */
  let state = {
    tool: 'shadow',
    activeBg: 'dark',
    codeFormat: 'css',
    shadowLayers: [
      { id: uid(), offsetX: 0, offsetY: 8, blur: 24, spread: -4, opacity: 35, color: '#000000', inset: false, visible: true },
      { id: uid(), offsetX: 0, offsetY: 20, blur: 48, spread: -12, opacity: 20, color: '#000000', inset: false, visible: true },
      { id: uid(), offsetX: 0, offsetY: 4, blur: 8, spread: -2, opacity: 15, color: '#000000', inset: false, visible: true },
    ],
    activeLayerIdx: 0,
    glass: {
      blur: 12,
      bgOpacity: 15,
      borderOpacity: 20,
      radius: 16,
      saturation: 180,
      tint: '#ffffff',
    },
  };

  // History stack
  let history = [];
  let historyIdx = -1;

  function uid() {
    return Math.random().toString(36).slice(2, 9);
  }

  function cloneState(s) {
    return JSON.parse(JSON.stringify(s));
  }

  function pushHistory() {
    // Truncate forward history
    history = history.slice(0, historyIdx + 1);
    history.push(cloneState(state));
    if (history.length > MAX_HISTORY) history.shift();
    historyIdx = history.length - 1;
    updateHistoryUI();
  }

  function undo() {
    if (historyIdx <= 0) return;
    historyIdx--;
    state = cloneState(history[historyIdx]);
    syncAllUI();
  }

  function redo() {
    if (historyIdx >= history.length - 1) return;
    historyIdx++;
    state = cloneState(history[historyIdx]);
    syncAllUI();
  }

  function updateHistoryUI() {
    const undoBtn = document.getElementById('btn-undo');
    const redoBtn = document.getElementById('btn-redo');
    const countEl = document.getElementById('history-count');
    if (!undoBtn || !redoBtn || !countEl) return;
    undoBtn.disabled = historyIdx <= 0;
    redoBtn.disabled = historyIdx >= history.length - 1;
    countEl.textContent = (historyIdx + 1) + ' / ' + history.length;
  }

  /* =============================================
   * 3. SHADOW ENGINE
   * ============================================= */
  function buildShadowCSS() {
    const layers = state.shadowLayers.filter(l => l.visible);
    if (!layers.length) return 'none';
    return layers.map(l => {
      const r = parseInt(l.color.slice(1, 3), 16);
      const g = parseInt(l.color.slice(3, 5), 16);
      const b = parseInt(l.color.slice(5, 7), 16);
      const a = Math.round(parseInt(l.opacity, 10) * 2.55) / 255;
      const alpha = parseFloat(a.toFixed(2));
      const inset = l.inset ? 'inset ' : '';
      return `${inset}${l.offsetX}px ${l.offsetY}px ${l.blur}px ${l.spread}px rgba(${r}, ${g}, ${b}, ${alpha})`;
    }).join(',\n       ');
  }

  function applyPreviewShadow() {
    const card = document.getElementById('preview-card');
    if (!card) return;
    card.style.boxShadow = buildShadowCSS();
    card.style.backdropFilter = '';
    card.style.webkitBackdropFilter = '';
    card.style.background = 'rgba(255,255,255,0.1)';
    card.style.border = '';
    card.style.borderRadius = '';
  }

  /* =============================================
   * 4. GLASS ENGINE
   * ============================================= */
  function buildGlassCSS() {
    const g = state.glass;
    const tintR = parseInt(g.tint.slice(1, 3), 16);
    const tintG = parseInt(g.tint.slice(3, 5), 16);
    const tintB = parseInt(g.tint.slice(5, 7), 16);
    const bgAlpha = parseFloat((g.bgOpacity / 100).toFixed(2));
    const borderAlpha = parseFloat((g.borderOpacity / 100).toFixed(2));
    return {
      backdropFilter: `blur(${g.blur}px) saturate(${g.saturation}%)`,
      background: `rgba(${tintR}, ${tintG}, ${tintB}, ${bgAlpha})`,
      border: `1px solid rgba(${tintR}, ${tintG}, ${tintB}, ${borderAlpha})`,
      borderRadius: `${g.radius}px`,
    };
  }

  function applyPreviewGlass() {
    const card = document.getElementById('preview-card');
    if (!card) return;
    const css = buildGlassCSS();
    card.style.backdropFilter = css.backdropFilter;
    card.style.webkitBackdropFilter = css.backdropFilter;
    card.style.background = css.background;
    card.style.border = css.border;
    card.style.borderRadius = css.borderRadius;
    card.style.boxShadow = 'none';
  }

  function applyPreview() {
    if (state.tool === 'shadow') applyPreviewShadow();
    else applyPreviewGlass();
  }

  /* =============================================
   * 5. CODE GENERATOR
   * ============================================= */
  function generateCode() {
    const fmt = state.codeFormat;
    const out = document.getElementById('code-output');
    if (!out) return;

    let code = '';
    if (state.tool === 'shadow') {
      code = generateShadowCode(fmt);
    } else {
      code = generateGlassCode(fmt);
    }

    // XSS-safe: use textContent
    out.textContent = code;
  }

  function generateShadowCode(fmt) {
    const shadow = buildShadowCSS();

    if (fmt === 'css') {
      return [
        '/* Generated with Glowfy — Box Shadow */',
        '.element {',
        '  box-shadow: ' + shadow + ';',
        '}',
      ].join('\n');
    }

    if (fmt === 'vars') {
      const layers = state.shadowLayers.filter(l => l.visible);
      const varLines = layers.map((l, i) => {
        const r = parseInt(l.color.slice(1, 3), 16);
        const g = parseInt(l.color.slice(3, 5), 16);
        const b = parseInt(l.color.slice(5, 7), 16);
        const a = parseFloat((l.opacity / 100).toFixed(2));
        return `  --shadow-${i + 1}: ${l.inset ? 'inset ' : ''}${l.offsetX}px ${l.offsetY}px ${l.blur}px ${l.spread}px rgba(${r}, ${g}, ${b}, ${a});`;
      }).join('\n');

      const usage = layers.map((_, i) => '    var(--shadow-' + (i + 1) + ')').join(',\n');

      return [
        '/* Generated with Glowfy — CSS Variables */',
        ':root {',
        varLines,
        '}',
        '',
        '.element {',
        '  box-shadow:',
        usage + ';',
        '}',
      ].join('\n');
    }

    if (fmt === 'tailwind') {
      const shadowVal = buildShadowCSS().replace(/\n\s+/g, ' ');
      return [
        '{/* Generated with Glowfy — Tailwind JIT arbitrary value */}',
        '<div className="[box-shadow:' + shadowVal + ']">',
        '  {/* tu contenido */}',
        '</div>',
        '',
        '{/* O en tailwind.config.js: */}',
        'theme: {',
        '  extend: {',
        "    boxShadow: {",
        "      'custom': '" + shadowVal + "',",
        '    },',
        '  },',
        '},',
      ].join('\n');
    }

    return '';
  }

  function generateGlassCode(fmt) {
    const g = state.glass;
    const css = buildGlassCSS();

    if (fmt === 'css') {
      return [
        '/* Generated with Glowfy — Glassmorphism Effect */',
        '.glass-card {',
        `  backdrop-filter: ${css.backdropFilter};`,
        `  -webkit-backdrop-filter: ${css.backdropFilter};`,
        `  background: ${css.background};`,
        `  border: ${css.border};`,
        `  border-radius: ${css.borderRadius};`,
        '}',
        '',
        '/* Nota: requiere un fondo visible detrás del elemento */',
      ].join('\n');
    }

    if (fmt === 'vars') {
      return [
        '/* Generated with Glowfy — CSS Variables */',
        ':root {',
        `  --glass-blur: ${g.blur}px;`,
        `  --glass-saturation: ${g.saturation}%;`,
        `  --glass-bg-opacity: ${parseFloat((g.bgOpacity / 100).toFixed(2))};`,
        `  --glass-border-opacity: ${parseFloat((g.borderOpacity / 100).toFixed(2))};`,
        `  --glass-radius: ${g.radius}px;`,
        `  --glass-tint: ${g.tint};`,
        '}',
        '',
        '.glass-card {',
        '  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));',
        '  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));',
        `  background: ${css.background};`,
        `  border: ${css.border};`,
        '  border-radius: var(--glass-radius);',
        '}',
      ].join('\n');
    }

    if (fmt === 'tailwind') {
      const bfVal = css.backdropFilter.replace(/ /g, '_');
      return [
        '{/* Generated with Glowfy — Tailwind JIT arbitrary values */}',
        `<div className="[backdrop-filter:${bfVal}] rounded-[${g.radius}px]`,
        `             bg-white/[.${String(g.bgOpacity).padStart(2, '0')}]`,
        `             border border-white/[.${String(g.borderOpacity).padStart(2, '0')}]">`,
        '  {/* contenido del card */}',
        '</div>',
      ].join('\n');
    }

    return '';
  }

  /* =============================================
   * 6. PRESETS
   * ============================================= */
  const SHADOW_PRESETS = [
    {
      label: 'Sombra Suave',
      key: 'preset.soft',
      layers: [
        { offsetX: 0, offsetY: 4, blur: 16, spread: -2, opacity: 20, color: '#000000', inset: false, visible: true },
        { offsetX: 0, offsetY: 8, blur: 32, spread: -8, opacity: 15, color: '#000000', inset: false, visible: true },
      ],
    },
    {
      label: 'Elevación Material',
      key: 'preset.material',
      layers: [
        { offsetX: 0, offsetY: 2, blur: 4, spread: 0, opacity: 25, color: '#000000', inset: false, visible: true },
        { offsetX: 0, offsetY: 12, blur: 24, spread: -4, opacity: 20, color: '#000000', inset: false, visible: true },
        { offsetX: 0, offsetY: 4, blur: 8, spread: -2, opacity: 10, color: '#000000', inset: false, visible: true },
      ],
    },
    {
      label: 'Sombra Neón',
      key: 'preset.neon',
      layers: [
        { offsetX: 0, offsetY: 0, blur: 20, spread: 0, opacity: 70, color: '#6366f1', inset: false, visible: true },
        { offsetX: 0, offsetY: 0, blur: 60, spread: -10, opacity: 40, color: '#818cf8', inset: false, visible: true },
      ],
    },
    {
      label: 'Flotante Pro',
      key: 'preset.floating',
      layers: [
        { offsetX: 0, offsetY: 1, blur: 3, spread: 0, opacity: 12, color: '#000000', inset: false, visible: true },
        { offsetX: 0, offsetY: 8, blur: 16, spread: -4, opacity: 18, color: '#000000', inset: false, visible: true },
        { offsetX: 0, offsetY: 24, blur: 40, spread: -8, opacity: 22, color: '#000000', inset: false, visible: true },
        { offsetX: 0, offsetY: 48, blur: 80, spread: -16, opacity: 12, color: '#000000', inset: false, visible: true },
      ],
    },
    {
      label: 'Apple Glass',
      key: 'preset.appleGlass',
      layers: [
        { offsetX: 0, offsetY: 0, blur: 1, spread: 1, opacity: 8, color: '#000000', inset: false, visible: true },
        { offsetX: 0, offsetY: 2, blur: 8, spread: -1, opacity: 10, color: '#000000', inset: false, visible: true },
        { offsetX: 0, offsetY: 16, blur: 32, spread: -4, opacity: 14, color: '#000000', inset: false, visible: true },
      ],
    },
    {
      label: 'Stripe UI',
      key: 'preset.stripeUI',
      layers: [
        { offsetX: 0, offsetY: 2, blur: 5, spread: -1, opacity: 14, color: '#32325d', inset: false, visible: true },
        { offsetX: 0, offsetY: 13, blur: 27, spread: -5, opacity: 22, color: '#32325d', inset: false, visible: true },
        { offsetX: 0, offsetY: 8, blur: 16, spread: -8, opacity: 28, color: '#000000', inset: false, visible: true },
      ],
    },
  ];

  const GLASS_PRESETS = [
    { label: 'Vidrio Esmerilado', key: 'preset.frostedGlass', blur: 12, bgOpacity: 15, borderOpacity: 20, radius: 16, saturation: 180, tint: '#ffffff' },
    { label: 'Cristal Oscuro', key: 'preset.darkGlass', blur: 20, bgOpacity: 8, borderOpacity: 12, radius: 20, saturation: 200, tint: '#000000' },
    { label: 'Aurora', key: 'preset.aurora', blur: 8, bgOpacity: 25, borderOpacity: 30, radius: 24, saturation: 150, tint: '#a78bfa' },
    { label: 'Nítido', key: 'preset.crisp', blur: 4, bgOpacity: 30, borderOpacity: 40, radius: 8, saturation: 120, tint: '#ffffff' },
  ];

  function renderPresets() {
    const grid = document.getElementById('presets-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const presets = state.tool === 'shadow' ? SHADOW_PRESETS : GLASS_PRESETS;
    presets.forEach((preset, i) => {
      const btn = document.createElement('button');
      btn.className = 'preset-btn';
      btn.setAttribute('data-preset-idx', String(i));
      const labelText = (preset.key && t(preset.key)) ? t(preset.key) : preset.label;
      btn.setAttribute('aria-label', (currentLang === 'es' ? 'Aplicar preset: ' : 'Apply preset: ') + labelText);
      const span = document.createElement('span');
      span.textContent = labelText;
      btn.appendChild(span);
      btn.addEventListener('click', () => applyPreset(preset));
      grid.appendChild(btn);
    });
  }

  function applyPreset(preset) {
    if (state.tool === 'shadow') {
      state.shadowLayers = preset.layers.map(l => ({ ...l, id: uid() }));
      state.activeLayerIdx = 0;
    } else {
      const g = state.glass;
      g.blur = parseInt(preset.blur, 10);
      g.bgOpacity = parseInt(preset.bgOpacity, 10);
      g.borderOpacity = parseInt(preset.borderOpacity, 10);
      g.radius = parseInt(preset.radius, 10);
      g.saturation = parseInt(preset.saturation, 10);
      g.tint = preset.tint;
    }
    pushHistory();
    syncAllUI();
    const labelText = (preset.key && t(preset.key)) ? t(preset.key) : preset.label;
    showToast((t('toast.preset') || 'Preset aplicado: ') + labelText, 'success');
  }

  /* =============================================
   * CURATED RANDOM SHADOWS (Apple, Stripe, Tailwind UI, Vercel)
   * ============================================= */
  const CURATED_RANDOM_SHADOWS = [
    {
      name: 'Apple Ambient',
      layers: [
        { offsetX: 0, offsetY: 1, blur: 2, spread: 0, opacity: 6, color: '#000000', inset: false, visible: true },
        { offsetX: 0, offsetY: 4, blur: 16, spread: -2, opacity: 12, color: '#000000', inset: false, visible: true },
        { offsetX: 0, offsetY: 16, blur: 40, spread: -6, opacity: 16, color: '#000000', inset: false, visible: true },
      ],
    },
    {
      name: 'Stripe Elevation',
      layers: [
        { offsetX: 0, offsetY: 2, blur: 4, spread: -1, opacity: 12, color: '#32325d', inset: false, visible: true },
        { offsetX: 0, offsetY: 12, blur: 24, spread: -4, opacity: 18, color: '#32325d', inset: false, visible: true },
        { offsetX: 0, offsetY: 24, blur: 48, spread: -12, opacity: 25, color: '#000000', inset: false, visible: true },
      ],
    },
    {
      name: 'Tailwind UI 2XL',
      layers: [
        { offsetX: 0, offsetY: 4, blur: 6, spread: -1, opacity: 10, color: '#000000', inset: false, visible: true },
        { offsetX: 0, offsetY: 10, blur: 15, spread: -3, opacity: 15, color: '#000000', inset: false, visible: true },
        { offsetX: 0, offsetY: 25, blur: 50, spread: -12, opacity: 25, color: '#000000', inset: false, visible: true },
      ],
    },
    {
      name: 'Vercel Contrast',
      layers: [
        { offsetX: 0, offsetY: 0, blur: 0, spread: 1, opacity: 12, color: '#000000', inset: false, visible: true },
        { offsetX: 0, offsetY: 4, blur: 12, spread: 0, opacity: 10, color: '#000000', inset: false, visible: true },
        { offsetX: 0, offsetY: 16, blur: 32, spread: 0, opacity: 16, color: '#000000', inset: false, visible: true },
      ],
    },
    {
      name: 'macOS Studio Lift',
      layers: [
        { offsetX: 0, offsetY: 0, blur: 1, spread: 1, opacity: 6, color: '#000000', inset: false, visible: true },
        { offsetX: 0, offsetY: 8, blur: 20, spread: -2, opacity: 14, color: '#000000', inset: false, visible: true },
        { offsetX: 0, offsetY: 30, blur: 60, spread: -10, opacity: 18, color: '#000000', inset: false, visible: true },
      ],
    },
    {
      name: 'Tailwind Indigo Glow',
      layers: [
        { offsetX: 0, offsetY: 4, blur: 12, spread: -2, opacity: 25, color: '#4338ca', inset: false, visible: true },
        { offsetX: 0, offsetY: 16, blur: 36, spread: -4, opacity: 35, color: '#6366f1', inset: false, visible: true },
      ],
    },
    {
      name: 'Stripe Deep Slate',
      layers: [
        { offsetX: 0, offsetY: 1, blur: 3, spread: 0, opacity: 15, color: '#0a2540', inset: false, visible: true },
        { offsetX: 0, offsetY: 8, blur: 16, spread: -2, opacity: 20, color: '#0a2540', inset: false, visible: true },
        { offsetX: 0, offsetY: 20, blur: 40, spread: -6, opacity: 22, color: '#000000', inset: false, visible: true },
      ],
    },
    {
      name: 'Vercel Card',
      layers: [
        { offsetX: 0, offsetY: 2, blur: 4, spread: 0, opacity: 8, color: '#000000', inset: false, visible: true },
        { offsetX: 0, offsetY: 8, blur: 24, spread: -4, opacity: 14, color: '#000000', inset: false, visible: true },
        { offsetX: 0, offsetY: 20, blur: 48, spread: -8, opacity: 18, color: '#000000', inset: false, visible: true },
      ],
    },
  ];

  let lastRandomIdx = -1;
  function randomizeShadow() {
    if (state.tool !== 'shadow') {
      state.tool = 'shadow';
    }
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * CURATED_RANDOM_SHADOWS.length);
    } while (CURATED_RANDOM_SHADOWS.length > 1 && nextIdx === lastRandomIdx);
    lastRandomIdx = nextIdx;

    const chosen = CURATED_RANDOM_SHADOWS[nextIdx];
    state.shadowLayers = chosen.layers.map(l => ({ ...l, id: uid() }));
    state.activeLayerIdx = 0;

    pushHistory();
    syncAllUI();
    showToast(t('toast.random') || 'Sombra aleatoria aplicada', 'info');
  }

  function bindRandomBtn() {
    const btn = document.getElementById('btn-random');
    if (btn) {
      btn.addEventListener('click', randomizeShadow);
    }
  }

  /* =============================================
   * 7. UI BINDINGS
   * ============================================= */

  // -- Layer list render --
  function renderLayers() {
    const container = document.getElementById('shadow-layers');
    if (!container) return;
    container.innerHTML = '';
    const prefix = t('layer_prefix') || (currentLang === 'es' ? 'Capa ' : 'Layer ');

    state.shadowLayers.forEach((layer, i) => {
      const item = document.createElement('div');
      item.className = 'layer-item' + (i === state.activeLayerIdx ? ' active' : '');
      item.setAttribute('role', 'listitem');
      item.setAttribute('aria-label', prefix + (i + 1));
      item.setAttribute('tabindex', '0');
      item.dataset.idx = String(i);

      // Color dot
      const dot = document.createElement('div');
      dot.className = 'layer-color-dot';
      dot.style.background = layer.color;
      if (!layer.visible) { dot.style.opacity = '0.3'; }

      // Label
      const label = document.createElement('span');
      label.className = 'layer-label';
      label.textContent = prefix + (i + 1) + (layer.inset ? ' · inset' : '');

      // Visibility toggle
      const visBtn = document.createElement('button');
      visBtn.className = 'layer-vis-btn';
      visBtn.setAttribute('aria-label', layer.visible ? 'Ocultar capa' : 'Mostrar capa');
      visBtn.setAttribute('title', layer.visible ? 'Ocultar' : 'Mostrar');
      visBtn.innerHTML = layer.visible
        ? '<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><ellipse cx="6.5" cy="6.5" rx="5.5" ry="5.5" stroke="currentColor" stroke-width="1.3"/><circle cx="6.5" cy="6.5" r="2" fill="currentColor"/></svg>'
        : '<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2L11 11M6.5 3C9 3 11 5 11 6.5C10.5 7.5 9.5 8.5 8.2 9.1M4.8 4.5C3.5 5.2 2 6 2 6.5C3 8.5 5 10 6.5 10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';
      visBtn.addEventListener('click', e => {
        e.stopPropagation();
        state.shadowLayers[i].visible = !state.shadowLayers[i].visible;
        pushHistory();
        renderLayers();
        applyPreview();
        generateCode();
      });

      // Delete button
      const delBtn = document.createElement('button');
      delBtn.className = 'layer-del-btn';
      delBtn.setAttribute('aria-label', 'Eliminar ' + prefix.toLowerCase() + (i + 1));
      delBtn.setAttribute('title', 'Eliminar');
      delBtn.textContent = '✕';
      delBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (state.shadowLayers.length <= 1) { showToast(t('toast.layerMin') || 'Debe haber al menos una capa', 'error'); return; }
        state.shadowLayers.splice(i, 1);
        if (state.activeLayerIdx >= state.shadowLayers.length) {
          state.activeLayerIdx = state.shadowLayers.length - 1;
        }
        pushHistory();
        renderLayers();
        syncLayerControls();
        applyPreview();
        generateCode();
      });

      item.appendChild(dot);
      item.appendChild(label);
      item.appendChild(visBtn);
      item.appendChild(delBtn);

      item.addEventListener('click', () => {
        state.activeLayerIdx = i;
        renderLayers();
        syncLayerControls();
      });

      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          state.activeLayerIdx = i;
          renderLayers();
          syncLayerControls();
        }
      });

      container.appendChild(item);
    });
  }

  function clamp(val, min, max) {
    if (isNaN(val)) return min;
    return Math.min(max, Math.max(min, val));
  }

  // -- Sync slider controls to active layer --
  function syncLayerControls() {
    const layer = state.shadowLayers[state.activeLayerIdx];
    if (!layer) return;

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
      const numInput = document.getElementById(id.replace('sl-', 'val-'));
      if (numInput) numInput.value = val;
    };

    setVal('sl-offset-x', layer.offsetX);
    setVal('sl-offset-y', layer.offsetY);
    setVal('sl-blur', layer.blur);
    setVal('sl-spread', layer.spread);
    setVal('sl-opacity', layer.opacity);

    const colorEl = document.getElementById('color-shadow');
    if (colorEl) colorEl.value = layer.color;

    const insetEl = document.getElementById('chk-inset');
    if (insetEl) insetEl.checked = !!layer.inset;

    updateSliderFill('sl-offset-x', -80, 80);
    updateSliderFill('sl-offset-y', -80, 80);
    updateSliderFill('sl-blur', 0, 100);
    updateSliderFill('sl-spread', -40, 40);
    updateSliderFill('sl-opacity', 0, 100);
  }

  // -- Sync glass controls --
  function syncGlassControls() {
    const g = state.glass;
    const setGlass = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
      const numInput = document.getElementById(id.replace('gl-', 'gval-'));
      if (numInput) numInput.value = val;
    };

    setGlass('gl-blur', g.blur);
    setGlass('gl-opacity', g.bgOpacity);
    setGlass('gl-border-opacity', g.borderOpacity);
    setGlass('gl-radius', g.radius);
    setGlass('gl-saturation', g.saturation);

    const tintEl = document.getElementById('color-glass-tint');
    if (tintEl) tintEl.value = g.tint;

    const glassSliders = [
      { id: 'gl-blur', min: 0, max: 40 },
      { id: 'gl-opacity', min: 0, max: 100 },
      { id: 'gl-border-opacity', min: 0, max: 100 },
      { id: 'gl-radius', min: 0, max: 40 },
      { id: 'gl-saturation', min: 100, max: 300 },
    ];
    glassSliders.forEach(({ id, min, max }) => {
      const el = document.getElementById(id);
      if (el) updateSliderFill(id, min, max);
    });
  }

  function updateSliders() {
    syncLayerControls();
    syncGlassControls();
  }

  // -- Visual slider fill gradient --
  function updateSliderFill(id, min, max) {
    const el = document.getElementById(id);
    if (!el) return;
    const pct = ((parseFloat(el.value) - min) / (max - min)) * 100;
    el.style.setProperty('--pct', pct + '%');
    el.style.background = `linear-gradient(to right, #6366F1 0%, #6366F1 ${pct}%, #334155 ${pct}%)`;
  }

  // -- Bind shadow sliders --
  function bindShadowSliders() {
    const sliders = [
      { id: 'sl-offset-x', dispId: 'val-offset-x', prop: 'offsetX', min: -80, max: 80 },
      { id: 'sl-offset-y', dispId: 'val-offset-y', prop: 'offsetY', min: -80, max: 80 },
      { id: 'sl-blur', dispId: 'val-blur', prop: 'blur', min: 0, max: 100 },
      { id: 'sl-spread', dispId: 'val-spread', prop: 'spread', min: -40, max: 40 },
      { id: 'sl-opacity', dispId: 'val-opacity', prop: 'opacity', min: 0, max: 100 },
    ];

    sliders.forEach(({ id, dispId, prop, min, max }) => {
      const rangeEl = document.getElementById(id);
      const numEl = document.getElementById(dispId);
      if (!rangeEl || !numEl) return;

      rangeEl.addEventListener('input', () => {
        const raw = parseFloat(rangeEl.value);
        const val = clamp(raw, min, max);
        const layer = state.shadowLayers[state.activeLayerIdx];
        if (!layer) return;
        layer[prop] = val;
        numEl.value = val;
        updateSliderFill(id, min, max);
        applyPreviewShadow();
        generateCode();
      });

      rangeEl.addEventListener('change', () => pushHistory());

      numEl.addEventListener('input', () => {
        const raw = parseFloat(numEl.value);
        if (!isNaN(raw)) {
          const val = clamp(raw, min, max);
          const layer = state.shadowLayers[state.activeLayerIdx];
          if (!layer) return;
          layer[prop] = val;
          rangeEl.value = val;
          updateSliderFill(id, min, max);
          applyPreviewShadow();
          generateCode();
        }
      });

      const commitNumChange = () => {
        const raw = parseFloat(numEl.value);
        const val = isNaN(raw) ? 0 : clamp(raw, min, max);
        numEl.value = val;
        rangeEl.value = val;
        const layer = state.shadowLayers[state.activeLayerIdx];
        if (!layer) return;
        layer[prop] = val;
        updateSliderFill(id, min, max);
        applyPreviewShadow();
        generateCode();
        pushHistory();
      };

      numEl.addEventListener('change', commitNumChange);
    });

    // Color picker
    const colorEl = document.getElementById('color-shadow');
    if (colorEl) {
      colorEl.addEventListener('input', () => {
        const layer = state.shadowLayers[state.activeLayerIdx];
        if (!layer) return;
        layer.color = colorEl.value;
        renderLayers();
        applyPreviewShadow();
        generateCode();
      });
      colorEl.addEventListener('change', () => pushHistory());
    }

    // Inset checkbox
    const insetEl = document.getElementById('chk-inset');
    if (insetEl) {
      insetEl.addEventListener('change', () => {
        const layer = state.shadowLayers[state.activeLayerIdx];
        if (!layer) return;
        layer.inset = insetEl.checked;
        pushHistory();
        renderLayers();
        applyPreviewShadow();
        generateCode();
      });
    }

    // Add layer button
    const addBtn = document.getElementById('btn-add-layer');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        if (state.shadowLayers.length >= MAX_LAYERS) {
          showToast((t('toast.layerMax') || 'capas permitidas'), 'error');
          return;
        }
        const newLayer = { id: uid(), offsetX: 0, offsetY: 8, blur: 24, spread: -4, opacity: 25, color: '#000000', inset: false, visible: true };
        state.shadowLayers.push(newLayer);
        state.activeLayerIdx = state.shadowLayers.length - 1;
        pushHistory();
        renderLayers();
        syncLayerControls();
        applyPreviewShadow();
        generateCode();
      });
    }
  }

  // -- Bind glass sliders --
  function bindGlassSliders() {
    const sliders = [
      { id: 'gl-blur', dispId: 'gval-blur', prop: 'blur', min: 0, max: 40 },
      { id: 'gl-opacity', dispId: 'gval-opacity', prop: 'bgOpacity', min: 0, max: 100 },
      { id: 'gl-border-opacity', dispId: 'gval-border-opacity', prop: 'borderOpacity', min: 0, max: 100 },
      { id: 'gl-radius', dispId: 'gval-radius', prop: 'radius', min: 0, max: 40 },
      { id: 'gl-saturation', dispId: 'gval-saturation', prop: 'saturation', min: 100, max: 300 },
    ];

    sliders.forEach(({ id, dispId, prop, min, max }) => {
      const rangeEl = document.getElementById(id);
      const numEl = document.getElementById(dispId);
      if (!rangeEl || !numEl) return;

      rangeEl.addEventListener('input', () => {
        const raw = parseFloat(rangeEl.value);
        const val = clamp(raw, min, max);
        state.glass[prop] = val;
        numEl.value = val;
        updateSliderFill(id, min, max);
        applyPreviewGlass();
        generateCode();
      });

      rangeEl.addEventListener('change', () => pushHistory());

      numEl.addEventListener('input', () => {
        const raw = parseFloat(numEl.value);
        if (!isNaN(raw)) {
          const val = clamp(raw, min, max);
          state.glass[prop] = val;
          rangeEl.value = val;
          updateSliderFill(id, min, max);
          applyPreviewGlass();
          generateCode();
        }
      });

      const commitNumChange = () => {
        const raw = parseFloat(numEl.value);
        const val = isNaN(raw) ? min : clamp(raw, min, max);
        numEl.value = val;
        rangeEl.value = val;
        state.glass[prop] = val;
        updateSliderFill(id, min, max);
        applyPreviewGlass();
        generateCode();
        pushHistory();
      };

      numEl.addEventListener('change', commitNumChange);
    });

    // Tint color
    const tintEl = document.getElementById('color-glass-tint');
    if (tintEl) {
      tintEl.addEventListener('input', () => {
        state.glass.tint = tintEl.value;
        applyPreviewGlass();
        generateCode();
      });
      tintEl.addEventListener('change', () => pushHistory());
    }
  }

  // -- Bind tool tabs --
  function bindTabs() {
    document.querySelectorAll('.nav-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.tool;
        if (tool === state.tool) return;
        state.tool = tool;

        document.querySelectorAll('.nav-tab').forEach(t => {
          t.classList.toggle('active', t.dataset.tool === tool);
          t.setAttribute('aria-selected', String(t.dataset.tool === tool));
        });

        const shadowCtrl = document.getElementById('shadow-controls');
        const glassCtrl = document.getElementById('glass-controls');
        if (shadowCtrl) shadowCtrl.classList.toggle('hidden', tool !== 'shadow');
        if (glassCtrl) glassCtrl.classList.toggle('hidden', tool !== 'glass');

        if (tool === 'shadow') {
          renderLayers();
          syncLayerControls();
        } else {
          syncGlassControls();
        }

        renderPresets();
        applyPreview();
        generateCode();
      });
    });
  }

  // -- Bind background toggle --
  function bindBgToggle() {
    const stage = document.getElementById('preview-stage');
    if (!stage) return;
    stage.className = 'preview-stage bg-dark';

    document.querySelectorAll('.bg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const bg = btn.dataset.bg;
        state.activeBg = bg;
        document.querySelectorAll('.bg-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.bg === bg);
          b.setAttribute('aria-pressed', String(b.dataset.bg === bg));
        });
        stage.className = 'preview-stage';
        void stage.offsetWidth;
        stage.className = 'preview-stage bg-' + bg;
      });
    });
  }

  // -- Bind code format tabs --
  function bindCodeTabs() {
    document.querySelectorAll('.code-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const fmt = tab.dataset.format;
        state.codeFormat = fmt;
        document.querySelectorAll('.code-tab').forEach(t => {
          t.classList.toggle('active', t.dataset.format === fmt);
          t.setAttribute('aria-selected', String(t.dataset.format === fmt));
        });
        generateCode();
      });
    });
  }

  // -- Copy code --
  function bindCopyBtn() {
    const btn = document.getElementById('btn-copy');
    const out = document.getElementById('code-output');
    const label = document.getElementById('copy-label');
    const iconEl = document.getElementById('copy-icon');
    if (!btn || !out) return;

    btn.addEventListener('click', () => copyCode(btn, label, iconEl, out));
  }

  function copyCode(btn, label, iconEl, out) {
    const text = out ? out.textContent : '';
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      btn.classList.add('copied');
      if (label) label.textContent = t('code.copied');
      if (iconEl) iconEl.innerHTML = '<path d="M2 7L5.5 10.5L12 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>';
      setTimeout(() => {
        btn.classList.remove('copied');
        if (label) label.textContent = t('code.copy');
        if (iconEl) iconEl.innerHTML = '<rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M2 9V2.5C2 1.948 2.448 1.5 3 1.5H9.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>';
      }, 2000);
      showToast(t('toast.copied'), 'success');
    }).catch(() => {
      showToast(t('toast.errCopy'), 'error');
    });
  }

  // -- Undo/Redo buttons --
  function bindHistoryBtns() {
    const undoBtn = document.getElementById('btn-undo');
    const redoBtn = document.getElementById('btn-redo');
    if (undoBtn) undoBtn.addEventListener('click', undo);
    if (redoBtn) redoBtn.addEventListener('click', redo);
  }

  /* =============================================
   * 8. FAVORITES (localStorage)
   * ============================================= */
  function loadFavorites() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_FAVS) || localStorage.getItem('cssforge_favorites_v1');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (e) {
      return [];
    }
  }

  function saveFavoritesToStorage(favs) {
    try {
      localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favs));
    } catch (e) {
      showToast('Error al guardar en localStorage', 'error');
    }
  }

  function renderFavorites() {
    const list = document.getElementById('favorites-list');
    if (!list) return;
    list.innerHTML = '';
    const favs = loadFavorites();

    if (!favs.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = t('ctrl.empty');
      list.appendChild(empty);
      return;
    }

    favs.forEach((fav, i) => {
      const item = document.createElement('div');
      item.className = 'favorite-item';
      item.setAttribute('role', 'listitem');

      const name = document.createElement('span');
      name.className = 'fav-name';
      name.textContent = fav.name || ((currentLang === 'es' ? 'Favorito ' : 'Favorite ') + (i + 1));

      const del = document.createElement('button');
      del.className = 'fav-del';
      del.setAttribute('aria-label', 'Eliminar favorito ' + (i + 1));
      del.textContent = '✕';
      del.addEventListener('click', e => {
        e.stopPropagation();
        const updated = loadFavorites();
        updated.splice(i, 1);
        saveFavoritesToStorage(updated);
        renderFavorites();
        showToast(t('toast.favDel'), 'success');
      });

      item.appendChild(name);
      item.appendChild(del);

      item.addEventListener('click', () => {
        applyFavorite(fav);
      });

      list.appendChild(item);
    });
  }

  function applyFavorite(fav) {
    try {
      if (fav.tool) state.tool = fav.tool;
      if (fav.layers && Array.isArray(fav.layers)) {
        state.shadowLayers = fav.layers.map(l => ({
          id: uid(),
          offsetX: parseInt(l.offsetX, 10) || 0,
          offsetY: parseInt(l.offsetY, 10) || 0,
          blur: parseInt(l.blur, 10) || 0,
          spread: parseInt(l.spread, 10) || 0,
          opacity: parseInt(l.opacity, 10) || 0,
          color: typeof l.color === 'string' ? l.color : '#000000',
          inset: !!l.inset,
          visible: l.visible !== false,
        }));
        state.activeLayerIdx = 0;
      }
      if (fav.glass) {
        state.glass = {
          blur: parseInt(fav.glass.blur, 10) || 12,
          bgOpacity: parseInt(fav.glass.bgOpacity, 10) || 15,
          borderOpacity: parseInt(fav.glass.borderOpacity, 10) || 20,
          radius: parseInt(fav.glass.radius, 10) || 16,
          saturation: parseInt(fav.glass.saturation, 10) || 180,
          tint: typeof fav.glass.tint === 'string' ? fav.glass.tint : '#ffffff',
        };
      }
      pushHistory();
      syncAllUI();
      showToast(t('toast.favLoaded'), 'success');
    } catch (e) {
      showToast('Error al cargar favorito', 'error');
    }
  }

  function bindSaveFav() {
    const btn = document.getElementById('btn-save-fav');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const favs = loadFavorites();
      if (favs.length >= MAX_FAVS) {
        showToast(MAX_FAVS + ' ' + t('toast.favMax'), 'error');
        return;
      }
      const ts = new Date().toLocaleTimeString(currentLang === 'es' ? 'es-MX' : 'en-US', { hour: '2-digit', minute: '2-digit' });
      const tool = state.tool;
      const name = (tool === 'shadow' ? (currentLang === 'es' ? 'Sombra' : 'Shadow') : (currentLang === 'es' ? 'Cristal' : 'Glass')) + ' · ' + ts;
      const fav = { name, tool, layers: state.shadowLayers, glass: state.glass };
      favs.push(fav);
      saveFavoritesToStorage(favs);
      renderFavorites();
      showToast(t('toast.favSaved'), 'success');
    });
  }

  /* =============================================
   * 9. SHARE BY URL
   * ============================================= */
  function buildShareURL() {
    const base = window.location.origin + window.location.pathname;
    const data = {
      t: state.tool,
      bg: state.activeBg,
      sl: state.shadowLayers.map(l => ({
        x: l.offsetX, y: l.offsetY, b: l.blur, s: l.spread,
        o: l.opacity, c: l.color.replace('#', ''), i: l.inset ? 1 : 0, v: l.visible ? 1 : 0,
      })),
      g: {
        b: state.glass.blur,
        bo: state.glass.bgOpacity,
        br: state.glass.borderOpacity,
        r: state.glass.radius,
        sa: state.glass.saturation,
        ti: state.glass.tint.replace('#', ''),
      },
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    return base + '?s=' + encoded;
  }

  function loadFromURL() {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get('s');
      if (!raw) return false;
      const decoded = JSON.parse(decodeURIComponent(atob(raw)));
      if (!decoded || typeof decoded !== 'object') return false;

      if (decoded.t === 'shadow' || decoded.t === 'glass') state.tool = decoded.t;

      if (Array.isArray(decoded.sl)) {
        state.shadowLayers = decoded.sl.map(l => ({
          id: uid(),
          offsetX: parseInt(l.x, 10) || 0,
          offsetY: parseInt(l.y, 10) || 0,
          blur: Math.max(0, parseInt(l.b, 10) || 0),
          spread: parseInt(l.s, 10) || 0,
          opacity: Math.min(100, Math.max(0, parseInt(l.o, 10) || 0)),
          color: '#' + (typeof l.c === 'string' ? l.c.replace(/[^0-9a-fA-F]/g, '').slice(0, 6) : '000000'),
          inset: l.i === 1,
          visible: l.v !== 0,
        }));
        if (!state.shadowLayers.length) state.shadowLayers = [{ id: uid(), offsetX: 0, offsetY: 8, blur: 24, spread: -4, opacity: 35, color: '#000000', inset: false, visible: true }];
      }

      if (decoded.g && typeof decoded.g === 'object') {
        state.glass = {
          blur: Math.max(0, Math.min(40, parseInt(decoded.g.b, 10) || 12)),
          bgOpacity: Math.max(0, Math.min(100, parseInt(decoded.g.bo, 10) || 15)),
          borderOpacity: Math.max(0, Math.min(100, parseInt(decoded.g.br, 10) || 20)),
          radius: Math.max(0, Math.min(40, parseInt(decoded.g.r, 10) || 16)),
          saturation: Math.max(100, Math.min(300, parseInt(decoded.g.sa, 10) || 180)),
          tint: '#' + (typeof decoded.g.ti === 'string' ? decoded.g.ti.replace(/[^0-9a-fA-F]/g, '').slice(0, 6) : 'ffffff'),
        };
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  function bindShare() {
    const btn = document.getElementById('btn-share');
    const feedback = document.getElementById('share-feedback');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const url = buildShareURL();
      navigator.clipboard.writeText(url).then(() => {
        if (feedback) {
          feedback.textContent = t('code.shareOk');
          setTimeout(() => { if (feedback) feedback.textContent = ''; }, 3000);
        }
        showToast(t('toast.shareOk'), 'success');
      }).catch(() => {
        if (feedback) {
          feedback.textContent = url.slice(0, 40) + '…';
        }
        showToast(t('toast.shareErr'), 'error');
      });
    });
  }

  /* =============================================
   * 10. CONTACT FORM
   * ============================================= */
  function bindContactModal() {
    const openBtns = [document.getElementById('btn-contact-modal'), document.getElementById('btn-footer-contact')];
    const overlay = document.getElementById('contact-modal');
    const closeBtn = document.getElementById('btn-close-modal');
    const form = document.getElementById('contact-form');
    const statusEl = document.getElementById('form-status');
    const submitBtn = document.getElementById('btn-submit-contact');
    const submitLabel = document.getElementById('submit-label');

    if (!overlay) return;

    const openModal = () => {
      overlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      if (statusEl) {
        statusEl.textContent = '';
        statusEl.className = 'form-status';
      }
    };

    const closeModal = () => {
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
    };

    openBtns.forEach(btn => { if (btn) btn.addEventListener('click', openModal); });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !overlay.classList.contains('hidden')) closeModal();
    });

    if (!form) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();

      const categoryEl = document.getElementById('contact-category');
      const emailEl = document.getElementById('contact-email');
      const msgEl = document.getElementById('contact-message');

      const catVal = categoryEl ? String(categoryEl.value).trim().slice(0, 50) : '';
      const emailVal = emailEl ? emailEl.value.trim().slice(0, 120) : '';
      const msgVal = msgEl ? msgEl.value.trim().slice(0, 1000) : '';

      if (!catVal) {
        setFormStatus(t('form.errCat'), 'error');
        if (categoryEl) categoryEl.focus();
        return;
      }
      if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setFormStatus(t('form.errEmail'), 'error');
        if (emailEl) emailEl.focus();
        return;
      }
      if (!msgVal) {
        setFormStatus(t('form.errMsg'), 'error');
        if (msgEl) msgEl.focus();
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (submitLabel) submitLabel.textContent = t('form.sending');
      setFormStatus('', '');

      try {
        const contactForm = form;
        const payload = {
          category: document.getElementById('contact-category')?.value || 'General',
          email: contactForm.querySelector('input[type="email"]')?.value || '',
          message: contactForm.querySelector('textarea')?.value || '',
          website: document.getElementById('contact-website')?.value || ''
        };

        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const successMsg = t('form.successMsg');
        setFormStatus(successMsg, 'success');
        showToast(successMsg, 'success');
        form.reset();
        setTimeout(() => {
          closeModal();
          setFormStatus('', '');
        }, 1500);

      } catch (err) {
        setFormStatus(t('form.errSend'), 'error');
        showToast(t('form.errSend'), 'error');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (submitLabel) submitLabel.textContent = t('form.submit');
      }
    });

    function setFormStatus(msg, type) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.className = msg ? ('form-status ' + type) : 'form-status';
    }
  }

  /* =============================================
   * LEGAL MODALS (Privacy Policy & Terms of Use)
   * ============================================= */
  function bindLegalModals() {
    const privacyModal = document.getElementById('privacy-modal');
    const termsModal = document.getElementById('terms-modal');
    const openPrivacy = document.getElementById('link-privacy');
    const openTerms = document.getElementById('link-terms');
    const closePrivacy = [document.getElementById('btn-close-privacy'), document.getElementById('btn-close-privacy-footer')];
    const closeTerms = [document.getElementById('btn-close-terms'), document.getElementById('btn-close-terms-footer')];

    const openModal = (modal) => {
      if (!modal) return;
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = (modal) => {
      if (!modal) return;
      modal.classList.add('hidden');
      const contactModal = document.getElementById('contact-modal');
      const isAnyModalOpen = (contactModal && !contactModal.classList.contains('hidden')) ||
        (privacyModal && !privacyModal.classList.contains('hidden')) ||
        (termsModal && !termsModal.classList.contains('hidden'));
      if (!isAnyModalOpen) {
        document.body.style.overflow = '';
      }
    };

    if (openPrivacy) {
      openPrivacy.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(privacyModal);
      });
    }

    if (openTerms) {
      openTerms.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(termsModal);
      });
    }

    closePrivacy.forEach(btn => {
      if (btn) btn.addEventListener('click', () => closeModal(privacyModal));
    });

    closeTerms.forEach(btn => {
      if (btn) btn.addEventListener('click', () => closeModal(termsModal));
    });

    [privacyModal, termsModal].forEach(modal => {
      if (!modal) return;
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (privacyModal && !privacyModal.classList.contains('hidden')) closeModal(privacyModal);
        if (termsModal && !termsModal.classList.contains('hidden')) closeModal(termsModal);
      }
    });
  }

  /* =============================================
   * 11. KEYBOARD SHORTCUTS
   * ============================================= */
  function bindKeyboard() {
    const out = document.getElementById('code-output');
    const btn = document.getElementById('btn-copy');
    const label = document.getElementById('copy-label');
    const iconEl = document.getElementById('copy-icon');

    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        redo();
        return;
      }

      const tag = document.activeElement ? document.activeElement.tagName : '';
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag);
      if (!isInput) {
        if (e.key === ' ' && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          copyCode(btn, label, iconEl, out);
          return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
          copyCode(btn, label, iconEl, out);
        }
      }
    });
  }

  /* =============================================
   * 12. SYNC ALL UI
   * ============================================= */
  function syncAllUI() {
    document.querySelectorAll('.nav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.tool === state.tool);
      t.setAttribute('aria-selected', String(t.dataset.tool === state.tool));
    });

    const shadowCtrl = document.getElementById('shadow-controls');
    const glassCtrl = document.getElementById('glass-controls');
    if (shadowCtrl) shadowCtrl.classList.toggle('hidden', state.tool !== 'shadow');
    if (glassCtrl) glassCtrl.classList.toggle('hidden', state.tool !== 'glass');

    if (state.tool === 'shadow') {
      renderLayers();
      syncLayerControls();
    } else {
      syncGlassControls();
    }

    renderPresets();
    applyPreview();
    generateCode();
    updateHistoryUI();
  }

  /* =============================================
   * TOAST NOTIFICATION
   * ============================================= */
  let toastTimer = null;

  function showToast(msg, type) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast show' + (type ? ' ' + type : '');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.classList.remove('show');
    }, 2800);
  }

  /* =============================================
   * FOOTER YEAR
   * ============================================= */
  function setFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* =============================================
   * INIT
   * ============================================= */
  function init() {
    const loadedFromURL = loadFromURL();

    pushHistory();

    bindTabs();
    bindBgToggle();
    bindRandomBtn();
    bindCodeTabs();
    bindShadowSliders();
    bindGlassSliders();
    bindCopyBtn();
    bindHistoryBtns();
    bindSaveFav();
    bindShare();
    bindContactModal();
    bindLegalModals();
    bindKeyboard();
    bindLang();

    updateSliders();
    syncAllUI();
    renderFavorites();
    setFooterYear();

    if (loadedFromURL) {
      showToast(t('toast.urlLoaded'), 'success');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();