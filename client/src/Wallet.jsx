import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, hexToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const newPrivateKey = evt.target.value;
    setPrivateKey(newPrivateKey);
    try {
      const publicKey = secp.getPublicKey(hexToBytes(newPrivateKey));
      const publicKeyWiyhoutFirstByte = publicKey.slice(1);
      const publicKeyHash = keccak256(publicKeyWiyhoutFirstByte);
      const newAddress = `0x${toHex(publicKeyHash.slice(-20))}`;
      console.log(newAddress)
      setAddress(newAddress);
      if (newAddress) {
        const {
          data: { balance },
        } = await server.get(`balance/${newAddress}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    } catch {
      console.log('invalid private key')
    }
  }

  return (
    <div className="container wallet">
      <h1>Your private key</h1>

      <label>
        Private key
        <input placeholder="Type your private key" value={privateKey} onChange={onChange}></input>
      </label>
      { address && <div className="balance">Address: {address}</div> }
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
