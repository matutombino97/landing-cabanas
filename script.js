// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('span');
            if (navLinks.classList.contains('active')) {
                icon.textContent = 'close';
            } else {
                icon.textContent = 'menu';
            }
        });
    }

    // Set minimum date for check-in and check-out to today
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];

    dateInputs.forEach(input => {
        input.setAttribute('min', today);
    });

    // Auto-adjust check-out date based on check-in
    const checkinInput = document.getElementById('entrada');
    const checkoutInput = document.getElementById('salida');

    if (checkinInput && checkoutInput) {
        checkinInput.addEventListener('change', () => {
            const minCheckout = new Date(checkinInput.value);
            minCheckout.setDate(minCheckout.getDate() + 1);
            checkoutInput.setAttribute('min', minCheckout.toISOString().split('T')[0]);

            if (checkoutInput.value && new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
                checkoutInput.value = minCheckout.toISOString().split('T')[0];
            }
        });
    }

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));

    // Funcionalidad de reserva real vía WhatsApp
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const entrada = document.getElementById('entrada').value;
            const salida = document.getElementById('salida').value;
            const huespedes = document.getElementById('huespedes').value;

            // Validar que se hayan ingresado fechas
            if (!entrada || !salida) {
                alert("Por favor, selecciona las fechas de entrada y salida.");
                return;
            }

            // Cambiar "5491100000000" por el número real del propietario/recepción (incluir código de país, sin + ni espacios)
            const numeroWhatsApp = "5492611234567"; // Teléfono ficticio basado en el footer

            // Date formatting
            const fechaEntrada = new Date(entrada).toLocaleDateString('es-ES');
            const fechaSalida = new Date(salida).toLocaleDateString('es-ES');

            // Mensaje pre-armado
            const mensaje = `¡Hola! 👋 Me gustaría consultar la disponibilidad de sus cabañas.\n\n📅 *Check-in:* ${fechaEntrada}\n🗓️ *Check-out:* ${fechaSalida}\n👥 *Huéspedes:* ${huespedes}\n\n¿Tienen disponibilidad y cuáles son las tarifas?\n¡Muchas gracias!`;

            const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

            // Redirigir a WhatsApp
            window.open(urlWhatsApp, '_blank');
        });
    }
});
