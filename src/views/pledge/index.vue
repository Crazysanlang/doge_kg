<template>
  <div class="pledge-container">
    <div class="banner">
      <van-image width="100%" height="100%" :src="Banner3" />
      <div class="txt">
        <div class="title">{{ t("pledge_dogking2") }}</div>
        <div class="desc">
          {{ t("pledge_dogking2_desc") }}
        </div>
      </div>
    </div>
    <div class="stake-card">
      <div class="info-section">
        <div class="info-item">
          <div class="label">{{ t("deposit1") }}</div>
          <div class="value">{{ stakedAmount }} DOGE</div>
        </div>
        <div class="info-item">
          <div class="label">{{ t("dividend") }}</div>
          <div class="value highlight">{{ interest }} USDT</div>
        </div>
      </div>

      <div class="details-section">
        <div class="detail-row">
          <span class="label">{{ t("deposit_time") }}</span>
          <span class="value">{{ startTime }}</span>
        </div>
      </div>
      <div class="action-buttons">
        <button
          v-if="stakedAmount === 0"
          class="btn stake"
          @click="handleStake"
        >
          {{ t("open_pledge") }}
        </button>
        <button v-else class="btn withdraw" @click="handleWithdraw">
          {{ t("withdraw_pledge") }}
        </button>
        <button class="btn claim" :disabled="!interest" @click="handleClaimInterest">
          {{ t("claim_dividend") }}
        </button>
      </div>
    </div>

    <van-dialog
      v-model:show="showStakeDialog"
      :title="t('deposit1')"
      show-cancel-button
      @confirm="confirmStake"
      @cancel="closeStakeDialog"
    >
      <view style="padding: 60px 0">
        <van-field
          v-model="stakeInput"
          type="number"
          :placeholder="t('please_input_deposit')"
        />
      </view>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import {
  getMydata,
  stakeTokens,
  withdrawalPrincipal,
  claimInterest
} from "@/utils/dapp";
import Banner3 from "../../assets/banner3.jpg";
import { showConfirmDialog, showToast } from "vant";
const { t } = useI18n();

// 质押数据
const stakedAmount = ref(0);
const interest = ref(0);
const startTime = ref(null);

const showStakeDialog = ref(false);
const stakeInput = ref("");

// 获取质押数据
const getData = async () => {
  try {
    const res = await getMydata();
    console.log(res);
    stakedAmount.value = res.stakeAmount || 0;
    interest.value = res.withdrawable || 0;
    startTime.value = formatTime(res.stakeTime);
  } catch (error) {
    console.error(error);
  }
};

// 质押本金
const handleStake = () => {
  stakeInput.value = "";
  showStakeDialog.value = true;
};

const confirmStake = async () => {
  if (!stakeInput.value) {
    showToast(t("please_enter_amount"));
    return;
  }

  try {
    const res = await stakeTokens(stakeInput.value);
    if (res.error) {
      showToast(res.msg);
      return;
    }
    showToast(t("operation_success"));
    getData();
  } catch (error) {
    showToast(t("operation_failure"));
  }
};

const closeStakeDialog = () => {
  showStakeDialog.value = false;
};

// 赎回本金
const handleWithdraw = async () => {
  try {
    await showConfirmDialog({
      title: t("prompt"),
      message: t("confirm_withdraw")
    });

    const res = await withdrawalPrincipal();
    if (res.error) {
      showToast(res.msg);
      return;
    }
    showToast(t("operation_success"));
    getData();
  } catch (error) {
    if (error.cancel) return; // User cancelled the dialog
    showToast(t("operation_failure"));
  }
};

// 提取利息
const handleClaimInterest = async () => {
  if (!interest.value) return;

  try {
    await showConfirmDialog({
      title: t("prompt"),
      message: t("confirm_claim_interest")
    });

    const res = await claimInterest();
    if (res.error) {
      showToast(res.msg);
      return;
    }
    showToast(t("operation_success"));
    getData();
  } catch (error) {
    if (error.cancel) return; // User cancelled the dialog
    showToast(t("operation_failure"));
  }
};

const formatTime = time => {
  if (!time) return "--";
  return dayjs(time * 1000).format("YYYY-MM-DD HH:mm");
};

onMounted(() => {
  getData();
});
</script>

<style lang="scss" scoped>
.pledge-container {
  //   background: #f5f7fa;
  min-height: 100vh;
  // padding-top: 100px;
}
.banner {
  height: 460px;
  position: relative;
}
.txt {
  padding: 0 34px;
  color: #ffffff;
  position: absolute;
  bottom: -120px;
  .title {
    font-weight: bold;
    font-size: 50px;
    color: #ffffff;
  }
  .desc {
    font-weight: 400;
    font-size: 24px;
    color: #f4f4f5;
    line-height: 40px;
  }
}
.stake-card {
  margin: 32px;
  margin-top: 150px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.info-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;

  .info-item {
    text-align: center;
    flex: 1;

    .label {
      color: #fff;
      font-size: 28px;
      margin-bottom: 8px;
    }

    .value {
      font-size: 38px;
      font-weight: bold;
      //   color: #333;
      color: #fff;

      &.highlight {
        color: #2196f3;
      }
    }
  }
}

.details-section {
  background: #23262f;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;

  .detail-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    .label {
      //   color: #666;
      color: #fff;
    }

    .value {
      //   color: #333;
      color: #fff;
      font-weight: 500;
    }
  }
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  .btn {
    padding: 12px;
    border-radius: 8px;
    border: none;
    font-size: 30px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s;

    &:active {
      opacity: 0.8;
    }

    &.stake {
      background: #4caf50;
      color: white;
    }

    &.withdraw {
      background: #ff9800;
      color: white;
    }

    &.claim {
      background: #2196f3;
      color: white;

      &:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
    }
  }
}
</style>
