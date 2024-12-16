import { defineStore } from "pinia";
import { getInviteCode, getCookie, setCookie, navigateto } from "@/utils/index";
import { connectMetamask } from "@/utils/dapp";
export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    token: getCookie("token") || "",
    address: getCookie("address") || "",
    inviteCode: getCookie("inviteCode") || ""
  }),
  getters: {
    isLogin(state) {
      return state.token !== "";
    }
  },
  actions: {
    async login() {
      try {
        const address = await connectMetamask();
        this.setAddress(address);
        const inviteCode = getInviteCode();
        if (inviteCode) {
          this.setInviteCode(inviteCode);
        }
      } catch (error) {
        console.log("🚀 ~ error:", error);
      }
    },
    logout() {
      this.setToken("");
      this.setAddress("");
      navigateto("root");
    },
    setAddress(address: string) {
      this.address = address;
      setCookie("address", address);
    },
    setToken(token: string) {
      this.token = token;
      setCookie("token", token);
    },
    setInviteCode(inviteCode: string) {
      this.inviteCode = inviteCode;
      setCookie("inviteCode", inviteCode);
    },
    getToken() {
      return this.token;
    },
    async getAddress() {
      const address = await connectMetamask();
      if (address !== this.address) {
        this.logout();
      } else {
        this.setAddress(address);
      }
      return address;
    }
  }
});
