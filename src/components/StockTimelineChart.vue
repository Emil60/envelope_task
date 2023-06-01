<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { Line } from 'vue-chartjs';
import moment from 'moment';

export default {
  extends: Line,
  props: {
    data: {
      type: Array,
      required: true,
    },
    dateRange: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
  computed: {
    chartData() {
      const datasets = [];

      const startDate = moment(this.dateRange.start);
      const endDate = moment(this.dateRange.end);
      const diffInDays = endDate.diff(startDate, 'days');

      for (const product of this.data) {
        const stockLevels = product.stockLevels;
        const dataPoints = [];

        if (diffInDays <= 1) {
          // X-axis step: 1 hour
          const currentDate = moment(startDate);
          while (currentDate <= endDate) {
            const matchingDataPoint = stockLevels.find((level) =>
              moment(level.timestamp).isSame(currentDate, 'hour')
            );
            if (matchingDataPoint) {
              dataPoints.push(matchingDataPoint.stock);
            } else {
              dataPoints.push(null);
            }
            currentDate.add(1, 'hour');
          }
        } else {
          // X-axis step: 1 day
          const currentDate = moment(startDate).startOf('day');
          while (currentDate <= endDate) {
            const dataPointsInDay = stockLevels.filter((level) =>
              moment(level.timestamp).isBetween(currentDate, currentDate.clone().endOf('day'), null, '[]')
            );

            if (dataPointsInDay.length > 0) {
              const averageStockLevel = dataPointsInDay.reduce((sum, level) => sum + level.stock, 0) / dataPointsInDay.length;
              dataPoints.push(averageStockLevel);
            } else {
              dataPoints.push(null);
            }

            currentDate.add(1, 'day');
          }
        }

        datasets.push({
          label: product.name,
          data: dataPoints,
          fill: false,
        });
      }

      return {
        labels: this.generateLabels(startDate, endDate, diffInDays),
        datasets,
      };
    },
    options() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: this.getXAxisUnit(),
            },
          },
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
      };
    },
  },
  methods: {
    generateLabels(startDate, endDate, diffInDays) {
      const labels = [];
      const currentDate = moment(startDate);

      if (diffInDays <= 1) {
        // Hourly labels
        while (currentDate <= endDate) {
          labels.push(currentDate.format('HH:mm'));
          currentDate.add(1, 'hour');
        }
      } else {
        // Daily labels
        while (currentDate <= endDate) {
          labels.push(currentDate.format('MM/DD/YYYY'));
          currentDate.add(1, 'day');
        }
      }

      return labels;
    },
    getXAxisUnit() {
      const diffInDays = moment(this.dateRange.end).diff(moment(this.dateRange.start), 'days');
      return diffInDays <= 1 ? 'hour' : 'day';
    },
  },
};
</script>
