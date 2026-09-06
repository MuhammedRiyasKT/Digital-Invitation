'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const WEDDING_DATE = new Date('2026-11-22T11:00:00+05:30').getTime();

    // 🎉 CONFETTI FUNCTION
    function fireConfetti() {
        const duration = 2 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 70,
                origin: { x: 0 },
                colors: ['#D4AF37', '#C5A059', '#C98F96', '#E4BFC1', '#ffffff']
            });

            confetti({
                particleCount: 5,
                angle: 120,
                spread: 70,
                origin: { x: 1 },
                colors: ['#D4AF37', '#C5A059', '#C98F96', '#E4BFC1', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    }

    // 1. CLEAN PARALLAX
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        document.querySelectorAll('.decor-corner').forEach((el, i) => {
            const speed = (i % 2 === 0) ? 1 : -1;
            el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });

    // 2. ATMOSPHERE PARTICLES (Champagne Gold Sparkles + Translucent Dusty-Rose Bubbles)
    const canvas = document.getElementById('hero-dust');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let particles = [];

    function initParticles() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];

        // Reduce count on mobile screens to ensure lightweight rendering and keep text 100% readable
        const count = window.innerWidth < 768 ? 24 : 46;

        for (let i = 0; i < count; i++) {
            const isBubble = Math.random() > 0.55;
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: isBubble ? Math.random() * 2.8 + 1.8 : Math.random() * 1.2 + 0.5,
                d: Math.random() * 0.3 + 0.12,
                isBubble: isBubble,
                sway: Math.random() * Math.PI * 2,
                swaySpeed: Math.random() * 0.015 + 0.005
            });
        }
    }

    function drawParticles() {
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.sway += p.swaySpeed;
            const currentX = p.x + Math.sin(p.sway) * (p.isBubble ? 14 : 6);

            ctx.beginPath();
            if (p.isBubble) {
                // Soft translucent dusty-rose bubble
                ctx.fillStyle = 'rgba(201, 143, 150, 0.15)';
                ctx.arc(currentX, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Tiny champagne-gold sparkle
                ctx.fillStyle = 'rgba(197, 160, 89, 0.4)';
                ctx.arc(currentX, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }

            p.y -= p.d;
            if (p.y < -10) {
                p.y = canvas.height + 10;
                p.x = Math.random() * canvas.width;
            }
        });

        requestAnimationFrame(drawParticles);
    }

    // 3. COUNTDOWN TIMER
    function updateCountdown() {
        const now = Date.now();
        const diff = Math.max(0, WEDDING_DATE - now);

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        const elD = document.getElementById('cd-d');
        const elH = document.getElementById('cd-h');
        const elM = document.getElementById('cd-m');
        const elS = document.getElementById('cd-s');

        if (elD) elD.textContent = String(d).padStart(2, '0');
        if (elH) elH.textContent = String(h).padStart(2, '0');
        if (elM) elM.textContent = String(m).padStart(2, '0');
        if (elS) elS.textContent = String(s).padStart(2, '0');
    }

    // 4. SCROLL REVEAL
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-section').forEach(el => revealObserver.observe(el));

    // 5. TOAST NOTIFICATION UTILITY
    window.showToast = function(message) {
        const toast = document.getElementById('toast-notif');
        const toastMsg = document.getElementById('toast-msg');
        if (!toast) return;

        if (toastMsg) toastMsg.textContent = message;
        toast.classList.remove('hidden');

        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3200);
    };

    // 6. ADD TO CALENDAR (.ics & Google Calendar)
    window.addToCalendar = function() {
        const title = 'Shinas & Fathima Rinshi — Wedding';
        const details = 'Wedding Ceremony of Shinas & Fathima Rinshi';
        const location = 'White Lilies Convention Center, Kodumudi, Kerala';
        const startDate = '20261122T110000';
        const endDate = '20261122T150000';

        // Google Calendar URL
        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;

        // iCal .ics data URI fallback
        const icsData = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Shinas & Fathima Rinshi Wedding//EN',
            'BEGIN:VEVENT',
            `SUMMARY:${title}`,
            `DESCRIPTION:${details}`,
            `LOCATION:${location}`,
            `DTSTART:${startDate}`,
            `DTEND:${endDate}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\n');

        // Trigger Google Calendar in new tab
        window.open(googleUrl, '_blank');

        // Also download .ics for iOS/Outlook/Apple Calendar
        try {
            const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', 'wedding-event.ics');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error('ICS download fallback error:', e);
        }

        showToast('Wedding added to calendar!');
    };

    // 7. FLOATING MUSIC TOGGLE
    window.toggleMusic = function(e) {
        if (e) e.stopPropagation();
        const audio = document.getElementById('bg-music');
        const musicBtn = document.getElementById('music-toggle-btn');
        if (!audio) return;

        if (audio.paused) {
            audio.volume = 0;
            audio.play().then(() => {
                let vol = 0;
                const fadeIn = setInterval(() => {
                    vol += 0.08;
                    if (vol >= 1) {
                        vol = 1;
                        clearInterval(fadeIn);
                    }
                    audio.volume = vol;
                }, 100);
                if (musicBtn) musicBtn.classList.add('playing');
                showToast('Playing background music');
            }).catch(() => {
                showToast('Tap to play music');
            });
        } else {
            let vol = audio.volume;
            const fadeOut = setInterval(() => {
                vol -= 0.08;
                if (vol <= 0) {
                    audio.pause();
                    audio.volume = 1;
                    clearInterval(fadeOut);
                    if (musicBtn) musicBtn.classList.remove('playing');
                    showToast('Music paused');
                } else {
                    audio.volume = vol;
                }
            }, 100);
        }
    };

    // 8. SHARE INVITATION (Web Share API + Clipboard Fallback)
    window.shareInvitation = function() {
        const shareData = {
            title: 'Shinas & Fathima Rinshi — Wedding Invitation',
            text: 'You are warmly invited to celebrate the wedding of Shinas & Fathima Rinshi.',
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData).catch(() => {
                copyLinkFallback();
            });
        } else {
            copyLinkFallback();
        }

        function copyLinkFallback() {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showToast('Invitation link copied.');
                }).catch(() => {
                    showToast('Link: ' + window.location.href);
                });
            } else {
                showToast('Link: ' + window.location.href);
            }
        }
    };

    // 9. RSVP + MODAL LOGIC
    window.handleRSVP = function(choice) {
        const modal = document.getElementById('rsvp-modal');
        const bodyYes = document.getElementById('modal-body-yes');
        const bodyNo = document.getElementById('modal-body-no');
        const audio = document.getElementById('bg-music');
        const musicBtn = document.getElementById('music-toggle-btn');

        if (bodyYes) bodyYes.classList.add('hidden');
        if (bodyNo) bodyNo.classList.add('hidden');

        if (choice === 'yes') {
            if (bodyYes) bodyYes.classList.remove('hidden');

            // 🎉 CONFETTI ON YES CLICK
            fireConfetti();

            // 🎵 MUSIC
            if (audio) {
                audio.volume = 0;
                audio.play().then(() => {
                    let vol = 0;
                    const fadeIn = setInterval(() => {
                        vol += 0.05;
                        if (vol >= 1) {
                            vol = 1;
                            clearInterval(fadeIn);
                        }
                        audio.volume = vol;
                    }, 100);
                    if (musicBtn) musicBtn.classList.add('playing');
                }).catch(() => {});
            }

        } else {
            if (bodyNo) bodyNo.classList.remove('hidden');
        }

        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('active');
        }
    };

    // CLOSE MODAL + STOP MUSIC
    window.closeModal = function() {
        const modal = document.getElementById('rsvp-modal');
        const audio = document.getElementById('bg-music');
        const musicBtn = document.getElementById('music-toggle-btn');

        if (modal) modal.classList.remove('active');

        if (audio && !audio.paused) {
            let vol = audio.volume;
            const fadeOut = setInterval(() => {
                vol -= 0.05;
                if (vol <= 0) {
                    audio.pause();
                    audio.currentTime = 0;
                    audio.volume = 1;
                    clearInterval(fadeOut);
                    if (musicBtn) musicBtn.classList.remove('playing');
                } else {
                    audio.volume = vol;
                }
            }, 100);
        }

        setTimeout(() => {
            if (modal) modal.classList.add('hidden');
        }, 400);
    };

    // Outside click close
    window.addEventListener("click", function(event) {
        const modal = document.getElementById('rsvp-modal');
        if (event.target === modal) {
            closeModal();
        }
    });

    // ESC close
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            closeModal();
        }
    });

    // INIT
    initParticles();
    drawParticles();
    setInterval(updateCountdown, 1000);
    updateCountdown();
    window.addEventListener('resize', initParticles);

    // 🚪 DOORS OPENING ANIMATION
    const doorContainer = document.getElementById('door-container');
    let doorsOpened = false;

    window.openDoors = function() {
        if (doorsOpened) return;
        doorsOpened = true;
        
        if (doorContainer) {
            doorContainer.classList.add('open');
            setTimeout(() => {
                doorContainer.style.display = 'none';
            }, 1800); // match CSS transition duration
        }
        
        // 🎉 CONFETTI WHEN DOORS OPEN
        setTimeout(() => {
            fireConfetti();
        }, 700);
    };

    if (doorContainer) {
        // Open on click/tap
        doorContainer.addEventListener('click', window.openDoors);
        
        // Auto open after 50 seconds
        setTimeout(() => {
            window.openDoors();
        }, 50000);
    }
});