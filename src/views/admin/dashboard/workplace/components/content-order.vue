<template>
    <div class="card-header" style="display: flex;justify-content: end;">
          <a-range-picker
            v-model="dateRange"
            format="YYYY-MM-DD"
            @change="handleDateChange"
            style="width: 260px"
          />
          <a-select v-model="dataType" @change="handlerTypeChange" style="margin: 0 10px;width: 80px">
            <a-option value="week">周</a-option>
            <a-option value="month">月</a-option>
            <a-option value="quarter">季度</a-option>
            <a-option value="half_year">半年</a-option>
            <a-option value="year">年</a-option>
          </a-select>

    </div>
  <a-spin :loading="loading" style="width: 100%">
    <Chart style="width: 100%; height: 370px" :option="chartOption" />
  </a-spin>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useI18n } from 'vue-i18n';
import useLoading from '@/hooks/loading';
import useChartOption from '@/hooks/chart-option';
import { getColumnChart } from '@/api/admin/dashboard/dashboard';
import { ToolTipFormatterParams  } from '@/types/echarts';
import dayjs from "dayjs";

const dataType = ref<string>('week')
const props = defineProps(['data']);
const i18n = useI18n();
const { loading, setLoading } = useLoading(true);

// 日期选择相关
const dateRange = ref([dayjs().subtract(30, 'day'), dayjs()]);

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
const titlesLineKey = ref<string[]>([]);
const mapLine = reactive({});
const series = ref<any[]>([]);
// 获取数据的函数
const fetchData = async () => {
  setLoading(true);
  try {
    await getColumnChart({type:dataType.value,start_time: (dayjs(dateRange.value[0]).toDate().getTime()/1000).toFixed(),
      end_time: (dayjs(dateRange.value[1]).toDate().getTime()/1000).toFixed()
    }).then((res) => {
          // 重置数据结构
      keys.value = [];
        // 清空系列数据
      series.value = [];  // 清空系列数据
       titlesKey.value = []; // 清空标题数据
      titlesLineKey.value = []; // 清空标题数据
       // 清空map对象
      Object.keys(map).forEach(key => delete map[key]);
      Object.keys(mapLine).forEach(key => delete mapLine[key]);
      daysKey.value= new Set();
      if (res.data?.chart_data) {
        res.data.chart_data.forEach((item:any,index) => {
          map[item.type+"stack"] = item.stack
          daysKey.value.add(item.date);
          if (!titlesKey.value.includes(item.title)) {
            titlesKey.value.push(item.title);
          }
          if (map[item.type]){
            map[item.type].push(Number.parseInt(item.value.toFixed(0)));
            // map[item.type].push(Number.parseInt(item.value+(Math.random()*10).toFixed(0)));
          } else {
            map[item.type] = [Number.parseInt(item.value.toFixed(0))];
            // map[item.type] = [Number.parseInt(item.value+(Math.random()*10).toFixed(0))];
          }
        });
      }
      Object.keys(map).forEach((key:string) => {
        if (!key.includes("stack")){
          series.value.push({
            name:key,
            type: 'bar',
            stack: map[key+"stack"],
            label: {
              show: true,
              formatter: (params) => {
                if (map[params.seriesName+"stack"].indexOf('额') >-1) {
                  return params.value.toFixed(2);
                }
                return  params.value;
              }
            },
            data:map[key]
          });
        }

      })

      if (res.renewal_rate?.chart_data) {
        res.renewal_rate.chart_data.forEach((item:any,index) => {
          mapLine[item.type+"stack"] = item.stack
          if (!titlesLineKey.value.includes(item.title)) {
            titlesLineKey.value.push(item.title);
          }
          if (mapLine[item.type]){
            mapLine[item.type].push(Number.parseInt(item.value.toFixed(0)));
            // map[item.type].push(Number.parseInt(item.value+(Math.random()*10).toFixed(0)));
          } else {
            mapLine[item.type] = [Number.parseInt(item.value.toFixed(0))];
            // map[item.type] = [Number.parseInt(item.value+(Math.random()*10).toFixed(0))];
          }
        });
      }

      Object.keys(mapLine).forEach((key:string) => {
        if (!key.includes("stack")){
          series.value.push({
            name:key,
            type: 'line',
            stack: mapLine[key+"stack"],
            label: {
              show: true,
              formatter: (params) => {
                  return params.value.toFixed(2)+"%";
              }
            },
            data:mapLine[key]
          });
        }

      })
      // 将日期集合转换为数组用于X轴显示
      keys.value = Array.from(daysKey.value);
    });


  } catch (err) {
    // 可以使用errorHandler或其他方式报告错误
  } finally {
    setLoading(false);
  }
};

// 组件加载时获取数据
fetchData();

const handleDateChange = (dates: any) => {
  if (!dates || !dates[0] || !dates[1]) return;
  fetchData();
};
const handlerTypeChange = (type: any) => {

  fetchData();
}

// 图表配置选项
const { chartOption } = useChartOption((isDark) => {
  return {

    grid: {
      left: 100,
      right: 100,
      top: 50,
      bottom: 50
    },
    legend: {
      selectedMode: true
    },
    xAxis: {
      type: 'category',
      data: keys.value,

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
    toolbox: {
      feature: {
        dataView: { show: true, readOnly: false },
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
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
