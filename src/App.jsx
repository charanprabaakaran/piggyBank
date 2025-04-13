import { useState } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "./abi";
import "./App.css";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState("0.0");
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
        setStatus("✅ Wallet connected");
      } else {
        alert("Please install MetaMask");
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Wallet connection failed");
    }
  };

  const getContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  };

  const deposit = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.deposit({ value: ethers.parseEther("0.01") });
      setStatus("⏳ Sending deposit...");
      await tx.wait();
      setStatus("✅ Deposited 0.01 ETH!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Deposit failed");
    }
  };

  const getBalance = async () => {
    try {
      const contract = await getContract();
      const bal = await contract.getBalance();
      setBalance(ethers.formatEther(bal));
      setStatus("✅ Balance fetched");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to get balance");
    }
  };

  const withdraw = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.withdraw();
      setStatus("⏳ Processing withdrawal...");
      await tx.wait();
      setStatus("✅ Withdrawal complete!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Withdrawal failed");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setBalance("0.0");
    setStatus("👋 Wallet disconnected");
  };
  

  return (
    <div className="app-container">
      <h1>🪙 ETH Piggy Bank</h1>

      {!walletAddress ? (
        <button className="btn primary-btn" onClick={connectWallet}>
          🔗 Connect Wallet
        </button>
      ) : (
        <div className="wallet-info">
          <p className="wallet-address">🔐 {walletAddress}</p>
          <div className="btn-group">
            <button className="btn" onClick={deposit}>💰 Deposit 0.01 ETH</button>
            <button className="btn" onClick={getBalance}>📊 Get Balance</button>
            <button className="btn" onClick={withdraw}>🏧 Withdraw</button>
          </div>
          <p className="balance-display">💼 Balance: {balance} ETH</p>
        </div>
      )}

      <p className="status-message">{status}</p>
    </div>
  );
}

export default App;
