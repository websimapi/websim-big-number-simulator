export class BigNumberSimulator {
  constructor(mantissa, exponent) {
    this.mantissa = BigInt(mantissa);
    this.exponent = exponent;
  }

  stepDown(stepMantissa = 1n) {
    this.mantissa -= stepMantissa;

    while (this.mantissa <= 0n) {
      const powerDiff = BigInt(this.exponent - 1);
      this.mantissa = BigInt(10) ** powerDiff;
      this.exponent -= 1;
    }
  }

  toString() {
    return `${this.mantissa}e${this.exponent}`;
  }

  clone() {
    return new BigNumberSimulator(this.mantissa, this.exponent);
  }

  toNumber() {
    // Approximate representation for visualization
    const logValue = Math.log10(Number(this.mantissa)) + this.exponent;
    return logValue;
  }
}