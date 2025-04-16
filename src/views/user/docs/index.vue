<template>
  <div class="container">
    <a-card>
      <a-input-search placeholder="搜索文档" @change="searchKnowledge" search-button/>
      <a-list style="margin-top: 20px">
        <template #header>
          General
        </template>
        <a-list-item @click="showDetails(item)" v-for="(item,index) in docs">
          <h3>{{ item.title }}</h3>
          <span style="opacity: 0.7;">最后更新 {{ formatTimestamp(item.updated_at) }}</span>
        </a-list-item>
      </a-list>
    </a-card>
    <a-drawer width="70%"  :visible="showDocDetails.show" @cancel="showDocDetails.show = false" :footer="false">
      <div v-html="showDocDetails.html"></div>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import {General, UserKnowledgeFetch} from "@/api/user/docs/docs";
import {formatTimestamp} from "../../../api/admin/public";

const docs = ref()

const showDocDetails = reactive({
  show: false,
  html: ''
})

const searchKnowledge = (value:string)=>{
  UserKnowledgeFetch({language: 'zh-CN',keyword:value}).then(r => {
    docs.value = r.data.General
  })
}

const queryKnowledge = () => {
  UserKnowledgeFetch({language: 'zh-CN'}).then(r => {
    docs.value = r.data.General
  })
}

const showDetails = (values: General) => {
  UserKnowledgeFetch({language: 'zh-CN', id: values.id}).then(r => {
    showDocDetails.html =r.data.body+""
    showDocDetails.show = true
  })
}

onMounted(() => {
  queryKnowledge()
})
</script>
<script lang="ts">
export default {
  name: 'UserDocs',
};
</script>

<style scoped lang="less">
.container {
  padding: 20px;
}
</style>
