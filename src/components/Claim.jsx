import React, { useState } from "react";
import { mnemonicToPrivateKey } from "ton-crypto";
import { TonClient, WalletContractV4, internal, toNano } from "ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { Loader2 } from "lucide-react";
import { BASE_URL } from "../service/baseUrl";

import "./claim.css";

const Claim = ({ user, setUser }) => {
  const [isLoading, setIsLoading] = useState(false);

  const MNEMONIC =
    "upgrade number rather text energy climb rifle slight ask grape move list time depth priority laptop void above aisle mind eagle alcohol situate man";

  const handleClaim = async () => {
    setIsLoading(true);

    try {
      // Get network endpoint
      const endpoint = await getHttpEndpoint({ network: "testnet" });

      // Initialize TON client
      const client = new TonClient({
        endpoint: endpoint,
      });

      // Generate keypair from mnemonic
      const keyPair = await mnemonicToPrivateKey(MNEMONIC.split(" "));

      // Initialize wallet
      const wallet = WalletContractV4.create({
        workchain: 0,
        publicKey: keyPair.publicKey,
      });

      // Get contract
      const contract = client.open(wallet);

      // Get seqno
      const seqno = await contract.getSeqno();

      // Convert balance to nanoTONs
      const amountInNano = toNano(String(user.balance));

      // Send transaction
      await contract.sendTransfer({
        secretKey: keyPair.secretKey,
        seqno: seqno,
        messages: [
          internal({
            to: user.wallet,
            value: amountInNano,
            bounce: false,
            body: "Claim transfer",
          }),
        ],
      });

      // После успешной транзакции отправляем запрос на сервер
      const response = await fetch(`${BASE_URL}users/claim/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update user claim status");
      }

      const updatedUser = await response.json();

      // Обновляем данные пользователя
      setUser(updatedUser);
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFillPercentage = () => {
    if (!user || typeof user.balance !== "number") {
      return 0; // Возвращаем 0, если баланс отсутствует или не является числом
    }
    const balance = Math.min(Math.max(user.balance, 0), 10);
    return (balance / 10) * 100;
  };

  return (
    <div className="wrapper">
      <div className="counterContainer">
        {user && (
          <div className="countTitle">
            Count pressing button: {user.countClicker}
          </div>
        )}
        {user && <div className="countTitle">Your balance {user.balance}</div>}
      </div>
      <div className="counterLine">
        <div
          className="counterFill"
          style={{ width: `${getFillPercentage()}%` }}
        ></div>
      </div>
      <button
        className={`buttonClaim ${isLoading ? "loading" : ""}`}
        onClick={handleClaim}
      >
        {isLoading && <Loader2 className="spinner" />}
        {isLoading ? "" : "Claim"}
      </button>
    </div>
  );
};

export default Claim;
