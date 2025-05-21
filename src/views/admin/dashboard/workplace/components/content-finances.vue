<template>
  <div class="finance-container">
    <a-card :bordered="false" class="general-card">
      <!-- 卡片标题与日期选择器 -->
      <template #title>
        <div class="card-header">
          <div class="card-title">{{ $t('card-title') }}</div>
          <div class="date-picker-container">
            <a-range-picker
              v-model="dateRange"
              format="YYYY-MM-DD"
              @change="handleDateChange"
              style="width: 260px"
            />
          </div>
        </div>
      </template>

      <a-spin :loading="loading" style="width: 100%;">
        <!-- 财务概览卡片区域 -->
        <div class="finance-overview">
          <!-- 第一行卡片：当前期间、上一期间、去年同期 -->
          <div class="finance-card-row">
            <a-card class="financial-data-card">
              <div class="card-value">{{GetCurrencySymbol()}} {{ formatNumber(financeData?.current_period?.total) }}</div>
              <div class="card-label">{{ $t('card-label-current') }}</div>
              <div class="card-extra">
                <div class="card-period">{{ formatDateRange(financeData?.current_period?.start_time, financeData?.current_period?.end_time) }}</div>
              </div>
            </a-card>

            <a-card class="financial-data-card">
              <div class="card-value">{{GetCurrencySymbol()}} {{ formatNumber(financeData?.previous_period?.total) }}</div>
              <div class="card-label">{{ $t('card-label-previous') }}</div>
              <div class="card-extra">
                <div class="card-period">{{ formatDateRange(financeData?.previous_period?.start_time, financeData?.previous_period?.end_time) }}</div>
              </div>
            </a-card>

            <a-card class="financial-data-card">
              <div class="card-value">{{GetCurrencySymbol()}} {{ formatNumber(financeData?.last_year_period?.total) }}</div>
              <div class="card-label">{{ $t('card-label-lastYear') }}</div>
              <div class="card-extra">
                <div class="card-period">{{ formatDateRange(financeData?.last_year_period?.start_time, financeData?.last_year_period?.end_time) }}</div>
              </div>
            </a-card>
          </div>

          <!-- 第二行卡片：环比和同比增长 -->
          <div class="finance-card-row">
            <a-card class="financial-data-card" :bordered="false">
              <div
                class="card-value"
                :class="{'growth-positive': financeData?.growth_rate?.mom >= 0, 'growth-negative': financeData?.growth_rate?.mom < 0}"
              >
                {{ (financeData?.growth_rate?.mom || 0) >= 0 ? '+' : '' }}{{ financeData?.growth_rate?.mom || 0 }}%
              </div>
              <div class="card-label">{{ $t('card-label-chainRatio') }}</div>
              <div class="card-extra">
                <div class="card-period">{{ $t('card-period-defaultChain',{ mom: financeData?.growth_rate?.mom || 0 }) }}</div>
              </div>
            </a-card>

            <a-card class="financial-data-card" :bordered="false">
              <div
                class="card-value"
                :class="{'growth-positive': financeData?.growth_rate?.yoy >= 0, 'growth-negative': financeData?.growth_rate?.yoy < 0}"
              >
                {{ (financeData?.growth_rate?.yoy || 0) >= 0 ? '+' : '' }}{{ financeData?.growth_rate?.yoy || 0 }}%
              </div>
              <div class="card-label">{{ $t('card-label-yearOnYear') }}</div>
              <div class="card-extra">
                <div class="card-period">{{ $t('card-period-defaultYear', { yoy: financeData?.growth_rate?.yoy || 0 }) }}</div>
              </div>
            </a-card>
          </div>
        </div>
      </a-spin>
      <!-- 图表展示区域 -->
      <Chart style="width: 100%; height: 370px" :option="chartOption"/>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
// 导入依赖库
import { ref } from 'vue';
import { useI18n } from "vue-i18n";
import dayjs from 'dayjs';
import {GetCurrencySymbol} from "@/utils/comm-config";

// 导入API和钩子函数
import useLoading from '@/hooks/loading';
import useChartOption from '@/hooks/chart-option';
import { GetFinances } from "@/api/admin/dashboard/dashboard";
import { queryContentPeriodAnalysis } from '@/api/visualization';
import { ToolTipFormatterParams } from '@/types/echarts';

// 初始化国际化
const i18n = useI18n();
const { t } = useI18n();
const props = defineProps(['data']);

// 加载状态控制
const { loading, setLoading } = useLoading(true);

// 日期选择相关
const dateRange = ref([dayjs().subtract(7, 'day'), dayjs()]);
const disabledDate = (current: any) => {
  // 禁用未来的日期
  return current && current > dayjs().endOf('day');
};
const handleDateChange = (dates: any) => {
  if (!dates || !dates[0] || !dates[1]) return;
  fetchData();
};

// 数据格式化函数
const formatDateRange = (start: any, end: any) => {
  if (!start || !end) return '';
  return `${start} ${i18n.t('date-format-separator')} ${end}`;
};
const formatNumber = (num: any) => {
  if (num === undefined || num === null) return '0.00';
  return Number(num).toFixed(2);
};

// 图表tooltip格式化
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

// 数据存储
const financeData = ref();
const keys = ref<string[]>([]);
const type1Values = ref<number[]>([]);
const type2Values = ref<number[]>([]);
const type3Values = ref<number[]>([]);
const uniqueDates = ref<Set<string>>(new Set);

// 图表配置
const { chartOption } = useChartOption((isDark) => {
  return {
    grid: {
      left: '40',
      right: 0,
      top: '60',
      bottom: '100',
      containLabel: true
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
          if (idx === 0) return false;
          if (idx === keys.value.length - 1) return false;
          return true;
        },
      },
      axisLabel: {
        color: '#86909C',
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
    series: [
      {
        name: i18n.t('dashboard.payment.current'),
        data: type1Values.value,
        type: 'line',
        smooth: true,
        showSymbol: false,
        color: isDark ? '#3D72F6' : '#246EFF',
        symbol: 'circle',
        symbolSize: 10,
        emphasis: {
          focus: 'series',
          itemStyle: {
            borderWidth: 2,
            borderColor: '#E0E3FF',
          },
        },
      },
      {
        name: i18n.t('dashboard.payment.previous'),
        data: type2Values.value,
        type: 'line',
        smooth: true,
        showSymbol: false,
        color: isDark ? '#A079DC' : '#00B2FF',
        symbol: 'circle',
        symbolSize: 10,
        emphasis: {
          focus: 'series',
          itemStyle: {
            borderWidth: 2,
            borderColor: '#E2F2FF',
          },
        },
      },
      {
        name: i18n.t('dashboard.payment.lastYear'),
        data: type3Values.value,
        type: 'line',
        smooth: true,
        showSymbol: false,
        color: isDark ? '#833d30' : '#e86550',
        symbol: 'circle',
        symbolSize: 10,
        emphasis: {
          focus: 'series',
          itemStyle: {
            borderWidth: 2,
            borderColor: '#D9F6FF',
          },
        },
      }
    ],
    // dataZoom: [
    //   {
    //     bottom: 40,
    //     type: 'slider',
    //     left: 40,
    //     right: 14,
    //     height: 14,
    //     borderColor: 'transparent',
    //     handleIcon:
    //       'image://http://p3-armor.byteimg.com/tos-cn-i-49unhts6dw/1ee5a8c6142b2bcf47d2a9f084096447.svg~tplv-49unhts6dw-image.image',
    //     handleSize: '20',
    //     handleStyle: {
    //       shadowColor: 'rgba(0, 0, 0, 0.2)',
    //       shadowBlur: 4,
    //     },
    //     brushSelect: false,
    //     backgroundColor: isDark ? '#313132' : '#F2F3F5',
    //   },
    //   {
    //     type: 'inside',
    //     start: 0,
    //     end: 100,
    //     zoomOnMouseWheel: false,
    //   },
    // ],
  };
});

// 获取财务数据
const fetchData = async () => {
  setLoading(true);
  try {
    // 清空之前的数据
    keys.value = [];
    type1Values.value = [];
    type2Values.value = [];
    type3Values.value = [];
    uniqueDates.value.clear();
    
    // 调用API获取财务数据
    await GetFinances({
      start_date: dayjs(dateRange.value[0]).format('YYYY-MM-DD'),
      end_date: dayjs(dateRange.value[1]).format('YYYY-MM-DD')
    }).then(res => {
      financeData.value = res.data;
      // 处理图表数据
      res.data.chart_data.forEach((item: any) => {
        if (!uniqueDates.value.has(item.date)) {
          uniqueDates.value.add(item.date)
        }
        type1Values.value.push(item.current);
        type2Values.value.push(item.previous);
        type3Values.value.push(item.lastYear);
      });
    })

    keys.value = Array.from(uniqueDates.value);
  } catch (err) {
    // 错误处理
  } finally {
    setLoading(false);
  }
};

// 组件加载时获取数据
fetchData();
</script>

<style scoped>
/* 容器样式 */
.finance-container {
  width: 100%;
}

.general-card {
  margin-bottom: 16px;
  background-color: var(--color-bg-2);
}

/* 卡片头部样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
}

.date-picker-container {
  display: flex;
  align-items: center;
}

/* 财务概览区域样式 */
.finance-overview {
  margin-bottom: 24px;
}

.finance-card-row {
  display: flex;
  margin: 0 -8px 16px;
  flex-wrap: wrap;
}

/* 财务卡片样式 */
.financial-data-card {
  flex: 1;
  margin: 0 8px 16px;
  min-width: 200px;
  border-radius: 4px;
  background-color: var(--color-bg-1);
  transition: box-shadow 0.3s;
}

.financial-data-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

/* 卡片内容样式 */
.card-value {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--color-text-1);
}

.card-label {
  font-size: 14px;
  color: var(--color-text-3);
  margin-bottom: 12px;
}

.card-extra {
  color: var(--color-text-3);
  font-size: 12px;
}

.card-period, .card-days {
  margin-bottom: 4px;
}

/* 增长指标样式 */
.growth-positive {
  color: #00b42a;
}

.growth-negative {
  color: #f53f3f;
}

/* 图表容器样式 */
.chart-container {
  height: 360px;
  width: 100%;
  margin-top: 16px;
  box-sizing: border-box;
  overflow: hidden;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .financial-data-card {
    min-width: calc(50% - 16px);
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .date-picker-container {
    margin-top: 12px;
    width: 100%;
  }
}

@media (max-width: 576px) {
  .financial-data-card {
    min-width: 100%;
  }
  
  .chart-container {
    height: 280px;
  }
}
</style>