import { BrowserProvider, Eip1193Provider, ethers } from "ethers";

declare global {
  interface Window {
    ethereum: Eip1193Provider & BrowserProvider;
  }
}
const staking_addr = "0xF0B86EDe76D7943d972D40926C2949F3c0dE269c";
const dog_addr = "0xE4C310b9a1Fa747bb649cD76EaD58D94EE75123C";
// const see_fee_addr = "0xd1bCfb815e0996aA55e3C057dA54f72e89Ea1ab3"

// const ADDRESS0 = '0x0000000000000000000000000000000000000000'
const ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const USDT = "0x55d398326f99059fF775485246999027B3197955";

const IStaking = [
  "function accumulate(address) external view returns (uint256)",
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
const stakeUSDT = async (amount: string, parent = null) => {
  if (!window.ethereum) return { error: true, msg: "please connect wallet" };

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

  if (allowance.lt(value)) {
    const tx = await token.approve(staking_addr, ethers.constants.MaxUint256);
    await tx.wait();
  }

  const router = new ethers.Contract(ROUTER, swapABI, provider);
  const [, amount1] = await router.getAmountsOut(value.mul("42").div("100"), [
    USDT,
    dog_addr
  ]);
  const pMin = amount1.mul(98).div(100);

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

  if (allowance < 5000000000000000000n) {
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

  const cap = Number(ethers.formatEther(bal.stake_amount * 2n));
  const dai_ling_qu = Number(ethers.formatEther(bal.reward));
  const liu_shui_qu = Number(ethers.formatEther(bal.withdrawableAmount));
  const yi_ling_qu = cap - Number(ethers.formatEther(storg.balance));
  return {
    cap: cap.toFixed(4),
    dai_ling_qu: dai_ling_qu.toFixed(4),
    liu_shui_qu: liu_shui_qu.toFixed(4),
    yi_ling_qu: yi_ling_qu.toFixed(4)
  };
};

export {
  connectMetamask,
  stakeUSDT,
  isKOL,
  withdrawAllReward,
  joinIn,
  get_suan_li__dd
};
