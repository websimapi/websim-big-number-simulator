export class BarRenderer {
  constructor(container) {
    this.container = container.querySelector('.bar-container');
  }

  render(results) {
    this.container.innerHTML = '';
    const maxHeight = Math.max(...results.map(r => r.simulator.toNumber()));
    const minHeight = Math.min(...results.map(r => r.simulator.toNumber()));
    const range = maxHeight - minHeight;

    results.forEach((result, index) => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      const height = ((result.simulator.toNumber() - minHeight) / range) * 100;
      bar.style.height = `${height}%`;
      bar.title = `Step ${result.step}: ${result.value}`;
      this.container.appendChild(bar);
    });
  }
}