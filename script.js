import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyATcGy_62RtFXZlfzjieinkXf3-mTeTleU",
  authDomain: "cabanas-b212f.firebaseapp.com",
  projectId: "cabanas-b212f",
  storageBucket: "cabanas-b212f.firebasestorage.app",
  messagingSenderId: "397554221254",
  appId: "1:397554221254:web:2e6ad1fa37e638cf6897c7",
  measurementId: "G-NYTYM4ZNSS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper to get dates between checkin and checkout (robust String handling)
function getDatesInRange(startDateStr, endDateStr) {
    const dates = [];
    let current = new Date(startDateStr + 'T12:00:00'); // Force noon to avoid TZ shift
    const end = new Date(endDateStr + 'T12:00:00');
    
    while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    return dates;
}


// Start main logic immediately (modules are deferred by default)

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
    // Date inputs (Flatpickr)
    // ================================
    const checkinInput = document.getElementById('entrada');
    const checkoutInput = document.getElementById('salida');

    // Fetch and block dates from Firebase
    const checkoutPicker = flatpickr(checkoutInput, {
        locale: "es",
        minDate: "today",
        dateFormat: "Y-m-d",
    });

    const checkinPicker = flatpickr(checkinInput, {
        locale: "es",
        minDate: "today",
        dateFormat: "Y-m-d",
        onChange: function(selectedDates, dateStr, instance) {
            if (selectedDates.length > 0) {
                const minCheckoutDate = new Date(selectedDates[0]);
                minCheckoutDate.setDate(minCheckoutDate.getDate() + 1);
                checkoutPicker.set('minDate', minCheckoutDate);
                
                if (checkoutPicker.selectedDates.length > 0 && checkoutPicker.selectedDates[0] <= selectedDates[0]) {
                    checkoutPicker.clear();
                }
                checkoutPicker.open();
            }
        }
    });

    async function syncBlockedDates() {
        try {
            const querySnapshot = await getDocs(collection(db, "reservations"));
            const allBlocked = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.checkin && data.checkout) {
                    const range = getDatesInRange(data.checkin, data.checkout);
                    allBlocked.push(...range);
                }
            });
            checkinPicker.set('disable', allBlocked);
            checkoutPicker.set('disable', allBlocked);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    }

    syncBlockedDates();

    // ================================
    // GSAP Animations (Snappy & Elegant)
    // ================================
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animations (Snappier 0.8s - 1s)
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
    
    // Ensure visibility by forcing opacity to 1 as it enters
    heroTl.fromTo(".hero-subtitle", { y: -30, opacity: 0 }, { y: 0, opacity: 1, delay: 0.3 })
          .fromTo(".hero-content h1", { y: 80, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1 }, "-=0.7")
          .fromTo(".hero-desc", { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.7")
          .fromTo(".hero-btns", { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, "-=0.7")
          .fromTo(".scroll-indicator", { opacity: 0 }, { opacity: 1 }, "-=0.5");

    // Section Headers Animation
    gsap.utils.toArray('section').forEach(section => {
        const header = section.querySelector('.text-center');
        if (header) {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: "top 90%",
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        }
    });

    // Bento Grid Animation
    gsap.utils.toArray('.bento-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.05,
            ease: "circ.out"
        });
    });

    // Gallery Items Animation
    gsap.utils.toArray('.gallery-item').forEach(item => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
            },
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: "back.out(1.7)"
        });
    });

    // Generic Scroll Animations
    gsap.utils.toArray('.fade-in-up:not(.bento-item):not(.gallery-item)').forEach(item => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: "top 90%" },
            y: 50, opacity: 0, duration: 1, ease: "power3.out"
        });
    });

    gsap.utils.toArray('.slide-in-left').forEach(item => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: "top 90%" },
            x: -50, opacity: 0, duration: 1, ease: "power3.out"
        });
    });

    gsap.utils.toArray('.slide-in-right').forEach(item => {
        gsap.from(item, {
            scrollTrigger: { trigger: item, start: "top 90%" },
            x: 50, opacity: 0, duration: 1, ease: "power3.out"
        });
    });

    // ================================
    // Booking Form → Firebase & WhatsApp
    // ================================
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const entrada = document.getElementById('entrada').value;
            const salida = document.getElementById('salida').value;
            const huespedes = document.getElementById('huespedes').value;

            if (!entrada || !salida) {
                alert("Por favor, selecciona las fechas de entrada y salida.");
                return;
            }

            try {
                // Save to Firebase as "pendiente"
                await addDoc(collection(db, "reservations"), {
                    checkin: entrada,
                    checkout: salida,
                    huespedes: huespedes,
                    status: "pendiente",
                    createdAt: new Date().toISOString()
                });

                const numeroWhatsApp = "5492613433108";
                const fechaEntrada = new Date(entrada).toLocaleDateString('es-ES');
                const fechaSalida = new Date(salida).toLocaleDateString('es-ES');

                const mensaje = `¡Hola! 👋 Me gustaría consultar la disponibilidad de sus cabañas.\n\n📅 *Check-in:* ${fechaEntrada}\n🗓️ *Check-out:* ${fechaSalida}\n👥 *Huéspedes:* ${huespedes}\n\n¿Tienen disponibilidad y cuáles son las tarifas?\n¡Muchas gracias!`;

                window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`, '_blank');
            } catch (error) {
                console.error("Error saving reservation:", error);
                alert("Hubo un problema al procesar la reserva. Por favor, intenta de nuevo.");
            }
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

