<script setup lang="ts" name="Tools">
import { onMounted, ref } from "vue";
import "vant/es/toast/style";
import { isKOL, joinIn } from "@/utils/dapp";
import ShequDoge from "@/assets/shequDoge.png";
const isShequ = ref(false);
onMounted(async () => {
  isShequ.value = await isKOL();
});
const handleUpgrad = async () => {
  try {
    await joinIn();
    isShequ.value = await isKOL();
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
    <template v-if="!isShequ">
    <div class="container">
      <div class="title">{{ $t("community_introduction") }}</div>
      <div class="desc">{{ $t("dog_king") }}</div>
      <div
        class="flex items-center justify-between upgrad"
        @click="handleUpgrad"
      >
        <div class="flex flex-wrap content-center justify-center block">
          <div class="unit">$</div>
          <div class="money">6</div>
        </div>
        <div class="upgradeTxt">{{ $t("upgrade_community") }}</div>
        <div class="arrow">
          <span class="arrowRight"></span>
          <span class="arrowRight"></span>
          <span class="arrowRight"></span>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="container2">
      <div class="shadowbg">
        <div>已是社区</div>
        <van-image width="100%" height="100%" :src="ShequDoge" />
      </div>
    </div>
  </template>
</template>
<style scoped lang="less">
.container {
  color: #ffffff;
  padding-top: 90px;
  min-height: 100vh;
  background: url("../../assets/community_bg.png") no-repeat;
  background-size: cover;
  background-position: top center;
}
.container2 {
  color: #ffffff;
  min-height: 100vh;
  // background: #000000;
  // background: url("../../assets/shequBg.png") no-repeat;
  // background-size: contain;
  // background-position: top center;
  .shadowbg {
    position: fixed;
    bottom: 0;
    width: 100%;
    border: 1px solid red;
    box-sizing: border-box;
    // height: 100vh;
    background: url("../../assets/shequBg.png") no-repeat;
    background-size: contain;
    background-position: top center;
    div{
      font-weight: 400;
      font-size: 36px;
      color: #FFFFFF;
      text-align: center;
      padding-bottom: 50px;
    }
  }
}
.title {
  font-weight: bold;
  font-size: 50px;
  color: #ffffff;
  text-align: center;
  margin-top: 80px;
}
.desc {
  font-weight: 400;
  font-size: 24px;
  color: #f4f4f5;
  line-height: 40px;
  margin: 0 27px;
}
.upgrad {
  margin: 0 83px;
  width: 584px;
  height: 134px;
  border-radius: 10px 10px 10px 10px;
  border: 3px solid #f4d144;
  position: fixed;
  bottom: 200px;
  padding: 8px;
  .block {
    width: 116px;
    height: 116px;
    background: #f4d144;
    border-radius: 5px 5px 5px 5px;
    .unit {
      width: 49px;
      height: 49px;
      background: #0c0c0e;
      text-align: center;
      line-height: 49px;
      font-weight: bold;
      font-size: 40px;
      color: #f4d144;
      border-radius: 50%;
    }
    .money {
      font-weight: bold;
      font-size: 40px;
      color: #000000;
      width: 100%;
      text-align: center;
      line-height: 1;
    }
  }
  .upgradeTxt {
    font-weight: bold;
    font-size: 32px;
    color: #f4d144;
  }
  .arrow {
    margin-right: 62px;
    white-space: nowrap;
  }
  .arrowRight {
    display: inline-block;
    width: 22px;
    height: 22px;
    //代码实现右箭头样式 不用背景图
    border: 4px solid #f4d144;
    border-width: 4px 0 0 4px;
    transform: rotate(135deg);
    &:nth-child(2) {
      opacity: 0.6;
    }
    &:nth-child(3) {
      opacity: 0.3;
    }
  }
}
</style>
