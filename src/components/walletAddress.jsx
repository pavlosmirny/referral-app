import React, { useEffect, useState } from "react";
import { useTonAddress } from "@tonconnect/ui-react";
import "./address.css";
import axios from "axios";
import CopyJsCodeComponent from "./CopyJsCodeComponent";
import Claim from "./Claim";
import { BASE_URL } from "../service/baseUrl";

const WalletAddress = () => {
  const userFriendlyAddress = useTonAddress();
  // console.log(userFriendlyAddress);

  const [user, setUser] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.post(
          `${BASE_URL}users/${userFriendlyAddress}`
        );
        setUser(resp.data);
      } catch (error) {
        console.error("Network error occurred:", error);
      }
    };

    fetchData();
  }, [userFriendlyAddress]);

  return (
    <>
      {userFriendlyAddress && (
        <div className="address">
          <h4 className="text">
            Take advantage of this unique opportunity to earn with our referral
            program! Simply embed the code on your website or app, and the more
            people click on our button, the more you earn. Once your balance
            reaches 10 TON, you can withdraw your earnings directly to your
            blockchain wallet.
          </h4>

          <Claim user={user} setUser={setUser} />
          <CopyJsCodeComponent user={user} />
        </div>
      )}
    </>
  );
};

export default WalletAddress;
