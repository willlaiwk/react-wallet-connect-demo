import { useEffect, useState } from 'react';
import { useWeb3React } from "@web3-react/core";
import {
  Navbar,
  Button,
  Container,
  Row,
  Col,
  Card,
  FormSelect,
  Stack,
} from "react-bootstrap";
import { connectors } from "./connectors";
import { truncateAddress, toHex } from "./utils";
import { networkParams } from "./networks";
import "./App.css";

function App() {
  const { activate, deactivate, library, active, account, chainId } = useWeb3React();
  const [network, setNetwork] = useState(chainId);
  const [error, setError] = useState("");


  const disconnect = () => {
    setNetwork(undefined);
    deactivate();
  };

  const handleNetworkSelect = (e) => {
    setNetwork(e.target.value ? Number(e.target.value) : undefined);
  };

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(network)]]
          });
        } catch (error) {
          setError(error);
        }
      }
    }
  };

  useEffect(() => {
    setNetwork(chainId);
  }, [chainId, setNetwork]);

  return (
    <>
      <Navbar bg="light">
        <Container>
          <Navbar.Brand>Web3 React Wallet Connect Demo</Navbar.Brand>
        </Container>
      </Navbar>
      <Container style={{ padding: "30px" }}>
        <Button variant="primary" onClick={() => activate(connectors.injected)}>
          MetaMask
        </Button>
        <Button
          style={{ marginLeft: "8px" }}
          variant="primary"
          onClick={() => activate(connectors.walletConnect)}
        >
          Wallet Connect
        </Button>
        <Button
          style={{ marginLeft: "8px" }}
          variant="primary"
          onClick={() => activate(connectors.coinbaseWallet)}
        >
          Coinbase Wallet
        </Button>
        <Button
          style={{ marginLeft: "8px" }}
          variant="danger"
          onClick={disconnect}
        >
          Disconnect
        </Button>
      </Container>
      <Container style={{ paddingTop: "15px" }}>
        <Card>
          <Card.Body>
            <div>
              Connection Status: <span>{active ? "OK" : "Disconnected"}</span>
            </div>
            <div>{`Account: ${account}`}</div>
            <div>{`Network ID: ${chainId ? chainId : "No Network"}`}</div>
          </Card.Body>
        </Card>
      </Container>
      {active && (
        <Container style={{ paddingTop: "15px" }}>
          <Card>
            <Card.Body>
              <Stack direction="horizontal">
                <FormSelect
                  placeholder="Select network"
                  onChange={handleNetworkSelect}
                  value={network || ''}
                >
                <option value="">--- Selection ---</option>
                  <option value="3">Ropsten</option>
                  <option value="4">Rinkeby</option>
                  <option value="42">Kovan</option>
                  <option value="1666600000">Harmony</option>
                  <option value="42220">Celo</option>
                </FormSelect>
                <Button
                  style={{ marginLeft: "8px" }}
                  variant="primary"
                  onClick={switchNetwork}
                  disabled={!network}
                >
                  Switch Network
                </Button>
              </Stack>
            </Card.Body>
          </Card>
        </Container>
      )}
    </>
  );
}

export default App;
