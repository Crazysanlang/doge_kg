<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import closeIcon from "@/assets/closeIcon.png";
import { navigateto, formatAddr, getCookie, setCookie } from "@/utils/index";
import { showToast } from "vant";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/store/modules/user";
import i18n from "@/locales/index";
const {
  global: { t }
} = i18n;
const userStore = useUserStore();
const router = useRouter();
// 获取当前路由name
const routerName = ref(useRouter().currentRoute.value.name);
// 获取当前路由title
const title = ref(useRouter().currentRoute.value.meta?.title);
// 路由变化时title 动态取值

const { locale } = useI18n();
console.log("🚀 ~ locale:", locale.value);
const onClickLanague = (lang: any) => {
  locale.value = lang;
  setCookie("lang", "en");
  showCenter.value = false;
  showToast(t("operation_success"));
};

const showLeft = ref(false);
const showCenter = ref(false);

watch(
  () => router.currentRoute.value,
  () => {
    title.value = router.currentRoute.value.meta?.title;
    routerName.value = router.currentRoute.value.name;
  }
);
// 监听语言切换
watch(
  () => locale.value,
  val => {
    title.value = router.currentRoute.value.meta?.title;
  }
);

const handleNavigateto = (name: string) => {
  navigateto(name);
  showLeft.value = false;
};
const isLogin = computed(() => userStore.isLogin);
// 监听userstore 的address 变化
watch(
  () => isLogin.value,
  val => {
    console.log("🚀 ~ watch ~ val:", val);
  }
);
async function handleLink() {
  await userStore.login();
}
onMounted(() => {
  userStore.login();
});
</script>

<template>
  <div class="flex items-center justify-between box">
    <div class="boxLeft">
      <div
        class="flex items-center justify-center select"
        @click="showLeft = true"
      >
        {{ title }} <span class="arrowDow"></span>
      </div>
    </div>
    <div class="flex items-center justify-center boxRight">
      <img src="../../assets/setting.png" alt="" />
      <img src="../../assets/bnb.png" alt="" />
      <img @click="showCenter = true" src="../../assets/language.png" alt="" />
      <button class="connect" v-if="!userStore.address" @click="handleLink">
        {{ $t("link_wallet") }}
      </button>
      <button class="connect whitespace-nowrap" v-else>
        {{ formatAddr(userStore.address) }}
      </button>
    </div>
  </div>
  <van-popup
    v-model:show="showLeft"
    position="left"
    :closeable="true"
    :close-icon="closeIcon"
    :style="{ width: '50%', height: '100%' }"
  >
    <div class="slider">
      <div class="router">
        <div
          class="routerItem"
          :class="routerName == 'Finance' ? 'active' : ''"
          @click="handleNavigateto('Finance')"
        >
          {{ $t("my_investment") }}
        </div>
        <div
          class="routerItem"
          :class="routerName == 'Team' ? 'active' : ''"
          @click="handleNavigateto('Team')"
        >
          {{ $t("my_team") }}
        </div>
        <div
          class="routerItem"
          :class="routerName == 'Community' ? 'active' : ''"
          @click="handleNavigateto('Community')"
        >
          {{ $t("my_community") }}
        </div>
      </div>
      <div class="bottomBg"></div>
    </div>
  </van-popup>
  <van-popup
    :closeable="true"
    :close-icon="closeIcon"
    v-model:show="showCenter"
    round
  >
    <div class="langue">
      <div
        @click="onClickLanague('en')"
        :class="locale == 'en' ? 'active' : ''"
      >
        <img src="../../assets/en.png" alt="" /><span> English</span>
      </div>
      <div
        @click="onClickLanague('zh')"
        :class="locale == 'zh' ? 'active' : ''"
      >
        <img src="../../assets/china.png" alt="" /><span>中文</span>
      </div>
      <div
        @click="onClickLanague('ja')"
        :class="locale == 'ja' ? 'active' : ''"
      >
        <img src="../../assets/ja.png" alt="" /> <span>日本語</span>
      </div>
      <div
        @click="onClickLanague('ko')"
        :class="locale == 'ko' ? 'active' : ''"
      >
        <img src="../../assets/ko.png" alt="" /> <span>한국어</span>
      </div>
    </div>
  </van-popup>
</template>

<style scoped lang="scss">
.langue {
  width: 504px;
  height: 508px;
  padding-top: 100px;
  box-sizing: border-box;
  background: linear-gradient(180deg, #f4d144 0%, #f9b327 62%, #ff8b00 100%);
  border-radius: 44px 44px 44px 44px;
  background-image: url("../../assets/languageBg.png");
  background-size: contain;
  background-repeat: no-repeat;
  div {
    margin: 14px 26px;
    height: 75px;
    border-radius: 8px 8px 8px 8px;
    border: 2px solid #000000;
    font-weight: normal;
    font-size: 32px;
    color: #000000;
    text-align: center;
    line-height: 75px;
    img {
      width: 57px;
      height: 38px;
      margin-right: 8px;
      display: inline-block;
    }
    span {
      display: inline-block;
      width: 100px;
      text-align: left;
    }
    &.active {
      background: #ffffff;
    }
  }
}
.router {
  // padding-top: 357px;
  top: 20%;
  left: 0;
  right: 0;
  margin: 0 34px;
  position: absolute;
  z-index: 2;
  .routerItem {
    font-weight: bold;
    font-size: 32px;
    color: #000000;
    height: 81px;
    line-height: 81px;
    // min-width: 330px;
    // padding-left: 42px;
    text-align: center;
    box-sizing: border-box;
    border-radius: 10px 10px 10px 10px;
    border: 2px solid #040608;
    margin-bottom: 65px;
    transition: all 0.3s;
    padding: 0 10px;
    &.active {
      background: #000000;
      font-weight: bold;
      font-size: 32px;
      color: #f4d144;
    }
  }
}
.slider {
  width: 100%;
  height: 100%;
  background: #f4d144;
  background-image: url("../../assets/sliderBg.png");
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  .bottomBg {
    width: 100%;
    height: 664px;
    background-image: url("../../assets/bottomBg.png");
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
    left: 0;
    bottom: -1px;
    z-index: 1;
  }
}
.box {
  padding: 0 24px;
  height: 88px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2;
  .select {
    min-width: 207px;
    padding: 0 10px;
    height: 52px;
    border: 2px solid #f3ba2f;
    border-radius: 30px;
    font-weight: 400;
    font-size: 24px;
    color: #ffffff;
    .arrowDow {
      display: inline-block;
      margin-left: 10px;
      margin-top: -10px;
      width: 14px;
      height: 14px;
      border: 2px solid #ffffff;
      border-width: 4px 0 0 4px;
      transform: rotate(225deg);
      vertical-align: middle;
    }
  }
  .boxRight {
    img {
      width: 42px;
      height: 42px;
      margin-right: 27px;
    }
    .connect {
      min-width: 155px;
      padding: 0 8px;
      height: 52px;
      background: #f4d144;
      border-radius: 30px 30px 30px 30px;
      font-weight: 500;
      font-size: 28px;
      color: #121212;
    }
  }
}
</style>
