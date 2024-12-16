import { createI18n } from "vue-i18n";
import enUS from "vant/es/locale/lang/en-US";
import zhCn from "vant/es/locale/lang/zh-CN";
import jaJP from "vant/es/locale/lang/ja-JP";
import koKR from "vant/es/locale/lang/ko-KR";
import en from "./en";
import ja from "./ja.js";
import ko from "./ko";
import zh from "./zh-cn";
import { getCookie } from "@/utils"
export default createI18n({
  locale: getCookie("lang") || "zh",
  messages: {
    en: {
      ...en,
      ...enUS
    },
    ja: {
      ...ja,
      ...jaJP
    },
    ko: {
      ...ko,
      ...koKR
    },
    zh: {
      ...zh,
      ...zhCn
    }
  },
  legacy: false
});
