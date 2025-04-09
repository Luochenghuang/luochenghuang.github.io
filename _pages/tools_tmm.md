---
layout: page
permalink: /tools_tmm/
title: Multilayer Optical Thin Film Simulation
description: Calculates transmission and reflection coefficients for multilayer structures using the Transfer Matrix Method. This app displays results across different wavelengths and incident angles. Copyright © 2025, Luocheng Huang.
nav: false
---

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

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

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
                    start: 550,
                    end: 700,
                    points: 100
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
                debouncedUpdate: null
            };
        },
        created() {
            // Create debounced version of updateNormalPlots
            this.debouncedUpdate = debounce(this.updateNormalPlots, 50);
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
                const transmittanceDataTE = [];
                const reflectanceDataTE = [];
                const transmittanceDataTM = [];
                const reflectanceDataTM = [];
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
                    transmittanceDataTE.push(transmittanceRowTE);
                    reflectanceDataTE.push(reflectanceRowTE);
                    transmittanceDataTM.push(transmittanceRowTM);
                    reflectanceDataTM.push(reflectanceRowTM);
                }

                // Calculate spectral response data at the selected angle
                const normalDataTE = wavelengths.map(wavelength => {
                    const { R, T } = calculateRT(layers, wavelength, this.spectralAngle, { TE: true, TM: false });
                    return { wavelength, R, T };
                });

                const normalDataTM = wavelengths.map(wavelength => {
                    const { R, T } = calculateRT(layers, wavelength, this.spectralAngle, { TE: false, TM: true });
                    return { wavelength, R, T };
                });

                this.updateNormalPlot(normalDataTE, 'TE');
                this.updateNormalPlot(normalDataTM, 'TM');
                this.updateTransmittancePlot(wavelengths, angles, transmittanceDataTE, 'TE');
                this.updateTransmittancePlot(wavelengths, angles, transmittanceDataTM, 'TM');
                this.updateReflectancePlot(wavelengths, angles, reflectanceDataTE, 'TE');
                this.updateReflectancePlot(wavelengths, angles, reflectanceDataTM, 'TM');
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
                // Use debounced update for smoother slider experience
                this.debouncedUpdate();
            },
            updateNormalPlots() {
                const wavelengths = generateWavelengthArray(
                    this.wavelengthRange.start,
                    this.wavelengthRange.end,
                    this.wavelengthRange.points
                );

                // Calculate spectral response data at the selected angle
                const normalDataTE = wavelengths.map(wavelength => {
                    const { R, T } = calculateRT(this.layers, wavelength, this.spectralAngle, { TE: true, TM: false });
                    return { wavelength, R, T };
                });

                const normalDataTM = wavelengths.map(wavelength => {
                    const { R, T } = calculateRT(this.layers, wavelength, this.spectralAngle, { TE: false, TM: true });
                    return { wavelength, R, T };
                });

                this.updateNormalPlot(normalDataTE, 'TE');
                this.updateNormalPlot(normalDataTM, 'TM');
            }
        }
    };

    createApp(TMMApp).mount('#app');
</script>