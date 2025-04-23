import axios from 'axios';

export default async function handler(req, res) {
  const { tokenId } = req.query;

  if (!tokenId) {
    return res.status(400).json({ error: "Missing tokenId in query" });
  }

  const contract = "0x383fc0c18Ae1282FD2FAE17fe107A6D05390DDeB";
  const alchemyApi = "https://shape-mainnet.g.alchemy.com/v2/rAq0Y_hENR59WLQgEpKLJnC8tXIP4wMt";

  try {
    const response = await axios.post(alchemyApi, {
      jsonrpc: "2.0",
      id: 1,
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          toBlock: "latest",
          contractAddresses: [contract],
          category: ["erc1155"],
          withMetadata: false,
          excludeZeroValue: true,
          maxCount: "0x3e8" // limit to 1000 events
        }
      ]
    });

    const transfers = response.data.result || [];
    let count = 0;

    for (const tx of transfers) {
      if (
        tx.rawContract &&
        tx.rawContract.tokenId === tokenId &&
        tx.from === "0x0000000000000000000000000000000000000000"
      ) {
        count += parseInt(tx.value || "1");
      }
    }

    res.status(200).json({ tokenId, balance: count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch token mints', details: err.message });
  }
}