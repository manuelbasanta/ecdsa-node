const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

const createWallet = () => {
  const privateKey = secp.utils.randomPrivateKey();
  const publicKey = secp.getPublicKey(privateKey);
  const publicKeyWiyhoutFirstByte = publicKey.slice(1);
  const publicKeyHash = keccak256(publicKeyWiyhoutFirstByte);
  const address = publicKeyHash.slice(-20);
  return {
    privateKey: toHex(privateKey),
    address: `0x${toHex(address)}`
  }
}

for(let i = 0; i < 3; i++) {
  console.log(createWallet())
}