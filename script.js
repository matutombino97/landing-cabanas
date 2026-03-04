// script.js
document.addEventListener('DOMContentLoaded', () => {

    // ================================
    // Navbar scroll effect
    // ================================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ================================
    // Mobile Menu Toggle
    // ================================
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('span');
            icon.textContent = navLinks.classList.contains('active') ? 'close' : 'menu';
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBtn.querySelector('span').textContent = 'menu';
            });
        });
    }

    // ================================
    // Date inputs — min dates
    // ================================
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => input.setAttribute('min', today));

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

    // ================================
    // Scroll Animations (Intersection Observer)
    // ================================
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right')
        .forEach(el => observer.observe(el));

    // ================================
    // Booking Form → WhatsApp
    // ================================
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const entrada = document.getElementById('entrada').value;
            const salida = document.getElementById('salida').value;
            const huespedes = document.getElementById('huespedes').value;

            if (!entrada || !salida) {
                alert("Por favor, selecciona las fechas de entrada y salida.");
                return;
            }

            const numeroWhatsApp = "5492613433108";
            const fechaEntrada = new Date(entrada).toLocaleDateString('es-ES');
            const fechaSalida = new Date(salida).toLocaleDateString('es-ES');

            const mensaje = `¡Hola! 👋 Me gustaría consultar la disponibilidad de sus cabañas.\n\n📅 *Check-in:* ${fechaEntrada}\n🗓️ *Check-out:* ${fechaSalida}\n👥 *Huéspedes:* ${huespedes}\n\n¿Tienen disponibilidad y cuáles son las tarifas?\n¡Muchas gracias!`;

            window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`, '_blank');
        });
    }

    // ================================
    // Testimonial Slider
    // ================================
    const sliderContainer = document.getElementById('testimonial-slider');
    if (sliderContainer) {
        const testimonials = sliderContainer.querySelectorAll('.testimonial');
        const dotsContainer = document.getElementById('slider-dots');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        let currentSlide = 0;
        let autoSlideInterval;

        // Create dots
        testimonials.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.slider-dot');

        function goToSlide(index) {
            testimonials[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = (index + testimonials.length) % testimonials.length;
            testimonials[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoSlide(); });
        nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoSlide(); });

        startAutoSlide();
    }

    // ================================
    // FAQ Accordion
    // ================================
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item.active').forEach(activeItem => {
                activeItem.classList.remove('active');
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ================================
    // WhatsApp Float — show after scroll
    // ================================
    const whatsappBtn = document.getElementById('whatsapp-btn');
    if (whatsappBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                whatsappBtn.classList.add('visible');
            } else {
                whatsappBtn.classList.remove('visible');
            }
        });
    }

    // ================================
    // Back to Top Button
    // ================================
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ================================
    // Newsletter Form
    // ================================
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (email) {
                alert(`¡Gracias por suscribirte! 🎉\nTe enviaremos nuestras ofertas a: ${email}`);
                emailInput.value = '';
            }
        });
    }

    // ================================
    // Lightbox (for detail pages)
    // ================================
    const galleryImages = document.querySelectorAll('.photo-gallery img');
    if (galleryImages.length > 0) {
        // Create lightbox overlay
        const overlay = document.createElement('div');
        overlay.classList.add('lightbox-overlay');
        overlay.innerHTML = `
            <button class="lightbox-close" aria-label="Cerrar">
                <span class="material-symbols-outlined">close</span>
            </button>
            <img src="" alt="Vista ampliada">
        `;
        document.body.appendChild(overlay);

        const lightboxImg = overlay.querySelector('img');
        const closeBtn = overlay.querySelector('.lightbox-close');

        galleryImages.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeLightbox() {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        closeBtn.addEventListener('click', closeLightbox);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }
});
