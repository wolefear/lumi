// Page Manager Class
class PageManager {
    constructor() {
        this.currentPage = 'question-page';
        this.pages = {
            question: document.getElementById('question-page'),
            reconsider1: document.getElementById('reconsider-1'),
            reconsider2: document.getElementById('reconsider-2'),
            reconsider3: document.getElementById('reconsider-3'),
            finalPlea: document.getElementById('final-plea'),
            success: document.getElementById('success-page')
        };
        this.initializeButtons();
    }

    initializeButtons() {
        // YES buttons - all lead to success
        for (let i = 1; i <= 5; i++) {
            const btn = document.getElementById(`yes-btn${i > 1 ? '-' + i : ''}`);
            if (btn) {
                btn.onclick = () => this.showSuccess();
            }
        }

        // NO buttons - progressive persuasion
        const noFlow = [
            { id: 'no-btn', next: 'reconsider1' },
            { id: 'no-btn-2', next: 'reconsider2' },
            { id: 'no-btn-3', next: 'reconsider3' },
            { id: 'no-btn-4', next: 'finalPlea' },
            { id: 'no-btn-5', next: 'success' } // Final "no" still goes to success
        ];

        noFlow.forEach(item => {
            const btn = document.getElementById(item.id);
            if (btn) {
                btn.onclick = () => this.navigateTo(this.pages[item.next]);
            }
        });
    }

    navigateTo(targetPage) {
        Object.values(this.pages).forEach(page => {
            if (page) page.classList.remove('active');
        });
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }

    showSuccess() {
        this.navigateTo(this.pages.success);
        celebrationEffects.trigger();
    }
}

// Celebration Effects Manager
class CelebrationEffects {
    trigger() {
        this.heartExplosion();
        this.whiteConfetti();
    }

    heartExplosion() {
        const container = document.getElementById('heart-explosion');
        if (!container) return;

        container.innerHTML = '';
        const heartSymbols = ['♡', '♥', '❤'];
        const totalHearts = 40;

        for (let i = 0; i < totalHearts; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
                heart.style.cssText = `
                    position: absolute;
                    font-size: ${20 + Math.random() * 40}px;
                    color: white;
                    opacity: 0;
                    pointer-events: none;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                `;

                const angle = (i / totalHearts) * Math.PI * 2;
                const distance = 150 + Math.random() * 200;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                const rotation = Math.random() * 720 - 360;

                const animation = heart.animate([
                    {
                        transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
                        opacity: 0
                    },
                    {
                        transform: `translate(calc(-50% + ${tx * 0.5}px), calc(-50% + ${ty * 0.5}px)) scale(1.2) rotate(${rotation * 0.5}deg)`,
                        opacity: 1,
                        offset: 0.4
                    },
                    {
                        transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0.8) rotate(${rotation}deg)`,
                        opacity: 0
                    }
                ], {
                    duration: 2500,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                });

                container.appendChild(heart);

                animation.onfinish = () => heart.remove();
            }, i * 50);
        }
    }

    whiteConfetti() {
        const confettiEl = document.createElement('canvas');
        confettiEl.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        confettiEl.width = window.innerWidth;
        confettiEl.height = window.innerHeight;
        document.body.appendChild(confettiEl);

        const ctx = confettiEl.getContext('2d');
        const particles = [];

        // Create confetti particles
        for (let i = 0; i < 200; i++) {
            particles.push({
                x: Math.random() * confettiEl.width,
                y: -20 - Math.random() * confettiEl.height,
                vx: (Math.random() - 0.5) * 3,
                vy: Math.random() * 3 + 2,
                size: Math.random() * 6 + 2,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2,
                opacity: Math.random() * 0.5 + 0.5
            });
        }

        let animationFrame;
        const animate = () => {
            ctx.clearRect(0, 0, confettiEl.width, confettiEl.height);

            particles.forEach(p => {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = 'white';
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 2);
                ctx.restore();

                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;
                p.vy += 0.1; // Gravity

                if (p.y > confettiEl.height + 50) {
                    p.y = -20;
                    p.x = Math.random() * confettiEl.width;
                }
            });

            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        // Clean up after 6 seconds
        setTimeout(() => {
            cancelAnimationFrame(animationFrame);
            confettiEl.remove();
        }, 6000);
    }
}

// Floating Hearts Background
class FloatingHearts {
    constructor() {
        this.canvas = document.getElementById('hearts-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.hearts = [];
        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        const heartCount = Math.floor(this.canvas.width / 50);
        for (let i = 0; i < heartCount; i++) {
            this.hearts.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 15 + 8,
                speed: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.2 + 0.05,
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.03 + 0.01,
                direction: Math.random() > 0.5 ? 1 : -1
            });
        }
    }

    drawHeart(x, y, size) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.bezierCurveTo(x, y - size / 4, x - size / 2, y - size / 2, x - size / 2, y - size / 4);
        this.ctx.arc(x - size / 4, y - size / 4, size / 4, Math.PI, 0, false);
        this.ctx.arc(x + size / 4, y - size / 4, size / 4, Math.PI, 0, false);
        this.ctx.bezierCurveTo(x + size / 2, y - size / 2, x, y - size / 4, x, y);
        this.ctx.fill();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.hearts.forEach(heart => {
            this.ctx.globalAlpha = heart.opacity;
            this.ctx.fillStyle = 'white';

            const wobbleX = Math.sin(heart.wobble) * 30;
            this.drawHeart(heart.x + wobbleX, heart.y, heart.size);

            heart.y -= heart.speed;
            heart.wobble += heart.wobbleSpeed;

            if (heart.y < -heart.size) {
                heart.y = this.canvas.height + heart.size;
                heart.x = Math.random() * this.canvas.width;
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize everything
const pageManager = new PageManager();
const celebrationEffects = new CelebrationEffects();
const floatingHearts = new FloatingHearts();