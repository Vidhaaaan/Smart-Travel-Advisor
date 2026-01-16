const canvas = document.getElementById('saffronCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', resize);
resize();

class Petal {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 5 + 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.02;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.angle) * 0.5;
        this.angle += this.spin;

        if (this.y > height) {
            this.y = -20;
            this.x = Math.random() * width;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#FF9933';
        
        // Draw a simple petal shape
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.size, -this.size, this.size, this.size, 0, this.size * 2);
        ctx.bezierCurveTo(-this.size, this.size, -this.size, -this.size, 0, 0);
        ctx.fill();
        ctx.restore();
    }
}

function init() {
    for (let i = 0; i < 60; i++) {
        particles.push(new Petal());
    }
    animate();
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw background wash
    let gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
    gradient.addColorStop(0, 'rgba(255, 245, 235, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

const launchBtn = document.getElementById('launchBtn');
if (launchBtn) {
    launchBtn.addEventListener('click', () => {
        // Smooth transition out
        const wrapper = document.querySelector('.main-wrapper');
        wrapper.style.transition = 'all 0.8s ease-in-out';
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 800);
    });
}

init();