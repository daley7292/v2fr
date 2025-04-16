<script setup lang="ts">
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {newTicket, Ticket} from "@/api/admin/user/ticket";
import {formatTimestamp} from "../../../../../api/admin/public";
import {QueryUserTicket, UserTicketReply} from "@/api/user/finance/ticket";

const router = useRoute();
const ticketChats = ref<Ticket>(newTicket)
const queryTicketChats = async () => {
  const {data} = await QueryUserTicket({id: router.query.id})
  ticketChats.value = data
  document.title = ticketChats.value.subject
}
const taskQueryTicketChats = async () => {
  if (ticketChats.value.status === 0) {
    setTimeout(() => {
      queryTicketChats()
      taskQueryTicketChats()
    }, 5000)
  }
}


const msg = ref('')
const replyMsg = () => {
  if (msg.value) {
    UserTicketReply({id: ticketChats.value.id, message: msg.value}).then(() => {
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
  taskQueryTicketChats()
  queryTicketChats()
  toBottom()
})
</script>

<template>
  <div>
    <a-row
        style="position: fixed; z-index: 999 ; width: 100%;background-color: #165DFF;color: #ffffff;padding: 5px 20px;">
      <a-col :span="24" style="text-align: left;">
        <h3>{{ ticketChats.subject }}</h3>
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
                <div class="message-time">
                  <icon-clock-circle/> &nbsp;{{ formatTimestamp(item.created_at) }}
                </div>
                <div class="message-block">
                </div>
              </div>
              <div style="clear: both"/>
            </div>
            <div v-else style="text-align: right;position: relative;">
              <div class="message-container-right">
                <div class="message-content">{{ item.message }}
                </div>
                <div class="message-time">
                  <icon-clock-circle/>&nbsp;{{ formatTimestamp(item.created_at) }}
                </div>
              </div>
              <div style="clear: both"/>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>

    <div v-if="ticketChats.status==0" class="message-input">
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

.message-container-left > .message-time {
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
