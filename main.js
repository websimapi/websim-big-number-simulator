import { BigNumberSimulator } from './simulator.js';
import { PlainRenderer } from './renderers/plain.js';
import { BarRenderer } from './renderers/bar.js';
import { GraphRenderer } from './renderers/graph.js';

class SimulationController {
  constructor() {
    this.bindElements();
    this.setupEventListeners();
    this.renderers = {
      plain: new PlainRenderer(document.getElementById('plainOutput')),
      bars: new BarRenderer(document.getElementById('barOutput')),
      graph: new GraphRenderer(document.getElementById('graphCanvas'))
    };
  }

  bindElements() {
    this.mantissaInput = document.getElementById('mantissa');
    this.exponentInput = document.getElementById('exponent');
    this.stepsInput = document.getElementById('steps');
    this.stepSizeInput = document.getElementById('stepSize');
    this.simulateButton = document.getElementById('simulate');
    this.displayModeInputs = document.getElementsByName('displayMode');
  }

  setupEventListeners() {
    this.simulateButton.addEventListener('click', () => this.runSimulation());
    this.displayModeInputs.forEach(input => {
      input.addEventListener('change', (e) => this.switchDisplayMode(e.target.value));
    });
  }

  switchDisplayMode(mode) {
    document.querySelectorAll('.output-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    const targetPanel = document.getElementById(`${mode}Output`);
    targetPanel.classList.add('active');
  }

  runSimulation() {
    const mantissa = this.parseMantissa(this.mantissaInput.value);
    const exponent = parseInt(this.exponentInput.value);
    const steps = parseInt(this.stepsInput.value);
    const stepSize = BigInt(this.stepSizeInput.value);

    const simulator = new BigNumberSimulator(mantissa, exponent);
    const results = [];

    results.push({
      step: 0,
      value: simulator.toString(),
      simulator: simulator.clone()
    });

    for (let i = 0; i < steps; i++) {
      simulator.stepDown(stepSize);
      results.push({
        step: i + 1,
        value: simulator.toString(),
        simulator: simulator.clone()
      });
    }

    this.displayModeInputs.forEach(input => {
      if (input.checked) {
        this.renderers[input.value].render(results);
      }
    });
  }

  parseMantissa(value) {
    if (value.includes('e')) {
      const [base, exp] = value.split('e').map(Number);
      return BigInt(Math.floor(base * Math.pow(10, exp)));
    }
    return BigInt(value);
  }
}

new SimulationController();