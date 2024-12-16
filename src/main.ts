import { createApp } from "vue";
import { store } from "./store";
// normalize.css
import "normalize.css/normalize.css";
// 全局样式
import "./styles/index.less";
// tailwindcss
import "./styles/tailwind.css";
// svg icon
import "virtual:svg-icons-register";
import 'vant/lib/index.css';
import App from "./App.vue";
import router from "./router";
import i18n from "./locales/index"
import "vant/es/toast/style";

import Vant from 'vant';

const app = createApp(App);
app.use(store);
app.use(router);
app.use(i18n);
app.use(Vant);
app.mount("#app");
