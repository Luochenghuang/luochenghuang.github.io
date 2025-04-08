/**
 * Fresnel Reflection Calculator Vue Component
 * 
 * This component calculates and plots Fresnel reflection coefficients for different angles
 * given two refractive indices n1 and n2.
 */

const FresnelCalculator = {
  template: `
    <div class="fresnel-calculator">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Input Parameters</h5>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="n1" class="form-label">Refractive Index n1</label>
                    <input type="number" class="form-control" id="n1" 
                           :value="n1" 
                           @input="handleInputChange('n1', $event.target.value)" 
                           step="0.01">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="n2" class="form-label">Refractive Index n2</label>
                    <input type="number" class="form-control" id="n2" 
                           :value="n2" 
                           @input="handleInputChange('n2', $event.target.value)" 
                           step="0.01">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Reflection Plot</h5>
              <canvas ref="plotCanvas"></canvas>
              <div class="mt-3">
                <div class="alert alert-info">
                  <strong>Brewster Angle:</strong> {{ calculateBrewsterAngle().toFixed(2) }}°
                </div>
                <div class="alert alert-warning" v-if="calculateCriticalAngle() !== null">
                  <strong>Critical Angle (TIR):</strong> {{ calculateCriticalAngle().toFixed(2) }}°
                </div>
                <div class="alert alert-secondary" v-else>
                  <strong>Total Internal Reflection:</strong> Not possible (n1 ≤ n2)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      n1: 1.0,
      n2: 1.5,
      chart: null
    }
  },
  methods: {
    /**
     * Handles input changes and updates the refractive indices
     * @param {string} field - The field to update ('n1' or 'n2')
     * @param {string} value - The input value
     */
    handleInputChange(field, value) {
      if (value === '' || isNaN(value)) {
        this[field] = 1.0;
      } else {
        this[field] = parseFloat(value);
      }
    },

    /**
     * Calculates Fresnel reflection coefficient for s-polarization
     * @param {number} theta - Angle of incidence in degrees
     * @returns {number} Reflection coefficient
     */
    calculateRs(theta) {
      const thetaRad = theta * Math.PI / 180;
      const sinTheta2 = Math.sin(thetaRad);
      const cosTheta2 = Math.sqrt(1 - (this.n1/this.n2 * sinTheta2)**2);
      const rs = ((this.n1 * Math.cos(thetaRad) - this.n2 * cosTheta2) / 
                 (this.n1 * Math.cos(thetaRad) + this.n2 * cosTheta2))**2;
      return rs;
    },

    /**
     * Calculates Fresnel reflection coefficient for p-polarization
     * @param {number} theta - Angle of incidence in degrees
     * @returns {number} Reflection coefficient
     */
    calculateRp(theta) {
      const thetaRad = theta * Math.PI / 180;
      const sinTheta2 = Math.sin(thetaRad);
      const cosTheta2 = Math.sqrt(1 - (this.n1/this.n2 * sinTheta2)**2);
      const rp = ((this.n2 * Math.cos(thetaRad) - this.n1 * cosTheta2) / 
                 (this.n2 * Math.cos(thetaRad) + this.n1 * cosTheta2))**2;
      return rp;
    },

    /**
     * Calculates the Brewster angle in degrees
     * @returns {number} Brewster angle in degrees
     */
    calculateBrewsterAngle() {
      return Math.atan(this.n2 / this.n1) * 180 / Math.PI;
    },

    /**
     * Calculates the critical angle for total internal reflection in degrees
     * @returns {number|null} Critical angle in degrees, or null if TIR is not possible
     */
    calculateCriticalAngle() {
      if (this.n1 <= this.n2) {
        return null; // TIR is not possible
      }
      return Math.asin(this.n2 / this.n1) * 180 / Math.PI;
    },

    /**
     * Updates the plot with new data
     */
    updatePlot() {
      const criticalAngle = this.calculateCriticalAngle();
      const maxAngle = criticalAngle !== null ? criticalAngle : 90;
      const numPoints = 100; // Fixed number of points for smooth plotting
      const angles = Array.from({length: numPoints}, (_, i) => i * maxAngle / (numPoints - 1));
      const rsData = angles.map(theta => this.calculateRs(theta));
      const rpData = angles.map(theta => this.calculateRp(theta));

      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.$refs.plotCanvas.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: angles.map(angle => angle.toFixed(1)),
          datasets: [
            {
              label: 's-polarization',
              data: rsData,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            },
            {
              label: 'p-polarization',
              data: rpData,
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          animation: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Angle of Incidence (degrees)'
              },
              min: 0,
              max: maxAngle
            },
            y: {
              title: {
                display: true,
                text: 'Reflection Coefficient'
              },
              min: 0,
              max: 1
            }
          }
        }
      });
    }
  },
  watch: {
    n1() {
      this.updatePlot();
    },
    n2() {
      this.updatePlot();
    }
  },
  mounted() {
    this.updatePlot();
  }
};

// Create and mount the Vue app
const app = Vue.createApp({
  components: {
    'fresnel-calculator': FresnelCalculator
  }
});

app.mount('#fresnel-app'); 