---
layout: page
permalink: /tools_tmm/
title: Multilayer Optical Thin Film Simulation
description: Calculates transmission and reflection coefficients for multilayer structures using the Transfer Matrix Method. This app displays results across different wavelengths and incident angles. Copyright © 2025, Luocheng Huang.
nav: false
---

<details>
<summary>Basic Usage Guide</summary>
<div style="padding: 10px;">
<p>To simulate a multilayer structure:</p>

<p>Set the wavelength range and number of spectral points.</p>

<p>Add layers between the semi-infinite media (air):<br>
   *Click "Add Layer" to add intermediate layers;<br>
   *For each layer, set refractive index (n), extinction coefficient (k) and thickness in nm.</p>

<p>View the results:<br>
   *Six plots show the optical response for both TE and TM polarizations;<br>
   *Use the angle slider to change the incident angle;<br>
   *Heatmaps show wavelength-angle dependence;</p>

<p>Key terms:<br>
   *TE: Electric field perpendicular to plane of incidence;<br>
   *TM: Magnetic field perpendicular to plane of incidence;<br>
   *R: Fraction of light reflected;<br>
   *T: Fraction of light transmitted;</p>
</div>
</details>

<details>
<summary>How to use paired layers feature</summary>
<div style="padding: 10px;">
<p>To create periodic structures (e.g., DBR):</p>

<p>Add the layers you want to repeat<br>
Check "Add to pair" for these layers<br>
Enable "Enable Pairs"<br>
Set the number of repetitions</p>
</div>
</details>

<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="https://cdn.plot.ly/plotly-2.24.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.7.0/math.min.js"></script>
<script type="module" src="/assets/js/tmm/TMMCalculator.js"></script>

<style>
.tmm-app {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem;
}

.wavelength-controls {
    background: white;
    padding: 0.5rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.wavelength-inputs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min-content, max-content));
    grid-auto-flow: column;
    gap: 0.5rem;
    align-items: start;
    justify-content: start;
    overflow-x: auto;
    padding: 0.25rem 0;
}

.layers-controls {
    background: white;
    padding: 0.5rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.layer {
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #eee;
    border-radius: 4px;
}

.layer-inputs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min-content, max-content));
    grid-auto-flow: column;
    gap: 0.5rem;
    align-items: start;
    justify-content: start;
    overflow-x: auto;
    padding: 0.25rem 0;
}

.input-group {
    display: grid;
    grid-template-columns: auto auto;
    gap: 0.1rem;
    min-width: min-content;
    white-space: nowrap;
    padding: 0;
    margin: 0;
    justify-content: start;
}

.input-group label {
    min-width: min-content;
    font-weight: bold;
    font-size: 12px;
    text-align: left;
    padding: 0;
    margin: 0;
}

input[type="number"] {
    width: 45px;
    padding: 0.15rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 12px;
    text-align: center;
    margin: 0;
}

button {
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #4CAF50;
    color: white;
    font-weight: bold;
    font-size: 12px;
}

.remove-button {
    background-color: #f44336;
}

.add-button {
    margin-top: 0.5rem;
    background-color: #2196F3;
}

.calculate-button {
    align-self: flex-start;
    font-size: 1em;
    padding: 0.5rem 1rem;
}

.plot {
    background: white;
    padding: 0.5rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.normal-plot, .angle-plot, .transmittance-plot {
    margin-top: 0.5rem;
}

.plot-container {
    width: 100%;
    background: white;
    padding: 0.5rem;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 1rem;
}

.plot-container > div {
    width: 100%;
    height: 400px;
}

h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #333;
    font-size: 14px;
}

.checkbox-group {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.checkbox-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
}

.semi-infinite {
    color: #666;
    font-size: 1.2em;
    margin-left: 0.25rem;
}

input[type="number"]:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
}

button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.pair-controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min-content, max-content));
    grid-auto-flow: column;
    gap: 0.5rem;
    align-items: start;
    justify-content: start;
    overflow-x: auto;
    padding: 0.25rem 0;
}

.angle-control {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    margin: 0;
    padding: 0;
    background: #f8f8f8;
    border-radius: 4px;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    width: auto;
    position: relative;
    z-index: 1;
    margin-bottom: 0.25rem;
    flex-shrink: 0;
}

.angle-control input[type="range"] {
    flex: 1;
    max-width: 120px;
    margin: 0;
    padding: 0;
    height: 4px;
    -webkit-appearance: none;
    background: #ddd;
    border-radius: 2px;
    outline: none;
}

.angle-control input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background: #4CAF50;
    border-radius: 50%;
    cursor: pointer;
}

.angle-control input[type="range"]::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: #4CAF50;
    border-radius: 50%;
    cursor: pointer;
    border: none;
}

.angle-control span {
    min-width: 25px;
    text-align: right;
    padding: 0;
    line-height: 18px;
}

.angle-control label {
    font-weight: bold;
    font-size: 12px;
    margin: 0;
    padding: 0;
    line-height: 18px;
}
</style>

<div class="container">
    <div id="app"></div>
</div>

<script type="module">
    import { calculateRT, generateWavelengthArray } from '/assets/js/tmm/TMMCalculator.js';
    import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

    const TMMApp = {
        template: `
            <div class="tmm-app">
                <div class="wavelength-controls">
                    <h3>Wavelength Range</h3>
                    <div class="wavelength-inputs">
                        <div class="input-group">
                            <label>Start (nm):</label>
                            <input type="number" v-model.number="wavelengthRange.start" min="200" max="2000" step="1">
                        </div>
                        <div class="input-group">
                            <label>End (nm):</label>
                            <input type="number" v-model.number="wavelengthRange.end" min="200" max="2000" step="1">
                        </div>
                        <div class="input-group">
                            <label>Points:</label>
                            <input type="number" v-model.number="wavelengthRange.points" min="10" max="1000" step="1">
                        </div>
                    </div>
                </div>

                <div class="layers-controls">
                    <h3>Layers</h3>
                    <div v-for="(layer, index) in layers" :key="index" class="layer">
                        <div class="layer-inputs">
                            <div class="input-group">
                                <label>n:</label>
                                <input type="number" v-model.number="layer.n" min="1" step="0.01">
                            </div>
                            <div class="input-group">
                                <label>k:</label>
                                <input type="number" v-model.number="layer.k" min="0" step="0.01">
                            </div>
                            <template v-if="index !== 0 && index !== layers.length - 1">
                                <div class="input-group">
                                    <label>Thickness (nm):</label>
                                    <input type="number" v-model.number="layer.d" min="1" step="1">
                                </div>
                                <div class="input-group">
                                    <label>Add to pair:</label>
                                    <input type="checkbox" v-model="layer.addToPair">
                                </div>
                                <button @click="removeLayer(index)" class="remove-btn">Remove</button>
                            </template>
                            <template v-else>
                                <div class="input-group">
                                    <label>Thickness:</label>
                                    <span class="semi-infinite">∞</span>
                                </div>
                            </template>
                        </div>
                    </div>
                    <button @click="addLayer" class="add-btn">Add Layer</button>
                    <div class="pair-controls">
                        <div class="input-group">
                            <label>Enable Pairs:</label>
                            <input type="checkbox" v-model="enablePairs">
                        </div>
                        <div class="input-group">
                            <label>Number of pairs:</label>
                            <input type="number" v-model.number="numberOfPairs" min="2" step="1">
                        </div>
                    </div>
                </div>

                <button @click="calculate" class="calculate-btn">Calculate</button>

                <div class="plots">
                    <div class="angle-control">
                        <label>Angle:</label>
                        <input type="range" v-model.number="spectralAngle" min="0" max="90" step="1" @input="onAngleChange">
                        <input type="number" v-model.number="spectralAngle" min="0" max="90" step="1" @input="onAngleChange">
                        <span>°</span>
                    </div>
                    <div class="plot-container">
                        <h3>Spectral Response (TE)</h3>
                        <div ref="normalPlotTE"></div>
                    </div>
                    <div class="plot-container">
                        <h3>Spectral Response (TM)</h3>
                        <div ref="normalPlotTM"></div>
                    </div>
                    <div class="plot-container">
                        <h3>Spectral Angular Transmittance (TE)</h3>
                        <div ref="transmittancePlotTE"></div>
                    </div>
                    <div class="plot-container">
                        <h3>Spectral Angular Transmittance (TM)</h3>
                        <div ref="transmittancePlotTM"></div>
                    </div>
                    <div class="plot-container">
                        <h3>Spectral Angular Reflectance (TE)</h3>
                        <div ref="reflectancePlotTE"></div>
                    </div>
                    <div class="plot-container">
                        <h3>Spectral Angular Reflectance (TM)</h3>
                        <div ref="reflectancePlotTM"></div>
                    </div>
                </div>
            </div>
        `,
        data() {
            return {
                wavelengthRange: {
                    start: 460,
                    end: 700,
                    points: 200
                },
                layers: [
                    { n: 1.0, k: 0, d: 0 },  // Air
                    { n: 3.5, k: 0, d: 300 }, // Example layer
                    { n: 1.0, k: 0, d: 0 }   // Air
                ],
                normalPlotTE: null,
                normalPlotTM: null,
                transmittancePlotTE: null,
                transmittancePlotTM: null,
                reflectancePlotTE: null,
                reflectancePlotTM: null,
                numberOfPairs: 2,
                enablePairs: false,
                spectralAngle: 0,
                transmittanceDataTE: [],
                reflectanceDataTE: [],
                transmittanceDataTM: [],
                reflectanceDataTM: []
            };
        },
        created() {
            // Remove debounce initialization
        },
        mounted() {
            // Trigger initial calculation when component is mounted
            this.calculate();
        },
        methods: {
            addLayer() {
                this.layers.splice(-1, 0, { n: 1.5, k: 0, d: 100, addToPair: false });
            },
            removeLayer(index) {
                if (this.layers.length > 2) {
                    this.layers.splice(index, 1);
                }
            },
            calculate() {
                if (this.enablePairs) {
                    const pairLayers = this.layers.filter(layer => layer.addToPair);
                    if (pairLayers.length < 2) {
                        alert('Error: Paired layers must be at least 2.');
                        return;
                    }
                    // Check if paired layers are contiguous
                    const indices = this.layers.map((layer, index) => layer.addToPair ? index : -1).filter(index => index !== -1);
                    console.log('Paired Layer Indices:', indices);
                    const areContiguous = indices.every((value, index) => index === 0 || value === indices[index - 1] + 1);
                    if (!areContiguous) {
                        alert('Error: Paired layers must be contiguous.');
                        return;
                    }
                    const repeatedPairs = Array(this.numberOfPairs).fill(pairLayers).flat();
                    const calculationLayers = [this.layers[0], ...repeatedPairs, this.layers[this.layers.length - 1]];
                    this.performCalculation(calculationLayers);
                } else {
                    this.performCalculation(this.layers);
                }
            },
            performCalculation(layers) {
                const wavelengths = generateWavelengthArray(
                    this.wavelengthRange.start,
                    this.wavelengthRange.end,
                    this.wavelengthRange.points
                );

                const angles = Array.from({length: 91}, (_, i) => i);
                
                // Calculate data for all wavelengths and angles
                this.transmittanceDataTE = [];
                this.reflectanceDataTE = [];
                this.transmittanceDataTM = [];
                this.reflectanceDataTM = [];
                
                for (let angle of angles) {
                    const transmittanceRowTE = [];
                    const reflectanceRowTE = [];
                    const transmittanceRowTM = [];
                    const reflectanceRowTM = [];
                    for (let wavelength of wavelengths) {
                        const { R, T } = calculateRT(layers, wavelength, angle, { TE: true, TM: false });
                        transmittanceRowTE.push(T);
                        reflectanceRowTE.push(R);
                        const { R: RTM, T: TTM } = calculateRT(layers, wavelength, angle, { TE: false, TM: true });
                        transmittanceRowTM.push(TTM);
                        reflectanceRowTM.push(RTM);
                    }
                    this.transmittanceDataTE.push(transmittanceRowTE);
                    this.reflectanceDataTE.push(reflectanceRowTE);
                    this.transmittanceDataTM.push(transmittanceRowTM);
                    this.reflectanceDataTM.push(reflectanceRowTM);
                }

                // Update all plots
                this.updateNormalPlots();
                this.updateTransmittancePlot(wavelengths, angles, this.transmittanceDataTE, 'TE');
                this.updateTransmittancePlot(wavelengths, angles, this.transmittanceDataTM, 'TM');
                this.updateReflectancePlot(wavelengths, angles, this.reflectanceDataTE, 'TE');
                this.updateReflectancePlot(wavelengths, angles, this.reflectanceDataTM, 'TM');
            },
            updateNormalPlot(data, polarization) {
                const trace1 = {
                    x: data.map(d => d.wavelength),
                    y: data.map(d => d.R),
                    name: 'Reflectance',
                    type: 'scatter',
                    line: { color: 'rgb(255, 99, 132)' }
                };

                const trace2 = {
                    x: data.map(d => d.wavelength),
                    y: data.map(d => d.T),
                    name: 'Transmittance',
                    type: 'scatter',
                    line: { color: 'rgb(54, 162, 235)' }
                };

                const layout = {
                    title: `Spectral Response at ${this.spectralAngle}° (${polarization})`,
                    xaxis: {
                        title: 'Wavelength (nm)'
                    },
                    yaxis: {
                        title: 'Reflectance/Transmittance',
                        range: [0, 1]
                    },
                    showlegend: true,
                    legend: {
                        x: 0.02,
                        y: 0.98,
                        bgcolor: 'rgba(255, 255, 255, 0.8)'
                    }
                };

                const config = {
                    staticPlot: true,
                    displayModeBar: false
                };

                Plotly.newPlot(this.$refs[`normalPlot${polarization.toUpperCase()}`], [trace1, trace2], layout, config);
            },
            updateTransmittancePlot(wavelengths, angles, data, polarization) {
                const trace = {
                    z: data,
                    x: wavelengths,
                    y: angles,
                    type: 'heatmap',
                    colorscale: 'Viridis',
                    colorbar: {
                        title: 'Transmittance'
                    }
                };

                const layout = {
                    title: `Spectral Angular Transmittance (${polarization})`,
                    xaxis: {
                        title: 'Wavelength (nm)'
                    },
                    yaxis: {
                        title: 'Angle (degrees)'
                    }
                };

                const config = {
                    staticPlot: true,
                    displayModeBar: false
                };

                Plotly.newPlot(this.$refs[`transmittancePlot${polarization.toUpperCase()}`], [trace], layout, config);
            },
            updateReflectancePlot(wavelengths, angles, data, polarization) {
                const trace = {
                    z: data,
                    x: wavelengths,
                    y: angles,
                    type: 'heatmap',
                    colorscale: 'Viridis',
                    colorbar: {
                        title: 'Reflectance'
                    }
                };

                const layout = {
                    title: `Spectral Angular Reflectance (${polarization})`,
                    xaxis: {
                        title: 'Wavelength (nm)'
                    },
                    yaxis: {
                        title: 'Angle (degrees)'
                    }
                };

                const config = {
                    staticPlot: true,
                    displayModeBar: false
                };

                Plotly.newPlot(this.$refs[`reflectancePlot${polarization.toUpperCase()}`], [trace], layout, config);
            },
            onAngleChange() {
                // Ensure the angle stays within bounds
                if (this.spectralAngle < 0) this.spectralAngle = 0;
                if (this.spectralAngle > 90) this.spectralAngle = 90;
                // Update plots immediately
                this.updateNormalPlots();
            },
            updateNormalPlots() {
                const wavelengths = generateWavelengthArray(
                    this.wavelengthRange.start,
                    this.wavelengthRange.end,
                    this.wavelengthRange.points
                );

                // Get the index of the selected angle
                const angleIndex = this.spectralAngle;

                // Slice the existing 2D data at the selected angle
                const normalDataTE = wavelengths.map((wavelength, i) => ({
                    wavelength,
                    R: this.reflectanceDataTE[angleIndex][i],
                    T: this.transmittanceDataTE[angleIndex][i]
                }));

                const normalDataTM = wavelengths.map((wavelength, i) => ({
                    wavelength,
                    R: this.reflectanceDataTM[angleIndex][i],
                    T: this.transmittanceDataTM[angleIndex][i]
                }));

                this.updateNormalPlot(normalDataTE, 'TE');
                this.updateNormalPlot(normalDataTM, 'TM');
            }
        }
    };

    createApp(TMMApp).mount('#app');
</script>

## Technical Details

Here, we use the Transfer Matrix Method (TMM) to analyze the propagation of electromagnetic waves through the multilayer structures. The following describes the implementation details.

**Wave Propagation in Each Layer**
   - In each layer, the electric field can be expressed as a superposition of forward and backward propagating waves:
     $$
     E(z) = A e^{ikz} + B e^{-ikz}
     $$
   - Where $$k = \frac{2\pi n}{\lambda}$$ is the wave vector, $$n$$ is the complex refractive index, and $$\lambda$$ is the wavelength.

**Boundary Conditions**
   - At each interface between layers, the tangential components of the electric and magnetic fields must be continuous.
   - For TE polarization (s-polarization), the electric field is perpendicular to the plane of incidence.
   - For TM polarization (p-polarization), the magnetic field is perpendicular to the plane of incidence.

**Transfer Matrix Formalism**
   - The relationship between the fields in adjacent layers can be described by a transfer matrix:
     $$
     \begin{pmatrix}
     A_{j+1} \\
     B_{j+1}
     \end{pmatrix}
     = M_j
     \begin{pmatrix}
     A_j \\
     B_j
     \end{pmatrix}
     $$
   - Where $$M_j$$ is the transfer matrix for the j-th layer, which accounts for both propagation through the layer and reflection/transmission at interfaces.

**Matrix Components**
   - For a layer with thickness $$d$$ and refractive index $$n$$, the transfer matrix is:
     $$
     M_j = 
     \begin{pmatrix}
     e^{ik_jd_j} & 0 \\
     0 & e^{-ik_jd_j}
     \end{pmatrix}
     \begin{pmatrix}
     1 & r_j \\
     r_j & 1
     \end{pmatrix}
     $$
   - Where $$r_j$$ is the Fresnel reflection coefficient at the interface.

**Fresnel Coefficients**
   - For TE polarization:
     $$
     r_{TE} = \frac{n_1\cos\theta_1 - n_2\cos\theta_2}{n_1\cos\theta_1 + n_2\cos\theta_2}
     $$
   - For TM polarization:
     $$
     r_{TM} = \frac{n_2\cos\theta_1 - n_1\cos\theta_2}{n_2\cos\theta_1 + n_1\cos\theta_2}
     $$
   - Where $$\theta_1$$ and $$\theta_2$$ are the angles of incidence and refraction, related by Snell's law: $$n_1\sin\theta_1 = n_2\sin\theta_2$$.

**Total Transfer Matrix**
   - The total transfer matrix for a multilayer structure is the product of individual layer matrices:
     $$
     M_{total} = M_N \cdot M_{N-1} \cdots M_1
     $$

**Reflection and Transmission Coefficients**
   - The overall reflection and transmission coefficients can be extracted from the total transfer matrix:
     $$
     R = \left|\frac{B_0}{A_0}\right|^2, \quad T = \left|\frac{A_N}{A_0}\right|^2
     $$
   - Where $$A_0$$ and $$B_0$$ are the incident and reflected field amplitudes in the first layer, and $$A_N$$ is the transmitted field amplitude in the last layer.