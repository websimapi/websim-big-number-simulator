export class PlainRenderer {
  constructor(container) {
    this.container = container;
  }

  render(results) {
    this.container.innerHTML = results.map(result => 
      `Step ${result.step}: ${result.value}`
    ).join('\n');
  }
}