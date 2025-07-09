document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Magical Background Particles ---
    function createParticles() {
        const particleContainer = document.getElementById('background-particles');
        if (!particleContainer) return;
        
        const particleCount = 20; // How many particles on screen at once
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Randomize position, size, and animation delay
            particle.style.left = `${Math.random() * 100}%`;
            const size = Math.random() * 10 + 5; // Size between 5px and 15px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.animationDelay = `${Math.random() * 20}s`; // Stagger start times

            particleContainer.appendChild(particle);
        }
    }

    // --- 2. Typewriter Effect ---
    function setupTypewriter(element) {
        const text = element.getAttribute('data-text');
        element.innerHTML = ''; // Clear the text
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 50); // Speed of typing
            } else {
                // When done typing, remove the blinking cursor for a clean look
                element.style.borderRight = 'none';
            }
        }
        type();
    }
    
    // --- 3. Scroll-Reveal and Page Logic ---
    function initializePage() {
        const mainContent = document.querySelector('main');
        if (mainContent) mainContent.classList.add('about-page-main');

        const creatorTextElement = document.getElementById('creator-text');
        
        // Store the original text in a data attribute before clearing it
        if (creatorTextElement) {
            creatorTextElement.setAttribute('data-text', creatorTextElement.textContent);
            creatorTextElement.textContent = '';
        }

        const revealElements = document.querySelectorAll('.scroll-reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // If the creator text box becomes visible, start the typewriter
                    if (entry.target.contains(creatorTextElement)) {
                        setupTypewriter(creatorTextElement);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(element => {
            observer.observe(element);
        });
    }

    // --- Run everything ---
    createParticles();
    initializePage();
});