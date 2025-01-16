<template>
  <div class="pledge-container">
    <div class="banner">
      <van-image width="100%" height="100%" :src="Banner3" />
      <div class="txt">
        <div class="title">质押Dogking2.0</div>
        <div class="desc">
          质押Dogking2.0根据所有质押数量获得对应占比的市值入金10%的分红。质押为30天一轮，30天后可提出质押dogking2.0，或者不提出持续享受市值入金分红
        </div>
      </div>
    </div>
    <!-- 质押信息卡片 -->
    <div class="stake-card">
      <div class="info-section">
        <div class="info-item">
          <div class="label">{{ t("deposit1") }}</div>
          <div class="value">{{ stakedAmount }} DOGE</div>
        </div>
        <div class="info-item">
          <div class="label">分红</div>
          <div class="value highlight">{{ interest }} USDT</div>
        </div>
      </div>

      <div class="details-section">
        <div class="detail-row">
          <span class="label">{{ t("deposit_time") }}</span>
          <span class="value">{{ formatTime(startTime) }}</span>
        </div>
        <div class="detail-row">
          <span class="label">{{ t("due_time") }}</span>
          <span class="value">{{ formatTime(startTime) }}</span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <!-- <button class="btn stake" @click="handleStake">
          开启质押
        </button> -->
        <button class="btn withdraw" @click="handleStake">解除质押</button>
        <button class="btn claim" @click="handleClaimInterest">
          <!-- :disabled="!interest" -->
          领取分红
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
import Banner3 from "../../assets/banner3.png";
const { t } = useI18n();

// 质押数据
const stakedAmount = ref(0);
const interest = ref(0);
const stakePeriod = ref("--");
const startTime = ref(null);
const apy = ref("--");

const showStakeDialog = ref(false);
const stakeInput = ref("");

// 获取质押数据
const getData = async () => {
  try {
    const res = await getMydata();
    stakedAmount.value = res.amount || 0;
    interest.value = res.interest || 0;
    stakePeriod.value = res.stake_period || "--";
    startTime.value = res.start_time;
    apy.value = res.apy || "--";
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
    uni.showToast({
      title: t("please_enter_amount"),
      icon: "none"
    });
    return;
  }

  try {
    await stakeTokens(stakeInput.value);
    uni.showToast({
      title: t("success"),
      icon: "success"
    });
    getData();
  } catch (error) {
    uni.showToast({
      title: t("fail"),
      icon: "error"
    });
  }
};

const closeStakeDialog = () => {
  showStakeDialog.value = false;
};

// 赎回本金
const handleWithdraw = async () => {
  uni.showModal({
    title: t("prompt"),
    content: t("confirm_withdraw"),
    success: async ({ confirm }) => {
      if (confirm) {
        try {
          await withdrawalPrincipal();
          uni.showToast({
            title: t("success"),
            icon: "success"
          });
          getData();
        } catch (error) {
          uni.showToast({
            title: t("fail"),
            icon: "error"
          });
        }
      }
    }
  });
};

// 提取利息
const handleClaimInterest = async () => {
  if (!interest.value) return;

  uni.showModal({
    title: t("prompt"),
    content: t("confirm_claim_interest"),
    success: async ({ confirm }) => {
      if (confirm) {
        try {
          await claimInterest();
          uni.showToast({
            title: t("success"),
            icon: "success"
          });
          getData();
        } catch (error) {
          uni.showToast({
            title: t("fail"),
            icon: "error"
          });
        }
      }
    }
  });
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
