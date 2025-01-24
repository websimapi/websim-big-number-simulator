export class AIGenerator {
  constructor() {
    this.lastGenerated = null;
  }

  async generateNextNumber() {
    try {
      const response = await fetch('/api/ai_completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generate a larger number than the previous one for a simulation.
          The number should be in scientific notation format (mantissa e exponent).
          Make it significantly larger but not absurdly so.
          
          <typescript-interface>
          interface Response {
            mantissa: string;
            exponent: number;
            explanation: string;
          }
          </typescript-interface>
          
          <example>
          {
            "mantissa": "2.5e15",
            "exponent": 320,
            "explanation": "Generated a number approximately 1000 times larger than the previous one by increasing the exponent by 3."
          }
          </example>`,
          data: this.lastGenerated
        })
      });

      const data = await response.json();
      this.lastGenerated = data;
      return data;
    } catch (error) {
      console.error('Error generating AI number:', error);
      return {
        mantissa: "1e15",
        exponent: 308,
        explanation: "Fallback to default values due to error"
      };
    }
  }
}