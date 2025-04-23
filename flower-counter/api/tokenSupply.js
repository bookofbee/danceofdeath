import axios from 'axios';

export default async function handler(req, res) {
  const { tokenId } = req.query;
  const contract = "0x383fc0c18Ae1282FD2FAE17fe107A6D05390DDeB";
  const alchemyApi = "https://shape-mainnet.g.alchemy.com/v2/rAq0Y_hENR59WLQgEpKLJnC8tXIP4wMt";

  try {
    const response = await axios.post(alchemyApi, {
      jsonrpc: "2.0",
      id: 1,
      method: "alchemy_getTokenBalances",
      params: [contract, [`${contract}-${tokenId}`]]
    });

    const balance = response.data?.result?.tokenBalances?.[0]?.tokenBalance || "0";
    res.status(200).json({ tokenId, balance });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch token supply", details: error.message });
  }
}