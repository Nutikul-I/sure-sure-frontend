<script>
  import { onDestroy, onMount } from 'svelte';
  import Chart, { CategoryScale } from 'chart.js/auto';

  // ลงทะเบียน CategoryScale
  Chart.register(CategoryScale);

  // Props ที่รับจากภายนอก
  export let type = 'bar'; // ชนิดของกราฟ เช่น bar, line, pie
  export let data = {}; // ข้อมูลของกราฟ
  export let options = {}; // การตั้งค่าของกราฟ

  // @ts-ignore
  let canvas; // สำหรับเชื่อมโยงกับ `<canvas>`
  // @ts-ignore
  /**
	 * @type {Chart<keyof import("chart.js").ChartTypeRegistry, (number | [number, number] | import("chart.js").Point | import("chart.js").BubbleDataPoint | null)[], unknown>}
	 */
  let chartInstance; // เก็บ instance ของ Chart.js

  // สร้างกราฟเมื่อคอมโพเนนต์ mount
  onMount(() => {
      try {
          // @ts-ignore
          chartInstance = new Chart(canvas, {
              type,   // ชนิดของกราฟ
              data,   // ข้อมูลของกราฟ
              options // การตั้งค่ากราฟ
          });

          // ลบกราฟเมื่อคอมโพเนนต์ถูกทำลาย
          return () => {
              // @ts-ignore
              chartInstance.destroy();
          };
      } catch (e) {
          console.error('Error creating chart:', e);
      }
  });
  $: if (chartInstance) {
    // @ts-ignore
    chartInstance.data = data; // Update the chart data dynamically
    chartInstance.update();
  }

  onDestroy(() => {
    chartInstance?.destroy();
  });
</script>

<style>
  canvas {
      max-width: 100%;
      height: auto;
  }
</style>

<!-- กราฟจะแสดงในแท็ก canvas -->
<canvas bind:this={canvas}></canvas>
