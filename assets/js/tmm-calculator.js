/**
 * Transfer Matrix Method (TMM) calculator Vue component.
 * Copyright (c) 2025, Luocheng Huang
 */

const { createApp, ref, computed, onMounted } = Vue;

const TMMCalculator = {
    template: `
        <div class="tmm-app">
            <div class="wavelength-controls">
                <h3>Wavelength Range</h3>
                <div class="wavelength-inputs">
                    <div class="input-group">
                        <label>Start:</label>
                        <input type="number" v-model="wavelengthStart" min="200" max="2000" step="1">
                        <span>nm</span>
                    </div>
                    <div class="input-group">
                        <label>End:</label>
                        <input type="number" v-model="wavelengthEnd" min="200" max="2000" step="1">
                        <span>nm</span>
                    </div>
                    <div class="input-group">
                        <label>Points:</label>
                        <input type="number" v-model="wavelengthPoints" min="10" max="1000" step="1">
                    </div>
                </div>
            </div>

            <div class="layers-controls">
                <h3>Layers</h3>
                <div v-for="(layer, index) in layers" :key="index" class="layer">
                    <div class="layer-inputs">
                        <div class="input-group">
                            <label>n:</label>
                            <input type="number" v-model="layer.n" step="0.01">
                        </div>
                        <div class="input-group">
                            <label>k:</label>
                            <input type="number" v-model="layer.k" step="0.01">
                        </div>
                        <div class="input-group">
                            <label>d:</label>
                            <input type="number" v-model="layer.d" step="1" :disabled="index === 0 || index === layers.length - 1">
                            <span>nm</span>
                        </div>
                        <button class="remove-button" @click="removeLayer(index)" v-if="index !== 0 && index !== layers.length - 1">Remove</button>
                    </div>
                </div>
                <button class="add-button" @click="addLayer">Add Layer</button>
            </div>

            <div class="angle-controls">
                <h3>Incident Angle</h3>
                <div class="angle-control">
                    <label>θ:</label>
                    <input type="range" v-model="angle" min="0" max="90" step="0.1">
                    <span>{{ angle.toFixed(1) }}°</span>
                </div>
            </div>

            <div class="polarization-controls">
                <h3>Polarization</h3>
                <div class="checkbox-group">
                    <label>
                        <input type="checkbox" v-model="polarization.TE"> TE
                    </label>
                    <label>
                        <input type="checkbox" v-model="polarization.TM"> TM
                    </label>
                </div>
            </div>

            <button class="calculate-button" @click="calculate">Calculate</button>

            <div class="plots">
                <div class="plot-container">
                    <h3>Reflectance vs Wavelength</h3>
                    <div id="reflectance-plot"></div>
                </div>
                <div class="plot-container">
                    <h3>Transmittance vs Wavelength</h3>
                    <div id="transmittance-plot"></div>
                </div>
                <div class="plot-container">
                    <h3>Absorbance vs Wavelength</h3>
                    <div id="absorbance-plot"></div>
                </div>
            </div>
        </div>
    `,
    setup() {
        const wavelengthStart = ref(400);
        const wavelengthEnd = ref(800);
        const wavelengthPoints = ref(100);
        const angle = ref(0);
        const polarization = ref({ TE: true, TM: true });
        const layers = ref([
            { n: 1.0, k: 0, d: 0 },  // Air
            { n: 1.5, k: 0, d: 100 }, // Example layer
            { n: 1.0, k: 0, d: 0 }   // Substrate
        ]);

        const addLayer = () => {
            const newLayer = { n: 1.5, k: 0, d: 100 };
            layers.value.splice(layers.value.length - 1, 0, newLayer);
        };

        const removeLayer = (index) => {
            if (index > 0 && index < layers.value.length - 1) {
                layers.value.splice(index, 1);
            }
        };

        const calculate = () => {
            const wavelengths = generateWavelengthArray(
                wavelengthStart.value,
                wavelengthEnd.value,
                wavelengthPoints.value
            );

            const reflectance = [];
            const transmittance = [];
            const absorbance = [];

            wavelengths.forEach(wavelength => {
                const result = calculateRT(
                    layers.value,
                    wavelength,
                    angle.value,
                    polarization.value
                );
                reflectance.push(result.R);
                transmittance.push(result.T);
                absorbance.push(result.A);
            });

            // Update plots using Plotly
            const reflectancePlot = {
                x: wavelengths,
                y: reflectance,
                type: 'scatter',
                mode: 'lines',
                name: 'Reflectance'
            };

            const transmittancePlot = {
                x: wavelengths,
                y: transmittance,
                type: 'scatter',
                mode: 'lines',
                name: 'Transmittance'
            };

            const absorbancePlot = {
                x: wavelengths,
                y: absorbance,
                type: 'scatter',
                mode: 'lines',
                name: 'Absorbance'
            };

            const layout = {
                xaxis: { title: 'Wavelength (nm)' },
                yaxis: { title: 'Value', range: [0, 1] }
            };

            Plotly.newPlot('reflectance-plot', [reflectancePlot], layout);
            Plotly.newPlot('transmittance-plot', [transmittancePlot], layout);
            Plotly.newPlot('absorbance-plot', [absorbancePlot], layout);
        };

        onMounted(() => {
            calculate();
        });

        return {
            wavelengthStart,
            wavelengthEnd,
            wavelengthPoints,
            angle,
            polarization,
            layers,
            addLayer,
            removeLayer,
            calculate
        };
    }
};

// Create and mount the Vue app
const app = createApp({
    components: {
        'tmm-calculator': TMMCalculator
    },
    template: '<tmm-calculator></tmm-calculator>'
});

app.mount('#tmm-app'); 