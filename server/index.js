const express = require("express");
const app = express();
const cors = require("cors");

const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");

const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x0ef47aa9d263390b199301bc430a05574b17b73b": 50, // privateKey 5d0ce1cab5b67e2cf169be3fbf4c63bb05f130aa474b64a0ddb270d1e3c848f9
  "0xf6a6bf54657e8dd171553ca4ec8d7b3f3c1cd8ce": 75, // 9f6090b8a7db743f16c0f825d23a0488ad61ad0fe5203d8efe120b98bd48edf7
  "0xf4c710788dd87b11d18a4b1f429afc81630de935": 100, // 7c6f43ea2397e886943ac9c0dca5dbc58b2bc55d01b74eb57ade397d8a186cfd
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res)  => {
  const { sender, recipient, amount, signature, recoveryBit} = req.body;

  const bytesArray = utf8ToBytes(amount.toString());

  const signatureArray = [];
  Object.keys(signature).forEach(key => signatureArray.push(signature[key]))
  const publicKey = await secp.recoverPublicKey(keccak256(bytesArray), Uint8Array.from(signatureArray), recoveryBit);

  const publicKeyWiyhoutFirstByte = publicKey.slice(1);
  const publicKeyHash = keccak256(publicKeyWiyhoutFirstByte);
  const address = publicKeyHash.slice(-20);

  if (`0x${toHex(address)}` === sender) {
    setInitialBalance(sender);
    setInitialBalance(recipient);
  
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(403).send({ message: "Not your funds!" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
