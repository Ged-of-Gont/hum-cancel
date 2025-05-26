/*  inverter-processor.js
    Generates a continuous sine wave whose
    • frequency  (Hz)
    • phase      (radians)
    • gain       (0–1)
    are driven from UI parameters.
*/
class Inverter extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'targetFreq',  defaultValue: 60,  minValue: 20,  maxValue: 200 },
      { name: 'phaseOffset', defaultValue: Math.PI,    // radians
        minValue: 0, maxValue: 2 * Math.PI },
      { name: 'gain',        defaultValue: 0.7, minValue: 0,   maxValue: 1 }
    ];
  }

  constructor () {
    super();
    this._theta = 0;                   // running phase (radians)
  }

  process (inputs, outputs, params) {
    const out = outputs[0][0];
    const fs  = sampleRate;
    const f   = params.targetFreq;
    const φ   = params.phaseOffset;
    const g   = params.gain;

    for (let n = 0; n < out.length; ++n) {
      // Use most-recent value of each param (no automation curves needed here)
      const omega = 2 * Math.PI * (f.length > 1 ? f[n] : f[0]) / fs;
      const gain  = (g.length > 1 ? g[n] : g[0]);
      const phase = (φ.length > 1 ? φ[n] : φ[0]);

      out[n] = gain * Math.sin(this._theta + phase);
      this._theta += omega;
      if (this._theta > 2 * Math.PI) this._theta -= 2 * Math.PI;  // keep it bounded
    }
    return true;
  }
}

registerProcessor('inverter', Inverter);
