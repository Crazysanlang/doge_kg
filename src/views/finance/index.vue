<script setup lang="ts">
import { showToast, showNotify } from "vant";
import "vant/lib/toast/style";
import "vant/lib/notify/style";
import Banner1 from "../../assets/banner1.png";
import { ref, onMounted, computed } from "vue";
import { stakeUSDT, get_suan_li__dd, withdrawAllReward } from "@/utils/dapp";
import { useUserStore } from "@/store/modules/user";
import { showConfirmDialog, showLoadingToast } from "vant";
import i18n from "@/locales/index";
const {
  global: { t }
} = i18n;
const userStore = useUserStore();
const proStyle = ref({
  width: "0%",
  transition: "all 3s ease-out"
});
const floatStyle = ref({
  left: "0%",
  marginLeft: "0",
  transition: "all 3s ease-out",
  opacity: 0
});
const placeholder = computed(() => t("invest_more"));
const show = ref(false);
const stakeValue = ref("");
const handleStake = async () => {
  if (!stakeValue.value) {
    showNotify({ type: "warning", message: t("please_input") });
    return;
  }
  // if (Number(stakeValue.value) < 200) {
  //   showNotify({ type: 'warning', message: t('invest_more') });
  //   return;
  // }
  const loading = showLoadingToast({
    message: '加载中...',
    forbidClick: true,
  });
  const res = await stakeUSDT(stakeValue.value, userStore.inviteCode);
  loading.close();
  if (res.error) {
    showToast(res.msg);
  } else {
    showToast(t("stake_success"));
    setTimeout(() => {
      stakeValue.value = "";
    }, 1000);
  }
};
const pageData = ref({});
const floatRef = ref(null);
onMounted(async () => {
  const halfWidth1 = floatRef.value.getBoundingClientRect().width / 2 - 3;
  floatStyle.value = {
    ...floatStyle.value,
    marginLeft: `-${halfWidth1}px`
  };
  const res = await get_suan_li__dd();
  const format: any = {};
  for (const key in res) {
    format[key] = res[key] || 0;
  }
  pageData.value = format;
  const progress = `${(pageData.value.yi_ling_qu / pageData.value.cap) * 100}%`;
  setTimeout(() => {
    const halfWidth2 = floatRef.value.getBoundingClientRect().width / 2 + 2;
    proStyle.value = {
      width: progress,
      transition: "all 3s ease-out"
    };

    floatStyle.value = {
      left: progress,
      marginLeft: `-${
        pageData.value.yi_ling_qu == 0 ? halfWidth1 : halfWidth2
      }px`,
      transition: "all 3s ease-out",
      opacity: 1
    };
  }, 1000);
});
const handleWithDraw = async () => {
  showConfirmDialog({
    title: t("warm_tips"),
    message: t("confirm_withdrawal"),
    width: "100%"
  }).then(async () => {
    const res = await withdrawAllReward();
    if (res.error) {
      showToast(res.msg);
    } else {
      showToast(t("withdrawal_success"));
    }
  });
};
</script>

<template>
  <div class="container">
    <div class="banner">
      <van-image width="100%" height="100%" :src="Banner1" />
      <div class="txt">
        <div class="title">{{ $t("my_investment") }}</div>
        <div class="desc">{{ $t("investment_double") }}</div>
      </div>
    </div>

    <div class="progress">
      <div class="pTit">{{ $t("release_progress") }}</div>
      <div class="flex items-center justify-start">
        <div class="pro">
          <div
            class="flex items-center justify-between mask"
            :style="proStyle"
          ></div>
          <div ref="floatRef" class="floatNum" :style="floatStyle">
            {{ pageData.yi_ling_qu }}
          </div>
        </div>
        <div class="allNum">{{ pageData.cap }}</div>
      </div>
    </div>
    <div class="flex items-center justify-between add">
      <van-field
        v-model="stakeValue"
        :placeholder="placeholder"
        type="number"
        :border="false"
        readonly
        clickable
        @touchstart.stop="show = true"
      />
      <van-number-keyboard
        v-model="stakeValue"
        :show="show"
        :extra-key="['.']"
        :maxlength="10"
        @blur="show = false"
      />
      <button class="addBtn" @click="handleStake">
        {{ $t("add_investment") }}
      </button>
    </div>
    <div class="withdrawTit">{{ $t("quota_withdrawal") }}</div>
    <div class="flex items-center justify-between withdraw">
      <div class="flex content-center wLeft">
        <div>{{ $t("real_time") }}：{{ pageData.dai_ling_qu || "-" }}</div>
        <div>{{ $t("share_acceleration") }}：{{ pageData.dongtai || "-" }}</div>
        <div>
          {{ $t("water_acceleration") }}：{{ pageData.liu_shui_qu || "-" }}
        </div>
      </div>
      <div class="wRight">
        <button @click="handleWithDraw">{{ $t("pack_withdrawal") }}</button>
        <!-- <div>积累提现：$50065</div> -->
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.container {
  padding-bottom: 100px;
}
.banner {
  height: 500px;
  position: relative;
}
.txt {
  padding: 0 34px;
  color: #ffffff;
  position: absolute;
  bottom: 0;
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
.progress {
  margin: 0 35px;
  margin-top: 115px;
  .pTit {
    font-weight: bold;
    font-size: 36px;
    color: #ffffff;
    margin-bottom: 68px;
  }
  .allNum {
    font-weight: 800;
    font-size: 36px;
    color: #ffffff;
    margin-left: 10px;
  }
  .pro {
    width: 500px;
    height: 44px;
    background: #23262f;
    border-radius: 20px;
    background: #23262f;
    position: relative;
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url("../../assets/progress_bg.png");
      background-repeat: no-repeat;
      background-position: right;
      background-size: auto 100%;
      // transform: rotate(180deg);
      color: #ffffff;
      border-radius: 20px;
    }
    .floatNum {
      position: absolute;
      min-width: 66px;
      padding: 0 10px;
      height: 60px;
      text-align: center;
      // line-height: 60px;
      top: -60px;
      left: 0;
      z-index: 2;
      background-image: url("../../assets/pro.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      font-weight: 800;
      font-size: 28px;
      color: #f4d144;
    }
  }
}
.add {
  height: 122px;
  background: #23262f;
  border-radius: 10px 10px 10px 10px;
  padding: 0 19px 0 25px;
  margin: 0 35px;
  margin-top: 105px;
  ::v-deep input {
    background: transparent;
    height: 100%;
    color: #ffffff;
    font-size: 26px;
  }

  .addBtn {
    width: 233px;
    height: 80px;
    background: #f4d144;
    border-radius: 15px 15px 15px 15px;
    text-align: center;
    line-height: 80px;
    font-weight: bold;
    font-size: 30px;
    color: #050b18;
  }
}
.withdrawTit {
  margin: 0 35px;
  margin-top: 85px;
  font-weight: bold;
  font-size: 36px;
  color: #ffffff;
}
.withdraw {
  margin: 0 35px;
  margin-top: 46px;
  min-height: 310px;
  background: linear-gradient(180deg, #febe2d 0%, #ff8b00 100%);
  border-radius: 20px 20px 20px 20px;
  background-image: url("../../assets/tx_bg.png");
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
  padding: 0 20px;
  box-sizing: border-box;
  .leftTop {
    position: absolute;
    top: 0;
    left: 0;
    font-weight: bold;
    font-size: 30px;
    color: #fe8f03;
    width: 207px;
    height: 72px;
    text-align: center;
    padding-right: 20px;
    line-height: 52px;
    background-image: url("../../assets/leftTop.png");
    background-size: contain;
    background-repeat: no-repeat;
  }
  .wLeft {
    flex-wrap: wrap;
    div {
      text-align: left;
      width: 100%;
      font-weight: bold;
      font-size: 30px;
      color: #ffffff;
      // margin-bottom: 22px;
    }
  }
  .wRight {
    button {
      min-width: 206px;
      height: 77px;
      background: #ffffff;
      border-radius: 12px 12px 12px 12px;
      font-weight: 800;
      font-size: 36px;
      color: #fe9005;
      text-align: center;
      line-height: 77px;
      margin-bottom: 13px;
      white-space: nowrap;
      padding: 0 5px;
    }
    div {
      font-weight: 400;
      font-size: 20px;
      color: #ffffff;
      text-align: center;
    }
  }
}
</style>
