export class ParticleRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animation = null;
    this.setupCanvas();
  }

  setupCanvas() {
    const scale = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * scale;
    this.canvas.height = rect.height * scale;
    this.ctx.scale(scale, scale);
  }

  render(results) {
    if (this.animation) {
      cancelAnimationFrame(this.animation);
    }

    this.particles = results.map((result, index) => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      radius: 2 + Math.random() * 3,
      color: this.getColor(result.simulator.toNumber(), results),
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      value: result.value
    }));

    this.animate();
  }

  getColor(value, results) {
    const min = Math.min(...results.map(r => r.simulator.toNumber()));
    const max = Math.max(...results.map(r => r.simulator.toNumber()));
    const normalized = (value - min) / (max - min);
    
    const hue = normalized * 120; // Green to red gradient
    return `hsl(${hue}, 70%, 50%)`;
  }

  animate() {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off walls
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();
    });

    this.animation = requestAnimationFrame(() => this.animate());
  }
}