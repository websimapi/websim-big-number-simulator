import { BigNumberSimulator } from './simulator.js';
import { PlainRenderer } from './renderers/plain.js';
import { BarRenderer } from './renderers/bar.js';
import { GraphRenderer } from './renderers/graph.js';
import { ParticleRenderer } from './renderers/particle.js';
import { AIGenerator } from './ai-generator.js';

class SimulationController {
  constructor() {
    this.bindElements();
    this.setupEventListeners();
    this.history = [];
    this.aiGenerator = new AIGenerator();
    
    this.renderers = {
      plain: new PlainRenderer(document.getElementById('plainOutput')),
      bars: new BarRenderer(document.getElementById('barOutput')),
      graph: new GraphRenderer(document.getElementById('graphCanvas')),
      particle: new ParticleRenderer(document.getElementById('particleCanvas'))
    };

    const initialMode = document.querySelector('input[name="displayMode"]:checked').value;
    this.switchDisplayMode(initialMode);
  }

  bindElements() {
    this.mantissaInput = document.getElementById('mantissa');
    this.exponentInput = document.getElementById('exponent');
    this.stepsInput = document.getElementById('steps');
    this.stepSizeInput = document.getElementById('stepSize');
    this.animationSpeedInput = document.getElementById('animationSpeed');
    this.simulateButton = document.getElementById('simulate');
    this.aiButton = document.getElementById('aiGenerate');
    this.toggleHistoryButton = document.getElementById('toggleHistory');
    this.displayModeInputs = document.getElementsByName('displayMode');
    this.outputPanels = document.querySelectorAll('.output-panel');
    this.historyPanel = document.getElementById('historyPanel');
    this.historyContent = document.getElementById('historyContent');
    this.aiPanel = document.getElementById('aiPanel');
    this.aiContent = document.getElementById('aiContent');
  }

  setupEventListeners() {
    this.simulateButton.addEventListener('click', () => this.runSimulation());
    this.aiButton.addEventListener('click', () => this.runAISimulation());
    this.toggleHistoryButton.addEventListener('click', () => this.toggleHistory());
    this.displayModeInputs.forEach(input => {
      input.addEventListener('change', (e) => this.switchDisplayMode(e.target.value));
    });
  }

  async runAISimulation() {
    try {
      const aiNumber = await this.aiGenerator.generateNextNumber();
      
      this.mantissaInput.value = aiNumber.mantissa;
      this.exponentInput.value = aiNumber.exponent;
      
      this.aiPanel.classList.add('active');
      this.aiContent.innerHTML = `
        <div class="ai-insight">
          <p><strong>AI Generated Number:</strong> ${aiNumber.mantissa}e${aiNumber.exponent}</p>
          <p><em>${aiNumber.explanation}</em></p>
        </div>
      `;
      
      this.runSimulation();
    } catch (error) {
      console.error('AI simulation error:', error);
      alert('Error running AI simulation');
    }
  }

  toggleHistory() {
    this.historyPanel.classList.toggle('active');
    if (this.historyPanel.classList.contains('active')) {
      this.renderHistory();
    }
  }

  renderHistory() {
    this.historyContent.innerHTML = this.history
      .map((entry, index) => `
        <div class="history-entry">
          <strong>Simulation ${index + 1}</strong>
          <p>Start: ${entry.startValue}</p>
          <p>End: ${entry.endValue}</p>
          <p>Steps: ${entry.steps}</p>
        </div>
      `)
      .join('');
  }

  switchDisplayMode(mode) {
    if (!mode) return;
    
    this.outputPanels.forEach(panel => {
      panel.classList.remove('active');
    });

    const targetPanel = document.querySelector(`.output-panel[data-mode="${mode}"]`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
  }

  async runSimulation() {
    try {
      const mantissa = this.parseMantissa(this.mantissaInput.value);
      const exponent = parseInt(this.exponentInput.value);
      const steps = parseInt(this.stepsInput.value);
      const stepSize = BigInt(this.stepSizeInput.value);
      const animationSpeed = parseInt(this.animationSpeedInput.value);

      const simulator = new BigNumberSimulator(mantissa, exponent);
      const results = [];
      const startValue = simulator.toString();

      results.push({
        step: 0,
        value: simulator.toString(),
        simulator: simulator.clone()
      });

      for (let i = 0; i < steps; i++) {
        await new Promise(resolve => setTimeout(resolve, animationSpeed));
        simulator.stepDown(stepSize);
        results.push({
          step: i + 1,
          value: simulator.toString(),
          simulator: simulator.clone()
        });
      }

      const selectedMode = document.querySelector('input[name="displayMode"]:checked');
      if (selectedMode && this.renderers[selectedMode.value]) {
        this.renderers[selectedMode.value].render(results);
      }

      this.history.unshift({
        startValue,
        endValue: simulator.toString(),
        steps,
        timestamp: new Date()
      });

      if (this.historyPanel.classList.contains('active')) {
        this.renderHistory();
      }

    } catch (error) {
      console.error('Simulation error:', error);
      alert('Error running simulation. Please check your inputs.');
    }
  }

  parseMantissa(value) {
    if (!value) throw new Error('Mantissa value is required');
    if (value.includes('e')) {
      const [base, exp] = value.split('e').map(Number);
      return BigInt(Math.floor(base * Math.pow(10, exp)));
    }
    return BigInt(value);
  }
}

new SimulationController();