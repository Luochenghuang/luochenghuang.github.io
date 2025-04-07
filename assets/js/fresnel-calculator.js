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
                    <input type="number" class="form-control" id="n1" v-model.number="n1" step="0.01">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="n2" class="form-label">Refractive Index n2</label>
                    <input type="number" class="form-control" id="n2" v-model.number="n2" step="0.01">
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
     * Updates the plot with new data
     */
    updatePlot() {
      const angles = Array.from({length: 91}, (_, i) => i);
      const rsData = angles.map(theta => this.calculateRs(theta));
      const rpData = angles.map(theta => this.calculateRp(theta));

      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.$refs.plotCanvas.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: angles,
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
          scales: {
            x: {
              title: {
                display: true,
                text: 'Angle of Incidence (degrees)'
              }
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