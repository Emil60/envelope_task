<!-- src/App.vue -->

<template>
  <div id="app">
    <AnalyticsDashboard />
  </div>
</template>

<script>
import AnalyticsDashboard from './views/AnalyticsDashboard.vue';


export default {
  name: 'App',
  components: {
    AnalyticsDashboard,
  },
};
</script>
