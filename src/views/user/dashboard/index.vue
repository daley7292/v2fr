<template>
  <div class="container">
    <br/>
    <br/>
    <a-row>
      <a-col :span="22" :offset="1">
        <a-carousel v-if="userNotices && userNotices.length>0" :style="{
          width: '100%',
          height: '240px',
        }">
          <a-carousel-item v-for="item in userNotices">
            <a-card style="height: 230px;background-color: rgb(88 88 88 / 50%);">
              <a-button style="position: absolute;top: 20px;left: 20px" type="primary" status="danger">
                {{ t('userDashboard.notice') }}
              </a-button>
              <div style="position: absolute;bottom: 20px;left: 20px;font-size: 16px;color: white;line-height: 32px">
                <div style="font-size: 20px">{{ item.title }}</div>
                <div>{{ formatYYYYMMDD(item.updated_at) }}</div>
              </div>
            </a-card>
          </a-carousel-item>
        </a-carousel>
        <br />
        <br />
        <div v-if="getSubscribe&&getSubscribe.expired_at">
          <a-card :title="t('userDashboard.subscription.title')">
            <h2 v-if="getSubscribe.plan">{{ getSubscribe.plan.name }}</h2>
            <h2 v-else>其他</h2>
            <p>{{ t('userDashboard.subscription.expireInfo', {
              date: formatYYYYMMDD(getSubscribe.expired_at),
              days: calculateDaysDifference(getSubscribe.expired_at),
              reset_day: getSubscribe.reset_day
            }) }}</p>
            <a-progress status='danger' :percent="((getSubscribe.u + getSubscribe.d) / getSubscribe.transfer_enable) * 100" />
            <h5>{{ t('userDashboard.traffic.used') }}
              <span v-if="((getSubscribe.u + getSubscribe.d) / 1024) < 1">{{ (getSubscribe.u + getSubscribe.d) }} B</span>
              <span v-if="((getSubscribe.u + getSubscribe.d) / 1024) >= 1">{{
                  ((getSubscribe.u + getSubscribe.d) / 1024).toFixed(2)
                }} KB</span>
              <span v-if="((getSubscribe.u + getSubscribe.d) / 1024 / 1024) >= 1">{{
                  ((getSubscribe.u + getSubscribe.d) / 1024 / 1024).toFixed(2)
                }} MB</span>
              <span v-if="((getSubscribe.u + getSubscribe.d) / 1024 / 1024 / 1024) >= 1">{{
                  ((getSubscribe.u + getSubscribe.d) / 1024 / 1024 / 1024).toFixed(2)
                }} GB</span>
              / {{ t('userDashboard.traffic.total') }}
              <span v-if="(getSubscribe.transfer_enable / 1024) < 1">{{ getSubscribe.transfer_enable }} B</span>
              <span v-if="(getSubscribe.transfer_enable / 1024) >= 1 && (getSubscribe.transfer_enable / 1024 / 1024) < 1">{{
                  (getSubscribe.transfer_enable / 1024).toFixed(2)
                }} KB</span>
              <span v-if="(getSubscribe.transfer_enable / 1024 / 1024) >= 1 && (getSubscribe.transfer_enable / 1024 / 1024 / 1024) < 1">{{
                  (getSubscribe.transfer_enable / 1024 / 1024).toFixed(2)
                }} MB</span>
              <span v-if="(getSubscribe.transfer_enable / 1024 / 1024 / 1024) >= 1">{{
                  (getSubscribe.transfer_enable / 1024 / 1024 / 1024).toFixed(2)
                }} GB</span>
            </h5>
          </a-card>
          <br />
          <br />
        </div>
        <a-card :title="t('userDashboard.shortcuts.title')" :body-style="{ padding: '0px' }">
          <div style="text-align: left;">
            <div class="v2-button">
              <div @click="toPage('/docs')">
                <a-row>
                  <a-col :span="18">
                    <span style="font-size: 19px">{{ t('userDashboard.shortcuts.docs.title') }}</span>
                    <p>{{ t('userDashboard.shortcuts.docs.description' , { appName: GetAppName() }) }}</p>
                  </a-col>
                  <a-col :span="6">
                    <div class="v2-button-icon">
                      <icon-book style="font-size: 38px;" />
                    </div>
                  </a-col>
                </a-row>
              </div>
            </div>
            <a-divider style="padding: 0;margin: 0" />
            <div class="v2-button">
              <a-row>
                <a-col :span="18" @click="handlerSubscription">
                  <span style="font-size: 19px">{{ t('userDashboard.shortcuts.subscribe.title') }}</span>
                  <p>{{ t('userDashboard.shortcuts.subscribe.description') }}</p>
                </a-col>
                <a-col :span="6">
                  <div class="v2-button-icon">
                    <icon-share-alt style="font-size: 38px;" />
                  </div>
                </a-col>
              </a-row>
            </div>
            <a-divider style="padding: 0;margin: 0" />
            <div class="v2-button">
              <div @click="toPage('/buy')">
                <a-row>
                  <a-col :span="18">
                    <span style="font-size: 19px">{{ t('userDashboard.shortcuts.buy.title') }}</span>
                    <p>{{ t('userDashboard.shortcuts.buy.description') }}</p>
                  </a-col>
                  <a-col :span="6">
                    <div class="v2-button-icon">
                      <icon-gift style="font-size: 38px;" />
                    </div>
                  </a-col>
                </a-row>
              </div>
            </div>
            <a-divider style="padding: 0;margin: 0" />
            <div class="v2-button">
              <div @click="toPage('/ticket')">
                <a-row>
                  <a-col :span="18">
                    <span style="font-size: 19px">{{ t('userDashboard.shortcuts.ticket.title') }}</span>
                    <p>{{ t('userDashboard.shortcuts.ticket.description') }}</p>
                  </a-col>
                  <a-col :span="6">
                    <div class="v2-button-icon">
                      <icon-customer-service style="font-size: 38px;" />
                    </div>
                  </a-col>
                </a-row>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-modal v-model:visible="showSubscription" :footer="false">
      <div class="v-m">
        <div @click="copyText">
          <icon-copy class="v2-icon" />
          <span>
            {{ t('userDashboard.subscription.modal.copyUrl') }}
          </span>
        </div>
        <a-divider style="margin: 0;padding: 0" />
        <div @click="showQR">
          <icon-qrcode class="v2-icon" />
          <span>
            {{ t('userDashboard.subscription.modal.scanQR') }}
          </span>
        </div>
        <a-divider style="margin: 0;padding: 0" />
        <div @click="openClash">
          <img src="@/assets/images/clash.png" style="height: 30px;width: 30px;" class="v2-icon" />
          <span>{{ t('userDashboard.subscription.modal.importClash') }}</span>
        </div>
        <div>
          <a-button type="primary" style="width: 100%;" size="large" @click="toPage('/docs')">
            {{ t('userDashboard.subscription.modal.viewDocs') }}
          </a-button>
        </div>
      </div>
    </a-modal>
    <a-modal v-model:visible="qrShow" width="250px" :title="t('userDashboard.subscription.qrcode.title')" :footer="false">
      <QrcodeVue :value="getSubscribe?.subscribe_url" :size="200"></QrcodeVue>
      <div>{{ t('userDashboard.subscription.qrcode.description') }}</div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { QueryUserNotice, UserGetSubscribe } from "@/api/user/notice/notice";
import { onMounted, ref } from "vue";
import { useI18n } from 'vue-i18n';
import { calculateDaysDifference, formatTimestamp, formatYYYYMMDD } from "../../../api/admin/public";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import QrcodeVue from 'qrcode.vue'
import { GetAppName } from "@/utils/comm-config";

const { t } = useI18n();

const router = useRouter()
const toPage = (url: string) => {
  router.push(url)
}
const userNotices = ref([])
const queryUserNotice = () => {
  QueryUserNotice().then(r => {

    userNotices.value = r.data
  })
}

const qrShow = ref(false)

const showQR = () => {
  qrShow.value = true
}

const openClash = () => {
  if (getSubscribe.value?.subscribe_url) {
    window.open("clash://install-config?url=" + getSubscribe.value.subscribe_url, "_blank")
  }
}

const showSubscription = ref(false)
const handlerSubscription = () => {
  showSubscription.value = true
}

const copyText = () => {
  if (getSubscribe.value?.subscribe_url) {
    const textToCopy =getSubscribe.value.subscribe_url;

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          Message.success({
            content: t('common.copy.success'),
          });
        })
        .catch((err) => {
          Message.error({
            content: t('common.copy.fail') + ': ' + err.toString(),
          });
        });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.style.position = 'fixed'; // Prevent scrolling to the bottom
      textarea.style.opacity = '0'; // Hide the textarea
      document.body.appendChild(textarea);
      textarea.select();

      try {
        const successful = document.execCommand('copy');
        if (successful) {
          Message.success({
            content: t('common.copy.success'),
          });
        } else {
          throw new Error('Fallback copy failed');
        }
      } catch (err) {
        Message.error({
          content: t('common.copy.fail') + ': ' + err.toString(),
        });
      } finally {
        document.body.removeChild(textarea);
      }
    }
  } else {
    Message.success({
      content: t('userDashboard.copy.notFound')
    })
  }
}


const getSubscribe = ref()
const userGetSubscribe = () => {
  UserGetSubscribe().then(r => {
    getSubscribe.value = r.data
  })
}
onMounted(() => {
  queryUserNotice()
  userGetSubscribe()
})
</script>
<script lang="ts">
export default {
  name: 'UserWorkplace',
};
</script>

<style scoped lang="less">
.container {
  padding: 20px 0;
  padding-top: 0px;
}

.v2-button {
  padding: 20px 20px;
}

.v2-button:hover {
  box-shadow: #9a9a9b 0px 1px 8px;
}

.v2-button-icon {
  width: 100%;
  text-align: right;
  padding-top: 15px
}

.v2-icon {
  font-size: 32px;
  margin-bottom: -10px;
  margin-right: 20px;

}

.v-m>div {
  padding: 20px;
}

.v-m>div:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, .05);
}
</style>
