import { BrowserProvider, ethers } from "ethers";

declare global {
  interface Window {
    ethereum: BrowserProvider;
  }
}

// DOG合约-> 0xF408cAae448BD8dab3A0eA1eD7206583F66C18A8
// 挖矿合约-> 0x54166CCA610a54e9afca697f44826be966fB252e
// 流水合约-> 0x4F7D6f4e6Af6Fe8cD5DBeF1be7d1e1cEfb9Dc981

// DOG合约-> 0xF408cAae448BD8dab3A0eA1eD7206583F66C18A8
//   挖矿合约-> 0x20C6F815597531A907a55484fC38e766C85B6a5A
//   流水合约-> 0xC22EB971da61DAb0A54868dD57BB610182D03b7D

const staking_addr = "0x20C6F815597531A907a55484fC38e766C85B6a5A";
const dog_addr = "0xF408cAae448BD8dab3A0eA1eD7206583F66C18A8";
// const see_fee_addr = "0xd1bCfb815e0996aA55e3C057dA54f72e89Ea1ab3"

// const ADDRESS0 = '0x0000000000000000000000000000000000000000'
const ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const USDT = "0x55d398326f99059fF775485246999027B3197955";
const pair = "0x89a06011c8868c503Fae75666386c4e47659f32E";

const IStaking = [
  "function accumulate(address) external view returns (uint256)",
  "function my_speedup(address) external view returns (uint256)",
  "function earned(address _user) external view returns (uint256 reward, uint256 remain_balance, uint256 stake_amount, bool out, uint256 withdrawableAmount)",
  "function isKOL(address user) external view returns (bool)",
  "function nodeLength(address account) external view returns (uint256)",
  "function nodesOf(address, uint256) external view returns (address)",
  "function parentOf(address child) external view returns (address parent)",
  "function userReward(address) external view returns (uint112 balance, uint112 amount, uint32 lastUpdateTime)",
  "function stake_usdt(uint112 _amount, uint256 amountOutMin) external",
  "function stakeWithInviter(uint256 _amount, uint256 amountOutMin, address up) external",
  "function get_reward_all() external",
  "function get_reward_static() external",
  "function withdraw_fee() external",
  "function upgrade_kol() external"
];

const IWEB = [
  "function transfer(address recipient, uint256 amount ) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function decimals() external pure returns (uint8)",
  "function inviter(address user) external view returns (address parent)",
  "function balanceOf(address account) external view returns (uint256)",
  "function totalSupply() external view returns (uint256)",
  "function name() external view returns (string memory)",
  "function symbol() external view returns (string memory)"
];

const swapABI = [
  "function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts)",
  "function getAmountsIn(uint256 amountOut, address[] calldata path) external view returns (uint256[] memory amounts)"
];

const connectMetamask = async () => {
  if (!window.ethereum)
    return {
      error: true,
      msg: "Please link to the wallet environment for use"
    };

  let addressArray;
  try {
    if (window.ethereum.request) {
      addressArray = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      if (addressArray.length !== 0) {
        return addressArray[0];
      }
    }
  } catch (connectError) {
    return {
      error: true,
      msg: connectError
    };
  }
};

//质押usdt
const stakeUSDT = async (_amount: number, parent = null) => {
  if (!window.ethereum) return { error: true, msg: "please connect wallet" };

  const amount = _amount.toString();

  const provider = new ethers.BrowserProvider(window.ethereum);
  const account = await connectMetamask();
  if (typeof account !== "string") return account;

  const value = ethers.parseEther(amount);
  const signer = await provider.getSigner();

  const stake = new ethers.Contract(staking_addr, IStaking, signer);

  const token = new ethers.Contract(USDT, IWEB, signer);

  const bal = await token.balanceOf(account);
  if (value > bal) {
    return { error: true, msg: "Insufficient balance" };
  }

  const allowance = await token.allowance(account, staking_addr);

  if (allowance < value) {
    const tx = await token.approve(staking_addr, ethers.MaxUint256);
    await tx.wait();
  }

  const router = new ethers.Contract(ROUTER, swapABI, provider);
  const [, amount1] = await router.getAmountsOut((value * 33n) / 100n, [
    USDT,
    dog_addr
  ]);
  const pMin = (amount1 * 98n) / 100n;

  let tx;
  if (parent) {
    tx = await stake
      .stakeWithInviter(value, pMin, parent)
      .catch((error: { message: any }) => {
        console.log(error.message);
        return { error: true, msg: "入金失败" };
      });
  } else {
    tx = await stake
      .stake_usdt(value, pMin)
      .catch((error: { message: any }) => {
        console.log(error.message);
        return { error: true, msg: "入金失败" };
      });
  }

  if (tx.error === true) {
    return tx;
  } else {
    const r = await tx.wait();
    return r;
  }
};

//判断此账户是否是节点
const isKOL = async () => {
  if (!window.ethereum) return false;
  const provider = new ethers.BrowserProvider(window.ethereum);
  const account = await connectMetamask();
  if (typeof account !== "string") return account;
  const stake = new ethers.Contract(staking_addr, IStaking, provider);
  const kol = await stake.isKOL(account);
  return kol;
};

//领取所有利息
const withdrawAllReward = async () => {
  if (!window.ethereum) return { error: true, msg: "please connect wallet" };
  const provider = new ethers.BrowserProvider(window.ethereum);
  const account = await connectMetamask();
  if (typeof account !== "string") return account;

  const signer = await provider.getSigner();
  const stake = new ethers.Contract(staking_addr, IStaking, signer);
  const tx = await stake.get_reward_all();
  const r = await tx.wait();
  return r;
};

//升级节点
const joinIn = async () => {
  if (!window.ethereum) return { error: true, msg: "please connect wallet" };
  const provider = new ethers.BrowserProvider(window.ethereum);
  const account = await connectMetamask();
  if (typeof account !== "string") return account;

  const signer = await provider.getSigner();

  const token = new ethers.Contract(USDT, IWEB, signer);

  const allowance = await token.allowance(account, staking_addr);

  if (allowance < 500000000000000000000n) {
    const tx = await token.approve(staking_addr, ethers.MaxUint256);
    await tx.wait();
  }

  const stake = new ethers.Contract(staking_addr, IStaking, signer);
  const tx = await stake.upgrade_kol();
  const r = await tx.wait();
  return r;
};

//待领取的收益
const get_suan_li__dd = async () => {
  if (!window.ethereum) return 0;
  const provider = new ethers.BrowserProvider(window.ethereum);
  const account = await connectMetamask();
  if (typeof account !== "string") return account;
  const stake = new ethers.Contract(staking_addr, IStaking, provider);
  const bal = await stake.earned(account);

  const storg = await stake.userReward(account);
  const accum = await stake.accumulate(account);

  const cap = Number(ethers.formatEther(bal.stake_amount * 2n));
  const dai_ling_qu = Number(ethers.formatEther(bal.reward));
  const liu_shui_qu = Number(ethers.formatEther(bal.withdrawableAmount));
  const dongtai = Number(ethers.formatEther(accum));
  const yi_ling_qu =
    Number(ethers.formatEther(storg.balance)) -
    dai_ling_qu -
    liu_shui_qu +
    dongtai;
  console.log({
    cap,
    dai_ling_qu,
    liu_shui_qu,
    dongtai,
    balance: Number(ethers.formatEther(storg.balance)),
    yi_ling_qu
  });
  return {
    cap: parseFloat(cap.toFixed(4)),
    dai_ling_qu: parseFloat((dai_ling_qu - dongtai).toFixed(4)),
    liu_shui_qu: parseFloat(liu_shui_qu.toFixed(4)),
    yi_ling_qu: parseFloat(yi_ling_qu.toFixed(4)),
    dongtai: parseFloat(dongtai.toFixed(4))
  };
};

//团队加速
const team_speed_up = async () => {
  if (!window.ethereum) return 0;
  const provider = new ethers.BrowserProvider(window.ethereum);
  const account = await connectMetamask();
  if (typeof account !== "string") return account;
  const stake = new ethers.Contract(staking_addr, IStaking, provider);
  const storg = await stake.my_speedup(account);
  const sepdrd = Number(ethers.formatEther(storg));
  return parseFloat(sepdrd.toFixed(4));
};

//查询升级所需的数量、
const min_amount = async () => {
  if (!window.ethereum) return false;
  const provider = new ethers.BrowserProvider(window.ethereum);
  const account = await connectMetamask();
  if (typeof account !== "string") return account;
  const usdt__ = new ethers.Contract(USDT, IWEB, provider);
  const kol = (await usdt__.balanceOf(pair)) as bigint;
  const dd = ethers.formatEther(kol / 100n);
  const cast = (Number(dd) + 1).toFixed(0);
  const plus1 = Number(cast) + 1;
  const min_500 = Math.max(plus1, 500);
  return min_500;
};

export {
  connectMetamask,
  stakeUSDT,
  isKOL,
  withdrawAllReward,
  joinIn,
  get_suan_li__dd,
  team_speed_up,
  min_amount
};
