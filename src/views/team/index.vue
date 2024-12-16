<script setup lang="ts" name="About">
import Banner2 from "../../assets/banner2.png";
import { ref, onMounted } from "vue";
import { formatAddr, handleCopy } from "@/utils";
import { useUserStore } from "@/store/modules/user";
import { http } from "@/utils/http";

const userStore = useUserStore();
let linkAdress = ref("");
function renderlink() {
  const url = window.location.origin;
  linkAdress.value = url + "/?invite=" + userStore.address;
}
const list = ref([
  {
    addr: "12800000000000000",
    tui_jian_ren_shu: 24,
    tui_jian_ren_shu_zong: 24,
    team_ye_ji_hao: "$24"
  }
]);
function queryData() {
  const params = {
    url: "https://dog-king.com/api/info",
    method: "get",
    params: { address: userStore.address }
  }
  http.request(params).then((res) => {
    console.log("🚀 ~ http.request ~ res:", res)
    
  });
}
onMounted(() => {
  renderlink();
  queryData();
});
</script>

<template>
  <div class="pageBox">
    <div class="banner">
      <van-image width="100%" height="100%" :src="Banner2" />
      <div class="txt">
        <div class="title">我的团队</div>
        <div class="desc">
          您可以在此处绑定邀请关系，也可以复制邀请链接邀请好友加入。当您和您的朋友每天都有新的货币持有量时，您可以获得促销奖励。
        </div>
      </div>
    </div>
    <div class="inviteTit">邀请链接</div>
    <div class="flex items-center justify-center inviteBox">
      <div>{{ linkAdress }}</div>
      <img @click="handleCopy(linkAdress)" src="../../assets/copy.png" alt="" />
    </div>
    <div class="tips">参与dog king低于$200，无邀请权益</div>
    <div class="flex justify-start flexbox">
      <div class="flex items-center justify-center">
        <img src="../../assets/team1.png" alt="" />
        <div class="text">
          <div>推荐人数</div>
          <div>24</div>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <img src="../../assets/team2.png" alt="" />
        <div class="text">
          <div>团队业绩</div>
          <div>$24</div>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <img src="../../assets/team3.png" alt="" />
        <div class="text">
          <div>团队人数</div>
          <div>375</div>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <img src="../../assets/team4.png" alt="" />
        <div class="text">
          <div>团队加速</div>
          <div>$812</div>
        </div>
      </div>
    </div>
    <div class="tdjx">团队绩效</div>
    <div class="teamList">
      <div class="tHeader">
        <div class="">地址</div>
        <div class="">推荐</div>
        <div class="">团队</div>
        <div class="">业绩</div>
      </div>
      <div class="tBody">
        <div class="list" v-for="(item, index) in list" :key="index">
          <div class="">{{ formatAddr(item.addr) }}</div>
          <div class="">{{ item.tui_jian_ren_shu || "-" }}</div>
          <div class="">{{ item.tuan_dui_ren_shu || "-" }}</div>
          <div class="">{{ item.tuan_dui_ye_ji || "-" }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.pageBox {
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
.inviteTit {
  font-weight: bold;
  font-size: 36px;
  color: #ffffff;
  margin: 63px 0 20px 37px;
}
.inviteBox {
  margin: 0 37px;
  padding: 25px;
  min-height: 80px;
  background: #23262f;
  border-radius: 10px 10px 10px 10px;
  font-weight: 400;
  font-size: 28px;
  color: #ffffff;
  div{
    word-break: break-all;
    padding-right: 10px;
  }
  img {
    width: 45px;
    height: 45px;
  }
}
.tips {
  margin: 0 62px;
  font-weight: 400;
  font-size: 24px;
  color: #8e8e95;
  margin-top: 24px;
}
.flexbox {
  gap: 24px;
  flex-wrap: wrap;
  padding: 0 35px;
  margin-top: 90px;
  .flex {
    width: 328px;
    height: 192px;
    background: #23262f;
    border-radius: 20px 20px 20px 20px;
    margin-bottom: 30px;
  }
  img {
    width: 84px;
    height: 83px;
    margin-right: 24px;
  }
  .text {
    div:first-child {
      font-weight: 400;
      font-size: 24px;
      color: #b1b5c3;
    }
    div:last-child {
      font-weight: 400;
      font-size: 36px;
      color: #fcfcfd;
    }
  }
}
.teamList {
  margin: 20px 36px;
}

.tHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: 60px;
  div {
    flex: 1;
    font-weight: 400;
    font-size: 32px;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
  }

  div:first-child {
    text-align: left;
  }
}
.list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: 80px;
  div {
    flex: 1;
    font-weight: 400;
    font-size: 24px;
    color: #ffffff;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }

  div:first-child {
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.tdjx {
  font-weight: 600;
  font-size: 32px;
  color: #ffffff;
  padding-left: 40px;
  margin-top: 40px;
}
</style>
