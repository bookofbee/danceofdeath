import axios from 'axios';

export default async function handler(req, res) {
  const { tokenId } = req.query;
  const tokenHex = parseInt(tokenId).toString(16).padStart(64, '0');
  const contract = '0x383fc0c18Ae1282FD2FAE17fe107A6D05390DDeB';
  const rpc = 'https://mainnet.shape.network';

  // TransferSingle event signature hash
  const eventSig = '0xc3d58168c5bfbb65a1e64b420a1cf1472c80b4c3cbbd1f70e4a2ec1e3b1d20c5';

  try {
    const response = await axios.post(rpc, {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getLogs',
      params: [{
        fromBlock: '0x0',
        toBlock: 'latest',
        address: contract,
        topics: [
          eventSig, // TransferSingle
          null,
          '0x0000000000000000000000000000000000000000000000000000000000000000', // from = 0x0 (mint)
          null,
          '0x' + tokenHex // token ID match
        ]
      }]
    });

    const logs = response.data.result || [];

    let total = 0;

    for (const log of logs) {
      const data = log.data; // value is in the last 64 hex chars
      const valueHex = data.slice(-64);
      const value = parseInt(valueHex, 16);
      total += value;
    }

    res.status(200).json({ tokenId, balance: total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from Shape RPC', details: err.message });
  }
}