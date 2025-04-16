<template>
  <a-spin :loading="loading" style="width: 100%">
    <div style="font-size: 18px">{{ t('dashboard.server.last.rank') }}</div>
    <Chart style="width: 100%; height: 370px" :option="chartOption" />
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import useChartOption from '@/hooks/chart-option';
  import { getServerLastRank } from '@/api/admin/dashboard/dashboard';
  import { ToolTipFormatterParams } from '@/types/echarts';

  const {t} = useI18n();
  const { loading, setLoading } = useLoading(true);

  // Initialize data arrays
  const keys = ref<string[]>([]);
  const series = ref<any[]>([]);

  // Fetch data function
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getServerLastRank();
      keys.value = [];
      const seriesData = ref<number[]>([]); // Initialize series data array
      
      if (res.data && res.data.length) {
        res.data.forEach((item: any) => {
          keys.value.push(item.server_name);
          seriesData.value.push((item.d + item.u) / 1024 / 1024 / 1024);
        });
      }
      
      series.value = [{
        type: 'bar',
        data: seriesData.value,
        label: {
          show: true,
          formatter: (params: { value: any; }) => `${params.value} GB`,
        },
      }];
    } catch (err) {
      console.error('Failed to fetch server rank data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component load
  fetchData();

  // Chart configuration
  const { chartOption } = useChartOption((isDark) => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter(params) {
        const [firstElement] = params as ToolTipFormatterParams[];
        return `${firstElement.value}GB`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
      data: keys.value,
      axisTick: {
        alignWithLabel: true,
      },
    },
    series: series.value,
  }));
</script>

<style scoped lang="less">
  .chart-box {
    width: 100%;
    height: 230px;
  }
</style>
