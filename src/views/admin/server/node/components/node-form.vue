<script setup lang="ts">
import {nextTick, onMounted, reactive, ref} from "vue";
import { useI18n } from 'vue-i18n';
import {QueryRouter,ServerRouter} from "@/api/admin/server/router";
import {defaultNode, PermissionGroup, QueryPermissionGroup, SaveNode} from "@/api/admin/server/node";
import { adminUrl } from "@/utils/admin-url"

const { t } = useI18n();
//权限组
const permissionGroup = ref<PermissionGroup[]>([])
const queryPermissionGroup = async () => {
  const {data} = await QueryPermissionGroup()
  permissionGroup.value = data
}

const inputRef = ref(null);
const showInput = ref(false);

const emit =  defineEmits(['close'])
const props = defineProps(['channelType', 'data','parentServer'])
const show = (channels: string[]) => {
  const b = channels.includes(props.channelType)
  return b
}

const nodeForm = reactive<any>(defaultNode)
const formData = props.data
const parentServer = props.parentServer
const channelType = props.channelType

const close=()=>{
  emit("close")
}
const submitNode = ()=>{
  if (props.channelType === 'hysteria'){
    nodeForm.insecure = 0;
  }else{
    nodeForm.insecure = null;
  }
  SaveNode(nodeForm).then(r=>{
    close()
  })
}
const routerList = ref<ServerRouter[]>()
const queryRouter =()=>{
  QueryRouter().then(r=>{
    routerList.value = r.data
  })
}

onMounted(() => {
  queryPermissionGroup()
  Object.keys(formData).forEach(k => {
    if (formData[k] == null) {
      nodeForm[k] = ""
    } else {
      nodeForm[k] = formData[k]
    }
  })
  queryRouter()
})

</script>
<template>
  <div >
    <a-form layout="vertical" :model="nodeForm" @submit="submitNode">
      <a-row v-if="show(['shadowsocks','vmess','trojan','hysteria'])">
        <a-col :span="13" >
          <a-form-item field="name" :label="t('node.form.name')">
            <a-input v-model="nodeForm.name" :placeholder="t('node.form.name.placeholder')"/>
          </a-form-item>
        </a-col>
        <a-col :span="10" :offset="1" >
          <a-form-item field="rate" :label="t('node.form.rate')">
            <a-input v-model="nodeForm.rate" :placeholder="t('node.form.rate.placeholder')"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item field="tags" :label="t('node.form.tags')" v-if="show(['shadowsocks','vmess','trojan','hysteria'])">
        <a-input-tag :default-value="[]" v-model="nodeForm.tags" :style="{width:'320px'}" :placeholder="t('node.form.tags.placeholder')" allow-clear/>
      </a-form-item>
      <a-form-item v-if="show(['shadowsocks','vmess','trojan','hysteria'])">
        <template #label>
          <span>{{ t('node.form.permission_group') }}</span>
          <router-link :to="'/'+adminUrl+'/server/permission_group'">
            <a-button type="text">{{ t('node.form.add_permission_group') }}</a-button>
          </router-link>
        </template>
        <a-space direction="vertical" size="large">
          <a-select :default-value="[]" :style="{width:'460px'}" v-model="nodeForm.group_id" :scrollbar="true" multiple>
            <div v-for="(item,index) in permissionGroup " :key="index">
              <a-option :value="item.id+''">{{ item.name }}</a-option>
            </div>
          </a-select>
        </a-space>
      </a-form-item>
      <a-form-item field="" :label="t('node.form.address')" v-if="show(['shadowsocks','trojan','hysteria'])">
        <a-input v-model="nodeForm.host" :placeholder="t('node.form.address.placeholder')"/>
      </a-form-item>
      <a-row v-if="show(['vmess'])">
        <a-col :span="11">
          <a-form-item :label="t('node.form.address')">
            <a-input v-model="nodeForm.host" :placeholder="t('node.form.connection_address')"/>
          </a-form-item>
        </a-col>
        <a-col offset="2" :span="11">
          <a-form-item :label="t('node.form.tls')">
            <a-select v-model="nodeForm.tls">
              <a-option :value="0">{{ t('node.form.tls.not_supported') }}</a-option>
              <a-option :value="1">{{ t('node.form.tls.supported') }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>

      </a-row>
      <a-row v-if="show(['shadowsocks','vmess'])">
        <a-col :span="11">
          <a-form-item :label="t('node.form.connection_port')">
            <a-input v-model="nodeForm.port" :placeholder="t('node.form.connection_port.placeholder')"/>
          </a-form-item>
        </a-col>
        <a-col offset="2" :span="11">
          <a-form-item :label="t('node.form.server_port')">
            <a-input v-model="nodeForm.server_port" :placeholder="t('node.form.server_port.placeholder')"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row v-if="show(['trojan','hysteria'])">
        <a-col :span="8">
          <a-form-item :label="t('node.form.connection_port')">
            <a-input v-model="nodeForm.port" :placeholder="t('node.form.connection_port.placeholder')"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="t('node.form.server_port')">
            <a-input v-model="nodeForm.server_port" :placeholder="t('node.form.server_port.placeholder')"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :label="t('node.form.allow_insecure')">
            <a-select :default-value="0" v-model="nodeForm.allow_insecure">
              <a-option :value="0">{{ t('node.form.allow_insecure.no') }}</a-option>
              <a-option :value="1">{{ t('node.form.allow_insecure.yes') }}</a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item :label="t('node.form.server_name')" v-if="show(['trojan','hysteria'])">
        <a-input v-model="nodeForm.server_name" :placeholder="t('node.form.server_name.placeholder')"/>
      </a-form-item>
      <a-form-item :label="t('node.form.transport_protocol')" v-if="show(['vmess'])">
        <a-select v-model="nodeForm.network">
          <a-option value="tcp">TCP</a-option>
          <a-option value="ws">WebSocket</a-option>
          <a-option value="grpc">GRPC</a-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="t('node.form.encryption_algorithm')" v-if="show(['shadowsocks'])">
        <a-select default-value="aes-128-gcm" v-model="nodeForm.cipher">
          <a-option value="aes-128-gcm">aes-128-gcm</a-option>
          <a-option value="aes-192-gcm">aes-192-gcm</a-option>
          <a-option value="aes-256-gcm">aes-256-gcm</a-option>
          <a-option value="chacha20-ietf-poly1305">chacha20-ietf-poly1305</a-option>
          <a-option value="2022-blake3-aes-128-gcm">2022-blake3-aes-128-gcm</a-option>
          <a-option value="2022-blake3-aes-256-gcm">2022-blake3-aes-256-gcm</a-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="t('node.form.obfuscation')" v-if="show(['shadowsocks'])">
        <a-select default-value="" v-model="nodeForm.obfs">
          <a-option value="">{{ t('node.form.obfuscation.none') }}</a-option>
          <a-option value="http">http</a-option>
        </a-select>
      </a-form-item>
      <a-row v-if="nodeForm.obfs">
        <a-col :span="11">
          <a-form-item>
            <a-input v-model="nodeForm.obfs_settings.path" :placeholder="t('node.form.path')"/>
          </a-form-item>
        </a-col>
        <a-col offset="2" :span="11">
          <a-form-item>
            <a-input v-model="nodeForm.obfs_settings.host" :placeholder="t('node.form.host')"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item :label="t('node.form.upstream_bandwidth')" v-if="show(['hysteria'])">
        <a-input v-model="nodeForm.up_mbps" :placeholder="t('node.form.upstream_bandwidth.placeholder')">
          <template #append>
            Mbps
          </template>
        </a-input>
      </a-form-item>
      <a-form-item :label="t('node.form.downstream_bandwidth')" v-if="show(['hysteria'])">
        <a-input v-model="nodeForm.down_mbps" :placeholder="t('node.form.downstream_bandwidth.placeholder')">
          <template #append>
            Mbps
          </template>
        </a-input>
      </a-form-item>
      <a-form-item v-if="show(['shadowsocks','vmess','trojan','hysteria'])">
        <template #label>
          <span style="margin-right: 5px">{{ t('node.form.parent_node') }}</span>
          <icon-book :size="16"/>
        </template>
        <a-select default-value="" v-model="nodeForm.parent_id">
          <a-option value="">{{ t('node.form.parent_node.none') }}</a-option>
          <div v-for="(item,index) in parentServer" :key="index" >
            <a-option :value="item.id" v-if="item.id != nodeForm.id && channelType == item.type">{{ item.name }}</a-option>
          </div>
        </a-select>
      </a-form-item>
      <a-form-item :label="t('node.form.route_group')" v-if="show(['shadowsocks','vmess','trojan','hysteria'])">
        <a-select default-value="" v-model="nodeForm.route_id" :placeholder="t('node.form.route_group.desc')" multiple>
          <a-option v-for="(item,index) in routerList" :key="index" :value="item.id+''">{{ item.remarks }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button @click="close">{{t('button.cancel')}}</a-button>
          <a-button html-type="submit" type="primary">{{ t('node.form.submit') }}</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<style scoped lang="less">

</style>
