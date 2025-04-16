<template>
  <a-spin :loading="loading" style="width: 100%">
    <Chart style="width: 100%; height: 370px" :option="chartOption" />
  </a-spin>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import useChartOption from '@/hooks/chart-option';
import { queryOrders } from '@/api/admin/dashboard/dashboard';
import { ToolTipFormatterParams } from '@/types/echarts';

const props = defineProps(['data']);
const i18n = useI18n();
const { loading, setLoading } = useLoading(true);

// State variables
const keys = ref<string[]>([]); // X-axis dates
const daysKey = ref<Set<string>>(new Set());
const titlesKey = ref<string[]>([]);
const dataMap = reactive({});
const series = ref<any[]>([]);

// Chart colors
const chartColors = [
  "#5b3c5c", "#3b8b7a", "#b3475c", "#1afd5a", "#774a3e",
  "#e41c2c", "#8db76b", "#2e3832", "#6b47a8"
];

// Tooltip formatter - generates HTML content
const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
  return items
    .map(
      (el) => `<div class="content-panel">
        <p>
          <span style="background-color: ${el.color}" class="tooltip-item-icon"></span>
          <span>${el.seriesName}</span>
        </p>
        <span class="tooltip-value">${el.value}</span>
      </div>`
    )
    .join('');
};

// Fetch and process data
const fetchData = async () => {
  setLoading(true);
  try {
    const response = await queryOrders();
    
    // Reset data
    daysKey.value = new Set();
    titlesKey.value = [];
    Object.keys(dataMap).forEach(key => delete dataMap[key]);
    series.value = [];
    
    // Process data
    if (response.data?.statistics) {
      response.data.statistics.forEach((item: any) => {
        daysKey.value.add(item.date);
        
        if (!titlesKey.value.includes(item.title)) {
          titlesKey.value.push(item.title);
        }
        
        if (dataMap[item.type]) {
          dataMap[item.type].push(item.value);
        } else {
          dataMap[item.type] = [item.value];
        }
      });
    }
    
    // Create series data for chart
    Object.keys(dataMap).forEach((key: string, index: number) => {
      series.value.push({
        name: key,
        data: dataMap[key],
        type: 'line',
        smooth: true,
        showSymbol: false,
        color: chartColors[index % chartColors.length],
        symbol: 'circle',
        symbolSize: 10,
        emphasis: {
          focus: 'series',
          itemStyle: {
            borderWidth: 2,
            borderColor: '#E0E3FF',
          },
        },
      });
    });
    
    // Convert date set to array for X-axis
    keys.value = Array.from(daysKey.value);
  } catch (error) {
    console.error('Failed to fetch order data:', error);
  } finally {
    setLoading(false);
  }
};

// Initialize data on component mount
fetchData();

// Chart configuration
const { chartOption } = useChartOption((isDark) => {
  return {
    grid: {
      left: '40',
      right: 0,
      top: '60',
      bottom: '100',
      containLabel: true,
    },
    legend: {
      top: 0,
      left: 10,
      icon: 'circle',
      textStyle: {
        color: '#4E5969',
      },
    },
    xAxis: {
      type: 'category',
      data: keys.value,
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: isDark ? '#3f3f3f' : '#A9AEB8',
        },
      },
      axisTick: {
        show: true,
        alignWithLabel: true,
        lineStyle: {
          color: '#86909C',
        },
        interval(idx: number) {
          return idx !== 0 && idx !== keys.value.length - 1;
        },
      },
      axisLabel: {
        color: '#86909C',
        formatter(value: number, idx: number) {
          return  `${value}`;
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#86909C',
        formatter: '{value}%',
      },
      splitLine: {
        lineStyle: {
          color: isDark ? '#3F3F3F' : '#E5E6EB',
        },
      },
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter(params) {
        const [firstElement] = params as ToolTipFormatterParams[];
        return `<div>
            <p class="tooltip-title">${firstElement.axisValueLabel}</p>
            ${tooltipItemsHtmlString(params as ToolTipFormatterParams[])}
          </div>`;
      },
      className: 'echarts-tooltip-diy',
    },
    series: series.value,
  };
});
</script>

<style scoped lang="less">
.chart-box {
  width: 100%;
  height: 230px;
}
</style>
