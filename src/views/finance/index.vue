<script setup lang="ts">
import { showToast } from "vant";
// import "vant/lib/toast/style";
import Banner1 from "../../assets/banner1.png";
import { ref, onMounted } from "vue";
import { stakeUSDT, get_suan_li__dd, withdrawAllReward } from "@/utils/dapp";
import { useUserStore } from "@/store/modules/user";
import { showConfirmDialog } from "vant";
const userStore = useUserStore();
const proStyle = ref({
  width: "0%",
  transition: "all 3s ease-out"
});
const floatStyle = ref({
  left: "0%",
  transition: "all 3s ease-out",
  opacity: 0
});
const placeholder = ref("单次投资200usdt以上");
const show = ref(false);
const stakeValue = ref("");
const handleStake = async () => {
  if (!stakeValue.value) {
    showToast("请输入金额");
    return;
  }
  if (Number(stakeValue.value) < 200) {
    showToast("单次投资200usdt以上");
    return;
  }
  const res = await stakeUSDT(stakeValue.value, userStore.inviteCode);
  if (res.error) {
    showToast(res.msg);
  }
};
const pageData = ref({});
const jltx = ref(0);
onMounted(async () => {
  const res = await get_suan_li__dd();
  pageData.value = res;
  console.log("🚀 ~ onMounted ~ res:", res);
  const progress = `${(res.yi_ling_qu / res.cap) * 100}%`;

  setTimeout(() => {
    proStyle.value = {
      width: progress,
      transition: "all 3s ease-out"
      // backgroundSize: "40% 100%"
    };
    floatStyle.value = {
      left: progress,
      transition: "all 3s ease-out",
      opacity: 1
    };
  }, 1000);
  // const res2 = await withdrawAllReward();
  // jltx.value = res2;
});
const handleWithDraw = async () => {
  showConfirmDialog({
    title: "温馨提示",
    message: "确定提现吗？"
  }).then(async () => {
    const res = await withdrawAllReward();
    if (res.error) {
      showToast(res.msg);
    } else {
      showToast("提现成功");
    }
  });
};
</script>

<template>
  <div class="container">
    <div class="banner">
      <van-image width="100%" height="100%" :src="Banner1" />
      <div class="txt">
        <div class="title">我的理财</div>
        <div class="desc">
          资金投入后，90%资金回流比值自动打入黑洞，将获得投入资金的2倍额度。
        </div>
      </div>
    </div>

    <div class="progress">
      <div class="pTit">释放进度</div>
      <div class="flex items-center justify-start">
        <div class="pro">
          <div
            class="flex items-center justify-between mask"
            :style="proStyle"
          ></div>
          <div class="floatNum" :style="floatStyle">
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
      <button class="addBtn" @click="handleStake">添加理财</button>
    </div>
    <div class="withdraw">
      <div class="leftTop">可提额度</div>
      <div class="flex items-center justify-between">
        <div class="wLeft">
          <div>静动态：{{ pageData.dai_ling_qu }}</div>
          <div>流水：{{ pageData.liu_shui_qu }}</div>
        </div>
        <div class="wRight">
          <button @click="handleWithDraw">打包提现</button>
          <!-- <div>积累提现：$50065</div> -->
        </div>
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
    width: 482px;
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
      background-position: left;
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
.withdraw {
  margin: 0 35px;
  margin-top: 76px;
  height: 363px;
  background: linear-gradient(180deg, #febe2d 0%, #ff8b00 100%);
  border-radius: 20px 20px 20px 20px;
  background-image: url("../../assets/tx_bg.png");
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
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
    // background: #ffffff;
    background-image: url("../../assets/leftTop.png");
    background-size: contain;
    background-repeat: no-repeat;
  }
  .flex {
    padding: 38px;
    height: 100%;
    box-sizing: border-box;
  }
  .wLeft {
    div {
      font-weight: bold;
      font-size: 36px;
      color: #ffffff;
      margin-bottom: 22px;
    }
  }
  .wRight {
    button {
      width: 206px;
      height: 77px;
      background: #ffffff;
      border-radius: 12px 12px 12px 12px;
      font-weight: 800;
      font-size: 36px;
      color: #fe9005;
      text-align: center;
      line-height: 77px;
      margin-bottom: 13px;
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
