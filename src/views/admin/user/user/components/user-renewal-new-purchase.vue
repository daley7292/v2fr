<template>
  <div class="user-renewal-container">
    <!-- User Info Card -->
    <div class="user-info-card">
      <h2>{{ t('user.userInfo') }}</h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">{{ t('user.id') }}:</span>
          <span class="value">{{ data.user_info.id }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ t('user.email') }}:</span>
          <span class="value">{{ data.user_info.email }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ t('user.commissionRate') }}:</span>
          <span class="value">{{ data.user_info.commission_rate?data.user_info.commission_rate+'%':'暂无' }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ t('user.commissionBalance') }}:</span>
          <span class="value">{{ formatCurrency(data.user_info.commission_balance) }}</span>
        </div>
      </div>
    </div>

    <!-- Statistics Table -->
    <div class="statistics-table">
      <h2>{{ t('user.periodStatistics') }}</h2>
      <table>
        <thead>
        <tr>
          <th>{{ t('user.period') }}</th>
          <th colspan="3">{{ t('user.newPurchase') }}</th>
          <th colspan="3">{{ t('user.renewal') }}</th>
          <th colspan="3">{{ t('user.upgrade') }}</th>
          <th colspan="3">{{ t('user.total') }}</th>
        </tr>
        <tr>
          <th></th>
          <th>{{ t('user.count') }}</th>
          <th>{{ t('user.amount') }}</th>
          <th>{{ t('user.commission') }}</th>
          <th>{{ t('user.count') }}</th>
          <th>{{ t('user.amount') }}</th>
          <th>{{ t('user.commission') }}</th>
          <th>{{ t('user.count') }}</th>
          <th>{{ t('user.amount') }}</th>
          <th>{{ t('user.commission') }}</th>
          <th>{{ t('user.count') }}</th>
          <th>{{ t('user.amount') }}</th>
          <th>{{ t('user.commission') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(period, key) in data.statistics" :key="key">
          <td>{{ period.period_name }}</td>
          <td>{{ period.new_purchase.count }}</td>
          <td>{{ formatCurrency(period.new_purchase.amount) }}</td>
          <td>{{ formatCurrency(period.new_purchase.commission) }}</td>
          <td>{{ period.renewal.count }}</td>
          <td>{{ formatCurrency(period.renewal.amount) }}</td>
          <td>{{ formatCurrency(period.renewal.commission) }}</td>
          <td>{{ period.upgrade.count }}</td>
          <td>{{ formatCurrency(period.upgrade.amount) }}</td>
          <td>{{ formatCurrency(period.upgrade.commission) }}</td>
          <td>{{ period.total.count }}</td>
          <td>{{ formatCurrency(period.total.amount) }}</td>
          <td>{{ formatCurrency(period.total.commission) }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Totals Summary -->
    <div class="totals-summary">
      <h2>{{ t('user.totalStatistics') }}</h2>
      <div class="summary-grid">
        <div class="summary-card">
          <h3>{{ t('user.newPurchase') }}</h3>
          <div class="summary-item">
            <span class="label">{{ t('user.count') }}:</span>
            <span class="value">{{ data.totals.new_purchase.count }}</span>
          </div>
          <div class="summary-item">
            <span class="label">{{ t('user.amount') }}:</span>
            <span class="value">{{ formatCurrency(data.totals.new_purchase.amount) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">{{ t('user.commission') }}:</span>
            <span class="value">{{ formatCurrency(data.totals.new_purchase.commission) }}</span>
          </div>
        </div>

        <div class="summary-card">
          <h3>{{ t('user.renewal') }}</h3>
          <div class="summary-item">
            <span class="label">{{ t('user.count') }}:</span>
            <span class="value">{{ data.totals.renewal.count }}</span>
          </div>
          <div class="summary-item">
            <span class="label">{{ t('user.amount') }}:</span>
            <span class="value">{{ formatCurrency(data.totals.renewal.amount) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">{{ t('user.commission') }}:</span>
            <span class="value">{{ formatCurrency(data.totals.renewal.commission) }}</span>
          </div>
        </div>
        <div class="summary-card">
          <h3>{{ t('user.upgrade') }}</h3>
          <div class="summary-item">
            <span class="label">{{ t('user.count') }}:</span>
            <span class="value">{{ data.totals.upgrade.count }}</span>
          </div>
          <div class="summary-item">
            <span class="label">{{ t('user.amount') }}:</span>
            <span class="value">{{ formatCurrency(data.totals.upgrade.amount) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">{{ t('user.commission') }}:</span>
            <span class="value">{{ formatCurrency(data.totals.upgrade.commission) }}</span>
          </div>
        </div>

        <div class="summary-card total">
          <h3>{{ t('user.grandTotal') }}</h3>
          <div class="summary-item">
            <span class="label">{{ t('user.count') }}:</span>
            <span class="value">{{ data.totals.new_purchase.count + data.totals.renewal.count }}</span>
          </div>
          <div class="summary-item">
            <span class="label">{{ t('user.amount') }}:</span>
            <span class="value">{{ formatCurrency(data.totals.new_purchase.amount + data.totals.renewal.amount) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">{{ t('user.commission') }}:</span>
            <span class="value">{{ formatCurrency(data.totals.new_purchase.commission + data.totals.renewal.commission) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">{{ t('user.commission') }}:</span>
            <span class="value">{{ formatCurrency(data.totals.upgrade.commission + data.totals.upgrade.commission) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps(['data']);
const data = ref(props.data);

// Format currency with 2 decimal places
const formatCurrency = (value: number): string => {
  return value.toFixed(2);
};
</script>

<style scoped lang="less">
.user-renewal-container {
  width: 100%;
  padding: 20px;

  h2 {
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: 600;
  }

  .user-info-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      .info-item {
        display: flex;

        .label {
          font-weight: 500;
          margin-right: 8px;
          min-width: 120px;
        }

        .value {
          color: #333;
        }
      }
    }
  }

  .statistics-table {
    background-color: #fff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow-x: auto;

    table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: 10px;
        text-align: center;
        border: 1px solid #eee;
      }

      th {
        background-color: #f7f7f7;
        font-weight: 500;
      }

      tbody tr:hover {
        background-color: #f9f9f9;
      }
    }
  }

  .totals-summary {
    background-color: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;

      .summary-card {
        padding: 16px;
        border-radius: 6px;
        background-color: #f9f9f9;

        h3 {
          margin-bottom: 12px;
          font-size: 16px;
          font-weight: 500;
          text-align: center;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;

          .label {
            font-weight: 500;
          }

          .value {
            font-weight: 600;
          }
        }

        &.total {
          background-color: #f0f7ff;

          .value {
            color: #1976d2;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr !important;
  }

  .summary-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>