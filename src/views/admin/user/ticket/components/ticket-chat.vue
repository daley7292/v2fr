<script setup lang="ts">
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {newTicket, QueryTicketDetails, ReplyTicket, Ticket} from "@/api/admin/user/ticket";
import UserEditForm from "@/views/admin/user/user/components/user-edit-form.vue";
import UserNetworkForm from "@/views/admin/user/user/components/user-network-form.vue";
import {QueryUserDetails} from "@/api/admin/user/user";
import {formatTimestamp} from "../../../../../api/admin/public";

const router = useRoute();
const ticketChats = ref<Ticket>(newTicket)
const queryTicketChats = async () => {
  const {data} = await QueryTicketDetails({id: router.query.id})
  ticketChats.value = data

  document.title = ticketChats.value.subject
}
const taskQueryTicketChats = async () => {
  if (ticketChats.value.status === 0) {
    setTimeout(() => {
      queryTicketChats()
      taskQueryTicketChats()
    }, 3000)
  }
}


const userNetworkModal = ref(false)
const editUserModal = ref(false)
const editUserForm = ref()
const editUser = () => {
  QueryUserDetails({id: ticketChats.value.user_id}).then(r => {
    editUserModal.value = true
    editUserForm.value = r.data
  })
}


const msg = ref('')
const replyMsg = () => {
  if (msg.value) {
    ReplyTicket({id: ticketChats.value.id, message: msg.value}).then(() => {
      msg.value = ''
      queryTicketChats()
      toBottom()
    })
  }
}
const toBottom = () => {
  setTimeout(() => {
    window.scrollTo(0, document.documentElement.scrollHeight)
  }, 500)
}
onMounted(() => {
  queryTicketChats()
  toBottom()
  taskQueryTicketChats()
})
</script>

<template>
  <div>
    <a-modal :width="450" :visible="userNetworkModal" :footer="false" :unmount-on-close="true"
             @cancel="userNetworkModal=false">
      <template #title>
        流量记录
      </template>
      <user-network-form :userid="ticketChats.user_id"/>
    </a-modal>
    <a-drawer :width="420" :visible="editUserModal" @cancel="editUserModal=false" :unmount-on-close="true"
              :footer="false">
      <template #title>
        编辑用户
      </template>
      <user-edit-form :data="editUserForm" @close="editUserModal=false"/>
    </a-drawer>
    <a-row
        style="position: fixed; z-index: 999 ; width: 100%;background-color: #165DFF;color: #ffffff;padding: 5px 20px;">
      <a-col :span="12" style="text-align: left;">
        <h3>{{ ticketChats.subject }}</h3>
      </a-col>
      <a-col :span="12" style="text-align: right;">
        <a-space style="font-size: 28px;line-height: 52px">
          <span @click="editUser"><icon-user/></span>
          <span @click="userNetworkModal=true"><icon-idcard/></span>
        </a-space>
      </a-col>
    </a-row>
    <a-row style="padding: 60px 0 100px 0">
      <a-col>
        <div>
          <div v-for="(item,index) in ticketChats.message" :key="index"
               style="width: 100%;line-height: 26px;position: relative">
            <div v-if="item.user_id === ticketChats.user_id" style="text-align: left;">
              <div class="message-container-left">
                <div class="message-content">{{
                    item.message
                  }}
                </div>
                <div class="message-time"><icon-clock-circle /> &nbsp;{{ formatTimestamp(item.created_at) }}</div>
                <div class="message-block">
                </div>
              </div>
              <div style="clear: both"/>
            </div>
            <div v-else style="text-align: right;position: relative;">
              <div class="message-container-right">
                <div class="message-content">{{ item.message }}
                </div>
                <div class="message-time"> <icon-clock-circle />&nbsp;{{ formatTimestamp(item.created_at) }}</div>
              </div>
              <div style="clear: both"/>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>

    <div v-if="ticketChats.status===0" class="message-input">
      <a-input-search size="large" @press-enter="replyMsg" v-model="msg" @click="replyMsg"
                      placeholder="请输入消息并按下回车发送消息" button-text="发送消息"
                      search-button/>
    </div>
  </div>
</template>

<style scoped lang="less">
.message-container-left {
  background-color: #e0e0e0;
  color: #313131;
  float: left;
  width: fit-content;
  position: relative;
  padding: 8px;
  border-radius: 5px;
  margin: 20px;
}

.message-container-left:after {
  width: 10px;
  transform: rotate(310deg);
  height: 15px;
  background-color: #dedede;
  bottom: -5px;
  position: absolute;
  right: 20px;
  content: ''
}

.message-container-left>.message-time{
  color: #42484d;
}

.message-container-right {
  min-width: 180px;
  background-color: #158ffe;;
  color: white;
  float: right;
  width: fit-content;
  position: relative;
  padding: 8px;
  border-radius: 5px;
  margin: 20px;
}

.message-container-right:after {
  width: 10px;
  transform: rotate(310deg);
  height: 15px;
  background-color: #158ffe;
  bottom: -5px;
  position: absolute;
  right: 20px;
  content: ''
}

.message-time {
  line-height: 18px;
  font-size: 16px;
}

.message-content {
  min-width: 180px;
  font-size: 18px;
  word-wrap: break-word;
}

.message-input {
  position: fixed;
  z-index: 999;
  bottom: 0px;
  left: 0px;
  right: 0px;
  font-size: 32px;
  padding: 20px;
  background-color: white;
  box-shadow: rgb(201 201 201) 1px 1px 16px 8px
}
</style>
<script lang="ts">
export default {
  name: 'TicketChat',
};
</script>
