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
    <a-modal :width="530" :visible="userNetworkModal" :footer="false" :unmount-on-close="true"
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
        style="position: fixed; z-index: 999 ; width: 100%;background-color: #f8f9fa!important;font-size: 18px;line-height: 60px ;font-weight: normal ;padding: 5px 20px;">
      <a-col :span="12" style="text-align: left;line-height: 60px">
        <div>{{ ticketChats.subject }}</div>
      </a-col>
      <a-col :span="12" style="text-align: right;">
        <a-space style="font-size: 22px;font-weight: normal ;line-height: 52px">
          <span @click="editUser"><icon-user /></span>
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
                <div class="message-time" style="margin-left: 12px">{{ formatTimestamp(item.created_at) }}</div>
                <div class="message-content message-container-left-content">{{
                    item.message
                  }}
                </div>
                <div class="message-block">
                </div>
              </div>
              <div style="clear: both"/>
            </div>
            <div v-else style="text-align: right;position: relative;">
              <div class="message-container-right">
                <div class="message-time"  style="margin-right: 18px"> &nbsp;&nbsp;&nbsp;&nbsp;{{ formatTimestamp(item.created_at) }}</div>
                <div class="message-content-right message-container-right-content">{{ item.message }}
                </div>
              </div>
              <div style="clear: both"/>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>

    <div  class="message-input">
      <input type="text" class="input"  placeholder="输入内容回复工单..." v-model="msg" @keyup.enter="replyMsg"/>
    </div>
  </div>
</template>

<style scoped lang="less">
.message-container-left {
  float: left;
  width: fit-content;
  position: relative;
  padding: 8px;
  border-radius: 5px;
  margin: 5px 20px;
}

.message-container-left:after {
  width: 10px;
  transform: rotate(310deg);
  height: 15px;
  position: absolute;
  right: 20px;
  content: ''
}


.message-container-left-content {
  background-color: #e4efd8!important;
  color: #313131;
  float: left;
  width: fit-content;
  position: relative;
  padding: 8px;
  border-radius: 5px;
  margin: 10px;
}


.message-container-left>.message-time{
  font-size: 13px;
  color: #5f6468;
}

.message-container-right {
  float: right;
  width: fit-content;
  position: relative;
  padding: 8px;
  margin: 2px 20px;
}



.message-container-right-content {
  background-color: #f4f4f4 !important;
  color: #313131;
  width: fit-content;
  position: relative;
  padding: 8px;
  border-radius: 5px;
  margin: 2px 10px;
}

.message-time {
  color: #666666;
  line-height: 18px;
  font-size: 15px;
}

.message-content {
  font-size: 16px;
  word-wrap: break-word;
}

.message-content-right {
  float: right;
  font-size: 16px;
  word-wrap: break-word;
}

.message-input {
  position: fixed;
  z-index: 999;
  bottom: 0px;
  left: 0px;
  right: 0px;
  font-size: 32px;
  height: 55px;
}

.input {
  width: 100%;
  height: 55px;
  line-height: 55px;
  font-size: 16px;
  border: none;
  outline: none;
  background-color: #e4e9f3 !important;
  padding-left: 35px;
}

.input:focus {
  border: none;
  outline: none;
}

.input::placeholder {
  font-size: 18px;
  color: #777777;
  background-color: #e4e9f3 !important;
}

</style>
<script lang="ts">
export default {
  name: 'TicketChat',
};
</script>
