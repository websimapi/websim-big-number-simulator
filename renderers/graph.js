export class GraphRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.chart = null;
  }

  render(results) {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.canvas.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: results.map(r => `Step ${r.step}`),
        datasets: [{
          label: 'Number Value (log scale)',
          data: results.map(r => r.simulator.toNumber()),
          borderColor: '#4CAF50',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            type: 'linear',
            display: true
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const result = results[context.dataIndex];
                return result.value;
              }
            }
          }
        }
      }
    });
  }
}