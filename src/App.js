import { TonConnectUIProvider, TonConnectButton } from "@tonconnect/ui-react";
import WalletAddress from "./components/walletAddress";

import "./App.css";
function App() {
  return (
    <div className="App">
      <TonConnectUIProvider manifestUrl="https://res.cloudinary.com/dvt0czglz/raw/upload/v1732548728/utej2bwjvmubpmv5zr0a.json">
        <div className="mainContainer">
          <h1 className="title">Welcome to TON referral App!!!!</h1>

          <TonConnectButton />
          <WalletAddress />
        </div>
      </TonConnectUIProvider>
    </div>
  );
}

export default App;
