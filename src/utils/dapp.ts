import { BrowserProvider, ethers } from "ethers";

declare global {
  interface Window {
    ethereum: BrowserProvider;
  }
}

const staking_addr = "0x7c0d50A422Dd82b0d83CfbFfF5da6f605C7983D4";
const dog_addr = "0xFC8b95B64327716fA9061Fd5ce0D012595d64885";
const new_addr = "0x5422eA6c373dcfFe735eDF7ceFB08ef02C0D0CB6";

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
  "function re_stake() external",
  "function nodeLength(address account) external view returns (uint256)",
  "function nodesOf(address, uint256) external view returns (address)",
  "function parentOf(address child) external view returns (address parent)",
  "function userReward(address) external view returns (uint112 balance, uint112 amount, uint32 lastUpdateTime)",
  "function stake_usdt(uint112 _amount, uint256 amountOutMin) external",
  "function stakeWithInviter(uint256 _amount, uint256 amountOutMin, address up) external",
  "function get_reward_all(bool isU) external",
  "function get_reward_static(bool isU) external",
  "function withdraw_fee(bool isU) external",
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

const INEW = [
  "function createShare(uint256 value) external",
  "function burnShare() external",
  "function withdrawDividendOfUser() public returns (uint256)",

  "function withdrawableDividendOf(address _owner) public view returns (uint256)",
  "function withdrawnDividendOf(address _owner) public view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function lastStakTime(address account) external view returns (uint256)"
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

  // const router = new ethers.Contract(ROUTER, swapABI, provider);
  // const [, amount1] = await router.getAmountsOut((value * 33n) / 100n, [
  //   USDT,
  //   dog_addr
  // ]);
  // const pMin = (amount1 * 98n) / 100n;

  let tx;
  if (parent) {
    tx = await stake
      .stakeWithInviter(value, 0n, parent)
      .catch((error: { message: any }) => {
        console.log(error.message);
        return { error: true, msg: "入金失败" };
      });
  } else {
    tx = await stake.stake_usdt(value, 0n).catch((error: { message: any }) => {
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
const withdrawAllReward = async (isusdt: boolean) => {
  if (!window.ethereum) return { error: true, msg: "please connect wallet" };
  const provider = new ethers.BrowserProvider(window.ethereum);
  const account = await connectMetamask();
  if (typeof account !== "string") return account;

  const signer = await provider.getSigner();
  const stake = new ethers.Contract(staking_addr, IStaking, signer);
  const tx = await stake.get_reward_all(isusdt);
  const r = await tx.wait();
  return r;
};

//复投
const restaking = async () => {
  if (!window.ethereum) return { error: true, msg: "please connect wallet" };
  const provider = new ethers.BrowserProvider(window.ethereum);
  const account = await connectMetamask();
  if (typeof account !== "string") return account;

  const signer = await provider.getSigner();
  const stake = new ethers.Contract(staking_addr, IStaking, signer);
  const tx = await stake.re_stake();
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
  return 500;
};

const getMydata = async () => {
  if (!window.ethereum) return { error: true, msg: "please connect wallet" };
  const account = await connectMetamask();
  const provider = new ethers.BrowserProvider(window.ethereum);
  const newsk = new ethers.Contract(new_addr, INEW, provider);
  const stakeAmount = await newsk.balanceOf(account);
  const withdrawable = await newsk.withdrawableDividendOf(account);
  const stakeTime = await newsk.lastStakTime(account);
  return {
    stakeAmount: Number(ethers.formatEther(stakeAmount)),
    withdrawable: Number(ethers.formatEther(withdrawable)),
    stakeTime
  };
};
const stakeTokens = async (_amount: number) => {
  if (!window.ethereum) return { error: true, msg: "please connect wallet" };

  const amount = _amount.toString();

  const provider = new ethers.BrowserProvider(window.ethereum);
  const account = await connectMetamask();
  if (typeof account !== "string") return account;

  const value = ethers.parseEther(amount);
  const signer = await provider.getSigner();

  const newsk = new ethers.Contract(new_addr, INEW, signer);

  const token = new ethers.Contract(dog_addr, IWEB, signer);

  const bal = await token.balanceOf(account);
  if (value > bal) {
    return { error: true, msg: "Insufficient balance" };
  }

  const allowance = await token.allowance(account, new_addr);

  if (allowance < value) {
    const tx = await token.approve(new_addr, ethers.MaxUint256);
    await tx.wait();
  }

  const tx = await newsk.createShare(value).catch((error: { message: any }) => {
    console.log(error.message);
    return { error: true, msg: "入金失败" };
  });

  if (tx.error === true) {
    return tx;
  } else {
    const r = await tx.wait();
    return r;
  }
};
const withdrawalPrincipal = async () => {
  if (!window.ethereum) return { error: true, msg: "please connect wallet" };
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const newsk = new ethers.Contract(new_addr, INEW, signer);
  const tx = await newsk.burnShare().catch((error: { message: any }) => {
    console.log(error.message);
    return { error: true, msg: "提取失败" };
  });

  if (tx.error === true) {
    return tx;
  } else {
    const r = await tx.wait();
    return r;
  }
};

const claimInterest = async () => {
  if (!window.ethereum) return { error: true, msg: "please connect wallet" };
  await connectMetamask();
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const newsk = new ethers.Contract(new_addr, INEW, signer);
  const tx = await newsk
    .withdrawDividendOfUser()
    .catch((error: { message: any }) => {
      console.log(error.message);
      return { error: true, msg: "提取失败" };
    });

  if (tx.error === true) {
    return tx;
  } else {
    const r = await tx.wait();
    return r;
  }
};

export {
  connectMetamask,
  stakeUSDT,
  isKOL,
  withdrawAllReward,
  joinIn,
  get_suan_li__dd,
  team_speed_up,
  min_amount,
  getMydata,
  stakeTokens,
  withdrawalPrincipal,
  claimInterest,
  restaking
};
