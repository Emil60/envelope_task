<template>
    <head>
        <!-- Other head tags -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/chart.js@3.5.1/dist/chart.min.css">
      </head>
    <div>
      <!-- Other dashboard content -->
      <stock-timeline-chart :data="stockData" :date-range="selectedDateRange" />
      hey there
    </div>
    
  </template>
  
  <script>
  import StockTimelineChart from '../components/StockTimelineChart.vue';
  <script src="https://cdn.jsdelivr.net/npm/chart.js@3.5.1"></script>

  export default {
    components: {
      StockTimelineChart,
    },
    data() {
      return {
        stockData: [
      {
        productCode: 'P001',
        name: 'Product 1',
        stockLevels: [
          { timestamp: '2023-05-30T09:00:00', stockLevel: 0.8, state: 'stocked' },
          { timestamp: '2023-05-30T12:00:00', stockLevel: 0.6, state: 'stocked' },
          { timestamp: '2023-05-30T15:00:00', stockLevel: 0.4, state: 'low' },
          { timestamp: '2023-05-30T18:00:00', stockLevel: 0.2, state: 'low' },
          { timestamp: '2023-05-30T21:00:00', stockLevel: 0, state: 'oos' },
        ],
      },
      {
        productCode: 'P002',
        name: 'Product 2',
        stockLevels: [
          { timestamp: '2023-05-30T09:00:00', stockLevel: 0.8, state: 'stocked' },
          { timestamp: '2023-05-30T12:00:00', stockLevel: 0.6, state: 'stocked' },
          { timestamp: '2023-05-30T15:00:00', stockLevel: 0.4, state: 'low' },
          { timestamp: '2023-05-30T18:00:00', stockLevel: 0.2, state: 'low' },
          { timestamp: '2023-05-30T21:00:00', stockLevel: 0, state: 'oos' },
        ],
      },
      {
        productCode: 'P003',
        name: 'Product 3',
        stockLevels: [
          { timestamp: '2023-05-30T09:00:00', stockLevel: 0.8, state: 'stocked' },
          { timestamp: '2023-05-30T12:00:00', stockLevel: 0.6, state: 'stocked' },
          { timestamp: '2023-05-30T15:00:00', stockLevel: 0.4, state: 'low' },
          { timestamp: '2023-05-30T18:00:00', stockLevel: 0.2, state: 'low' },
          { timestamp: '2023-05-30T21:00:00', stockLevel: 0, state: 'oos' },
        ],
      },
      // Add more objects for other products

    ],
        selectedDateRange: {
          start: new Date(), // Set the initial start date
          end: new Date(), // Set the initial end date
        },
      };
    },
  };
  </script>
  