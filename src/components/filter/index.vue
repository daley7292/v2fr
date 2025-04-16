<script setup lang="ts">
import {  parseDateStringToTimestamp } from "@/api/admin/public";
import { onMounted, reactive, ref, watch } from "vue";
import {useI18n} from 'vue-i18n';
const {t} = useI18n();



const props = defineProps(['filter', 'defaultCond'])

const emits = defineEmits(['callback', 'cancel'])


 interface Cnd {
  key: string,
  condition: string,
  value: any,
  tempValue: any,
}


 interface Data {
  key: string,
  des: string,
  value: any
  op: string[]
  type: string
}

//查询条件集合
const conds = ref<Cnd[]>(props.defaultCond);

//获取可选过滤内容
const filter = reactive<Data[]>(props.filter);

//添加查询条件
const addCond = () => {
  if (filter.length > 0) {
    conds.value.push({ key: filter[0].key, condition: filter[0].op[0], value: null, tempValue: null })
  }
}

//key改变了
const keyChange = (index: number) => {
  conds.value[index].condition = ""
  const key = conds.value[index].key
  if (filter.length > 0) {
    filter.forEach(v => {
      if (key === v.key && v.op.length > 0) {
        conds.value[index].value = null
        conds.value[index].condition = v.op[0]
        return;
      }
    })
  }
}

//清除所有条件
const resetCond = () => {
  emits('callback')

}

//删除查询条件
const deleteCond = (delIndex: number) => {
  const newCond: { key: string; condition: string; value: string;tempValue:any }[] = [];
  conds.value.forEach((item, index) => {
    if (delIndex !== index) {
      newCond.push(item);
    }
  });
  conds.value = newCond;
};

//取消
const cancel = () => {
  emits('cancel')
}


//调用父级函数
const submit = () => {
  emits('callback', {filter:conds.value})
}

const onDateChange = (index: number) => {
  if (conds.value[index].tempValue) {
    conds.value[index].value = parseDateStringToTimestamp(conds.value[index].tempValue) + ''
  }
}

onMounted(() => {
  if (conds.value.length < 1) {
    addCond()
  }
})


watch(() => props.filter, (newValue) => {
  filter.splice(0, filter.length, ...newValue);
}, { deep: true });

watch(() => props.defaultCond, (newValue) => {
  conds.value = [...newValue];
}, { deep: true });

</script>
<template>
  <a-form :model="conds" layout="vertical">
    <div v-for="(_, index) in conds" :key="index">
      <a-form-item style="width: 100%">
        <a-divider><a-button type="primary" status="danger" style="margin: 0 auto"
                             @click="deleteCond(index)">{{t('button.delete')}}</a-button></a-divider>
      </a-form-item>
      <a-form-item :label="t('filter.fieldName')">
        <a-select v-model="conds[index].key" @change="keyChange(index)">
          <a-option :value="item.key" v-for="(item, index) in filter" :key="index">{{ item.des }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="t('filter.condition')">
        <a-select v-model="conds[index].condition">
          <div v-for="(item, fIndex) in filter" :key="fIndex">
            <div v-if="conds[index].key == item.key">
              <a-option :value="cItem" v-for="(cItem, vIndex) in item.op" :key="vIndex">{{ cItem }}</a-option>
            </div>
          </div>
        </a-select>
      </a-form-item>
      <a-form-item :label="t('filter.searchContent')">
        <template v-for="(item, fIndex) in filter" :key="fIndex">
          <div v-if="conds[index].key === item.key" style="width: 100%;display: block">
            <div v-if="conds[index].condition=='为空'">
              <a-select  v-model="conds[index].value" style="width: 100%" >
                <a-option :value="-1" :key="vIndex">否</a-option>
                <a-option :value="-2" :key="vIndex">是</a-option>
              </a-select>
            </div>
            <div v-else>
              <a-input v-if="item.type === 'input'" v-model="conds[index].value" style="width: 100%;" />

              <a-date-picker v-if="item.type === 'date'" v-model="conds[index].tempValue" @change="onDateChange(index)" style="width: 100%; margin: 0 24px 24px 0;" show-time format="YYYY-MM-DD HH:mm:ss" />

              <a-select v-if="item.type === 'select' || item.type === 'select-multiple'" v-model="conds[index].value" style="width: 100%" :multiple="item.type == 'select-multiple'">
                <a-option v-for="(v, vIndex) in item.value" :value="v.value" :key="vIndex">{{ v.des }}</a-option>
              </a-select>
            </div>
          </div>
        </template>
      </a-form-item>
    </div>
    <a-form-item>
      <a-button type="primary" style="width: 100%;" @click="addCond">{{t('button.add')}}</a-button>
    </a-form-item>
    <a-form-item>
      <a-row style="width: 100%;">
        <a-col :span="6"><a-button type="primary" status="danger" @click="resetCond">{{t('button.reset')}}</a-button></a-col>
        <a-col :span="18" style="text-align: right;">
          <a-space>
            <a-button @click="cancel">{{t('button.cancel')}}</a-button>
            <a-button @click="submit" type="primary">{{t('button.submit')}}</a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form-item>
  </a-form>
</template>

<style scoped lang="less"></style>
