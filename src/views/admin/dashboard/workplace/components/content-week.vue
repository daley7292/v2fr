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

// 工具提示格式化函数 - 生成HTML内容
const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
  return items
    .map(
      (el) => `<div class="content-panel">
        <p>
          <span style="background-color: ${el.color}" class="tooltip-item-icon"></span>
          <span>${el.seriesName}</span>
        </p>
        <span class="tooltip-value">
        ${el.value}
        </span>
      </div>`
    )
    .join('');
};

// 初始化数据数组
const keys = ref<string[]>([]); // 日期键值

// 使用 Set 存储不重复的日期

const daysKey = ref<Set<string>>(new Set());
const titlesKey = ref<string[]>([]);
const map = reactive({});
const series = ref<any[]>([]);
// 获取数据的函数
const fetchData = async () => {
  setLoading(true);
  try {
    await queryOrders().then((res) => {
      daysKey.value= new Set();
      if (res.data?.chart_data) {
        res.data.chart_data.forEach((item:any) => {
          daysKey.value.add(item.date);
          if (!titlesKey.value.includes(item.title)) {
            titlesKey.value.push(item.title);
          }
          if (map[item.type]){
            map[item.type].push(item.value);
          } else {
            map[item.type] = [item.value];
          }
        });
      }
    });
    const count = ref(0)
    const colors = [
      "#5b3c5c", "#3b8b7a", "#b3475c", "#1afd5a", "#774a3e"
    ];
    Object.keys(map).forEach((key:string) => {
      series.value.push({
        name: key, // 佣金数量
        data:map[key],
        type: 'line',
        smooth: true,
        showSymbol: false,
        color: colors[count.value],
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
      count.value = count.value+1;
    })
    // 将日期集合转换为数组用于X轴显示
    keys.value = Array.from(daysKey.value);
  } catch (err) {
    // 可以使用errorHandler或其他方式报告错误
  } finally {
    setLoading(false);
  }
};

// 组件加载时获取数据
fetchData();

// 图表配置选项
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
        // 控制刻度显示
        interval(idx: number) {
          if (idx === 0) return false;
          if (idx === keys.value.length - 1) return false;
          return true;
        },
      },
      axisLabel: {
        color: '#86909C',
        // 格式化X轴标签
        formatter(value: number, idx: number) {
          return `${value}`;
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
    // 四条数据线的配置
    series: series.value,
    // 数据缩放配置
  };
});
</script>

<style scoped lang="less">
.chart-box {
  width: 100%;
  height: 230px;
}
</style>
