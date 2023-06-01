<template>
  <div class="dashboard">
    <h1>Analytics Dashboard</h1>
    <div class="date-picker">
      <label for="start-date">Start Date:</label>
      <input type="date" id="start-date" v-model="startDate" @change="updateChart" />
      <label for="end-date">End Date:</label>
      <input type="date" id="end-date" v-model="endDate" @change="updateChart" />
    </div>
    <div class="chart-container">
      <canvas ref="chart"></canvas>
    </div>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto';
import data from '../data.json';

export default {
  data() {
    return {
      OOS_THRESHOLD: 0.3, // Out of stock threshold (30%)
      startDate: null,
      endDate: null,
      filteredData: [],
      chartInstance: null,
    };
  },
  mounted() {
    this.filterData();
    this.renderChart();
  },
  methods: {
    filterData() {
      if (!this.startDate || !this.endDate) {
        this.filteredData = data;
        return;
      }

      this.filteredData = data.filter((item) => {
        const itemDate = new Date(item.timestamp);
        return itemDate >= new Date(this.startDate) && itemDate <= new Date(this.endDate);
      });
    },
    updateChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      this.filterData();
      this.renderChart();
    },
    renderChart() {
      const chartData = this.filteredData.sort((a, b) => {
        // Sort by product_code and then by timestamp
        if (a.product_code === b.product_code) {
          return new Date(a.timestamp) - new Date(b.timestamp);
        }
        return a.product_code.localeCompare(b.product_code);
      });

      const products = {};
      chartData.forEach((item) => {
        const { product_code, roi_state, timestamp, roi_percentage } = item;

        if (!products[product_code]) {
          products[product_code] = [];
        }

        if (roi_state === 'oos') {
          products[product_code].push({
            timestamp: new Date(timestamp),
            roi_state: 'oos',
            roi_percentage: roi_percentage,
          });
        } else {
          products[product_code].push({
            timestamp: new Date(timestamp),
            roi_state: 'stocked',
            roi_percentage: roi_percentage,
          });
        }
      });

      const topProducts = Object.entries(products)
        .map(([product_code, readings]) => ({
          product_code,
          duration: this.calculateOOSDuration(readings),
        }))
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5);

      const labels = topProducts.map((product) => product.product_code);
      const durations = topProducts.map((product) => product.duration);

      const ctx = this.$refs.chart.getContext('2d');
      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Cumulative OOS Duration',
              data: durations,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          indexAxis: 'x', // Specify the index axis to display labels correctly
          scales: {
            x: {
              title: {
                display: true,
                text: 'Product Code',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Cumulative OOS Duration (hours)',
              },
            },
          },
        },
      });
    },
    calculateOOSDuration(readings) {
      let oosStartTimestamp = null;
      let cumulativeDuration = 0;

      for (let i = 0; i < readings.length - 1; i++) {
        const currentReading = readings[i];
        const nextReading = readings[i + 1];

        if (currentReading.roi_percentage <= this.OOS_THRESHOLD) {
         
          oosStartTimestamp = currentReading.timestamp.getTime();

          cumulativeDuration += nextReading.timestamp.getTime() - oosStartTimestamp;
        } 
      }
      cumulativeDuration = cumulativeDuration / 1000 / 60 / 60;

      return cumulativeDuration;
    },
  },
};
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.date-picker {
  margin-bottom: 10px;
}

.chart-container {
  margin-top: 20px;
}
</style>
