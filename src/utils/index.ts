import dayjs from "dayjs";
import router from "@/router";
import Cookies from "js-cookie";
import { useClipboard } from "@vueuse/core";
import { showToast } from "vant";
import calc from "calculatorjs";

export const navigateto = (name: string, params = {}) => {
  router.push({ name, query: params });
};
export const navigateBack = () => {
  router.go(-1);
};
export const getRouterParams = () => {
  return router.currentRoute.value.query;
};
export const formatTime = (time: any) => {
  return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
};
export const compareTime = (
  t1: string | number | Date | dayjs.Dayjs | null | undefined,
  t2: string | number | Date | dayjs.Dayjs | null | undefined
) => {
  return dayjs(t1).valueOf() > dayjs(t2).valueOf();
};

export const getInviteCode = () => {
  const url = new URL(window.location.href);
  const inviteCode = url.searchParams.get("invite");
  return inviteCode;
};

export const getCookie = (name: string) => {
  return Cookies.get(name);
};
export const setCookie = (name: string, value: any) => {
  return Cookies.set(name, value);
};

export const handleCopy = (value: any) => {
  const { text, copy, copied, isSupported } = useClipboard();
  copy(value);
  showToast("复制成功");
};

export const multUtil = (a: any, b: any) => {
  if (!a || !b) return 0;
  const mulNum = calc.mul(a, b);
  // 超过六位小数的话保留六位小数
  return mulNum.toFixed(6);
};

export function formatUrl(url: string | string[]) {
  if (!url) return "";
  // 判断是否是https链接 是的话直接return 否的话拼接https链接
  if (url.indexOf("https") === 0) {
    return url;
  } else {
    return "https://hongkongbarter.com/" + url;
  }
}

export const noneOpen = () => {
  showToast({
    message: "暂未开放",
    icon: "warning-o"
  });
};
// 获取当前时间与传入时间的差值
export function getDownTime(
  time: string | number | Date | dayjs.Dayjs | null | undefined
) {
  if (!time) return 0;
  const tTime = dayjs(time).valueOf();
  const diffTime = tTime - dayjs().valueOf();
  if (diffTime > 0) {
    return diffTime;
  } else {
    return 0;
  }
}
// 字符串前后取4位 中间是星号
export function formatAddr(str: string) {
  if (!str || typeof str !== "string") return "";
  let str1 = str.substring(0, 4);
  let str2 = str.substring(str.length - 4, str.length);
  return str1 + "****" + str2;
}
// 获取当前路由的name
export function getRouteName() {
  return router.currentRoute.value.name;
}

export function genId(id: number) {
  return "HK" + ("0000" + id).slice(-5);
}
