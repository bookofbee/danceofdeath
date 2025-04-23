import axios from 'axios';

export default async function handler(req, res) {
  const { tokenId } = req.query;
  const tokenHex = parseInt(tokenId).toString(16).padStart(64, '0');
  const contract = '0x383fc0c18Ae1282FD2FAE17fe107A6D05390DDeB';
  const rpc = 'https://mainnet.shape.network';

  const transferBatchSig = '0x4a39dc06d4c0dbc64b70b843d2a041627da6c6f6e3b5b369d5d5d6b4f38e3b67';
  const mintingFromAddress = '0x559fF7f5b6e2c0133faDDe58F5e4a493d92F8469'.toLowerCase().padStart(64, '0');
  const mintingTopic = '0x' + mintingFromAddress;

  let total = 0;

  try {
    const batchResponse = await axios.post(rpc, {
      jsonrpc: '2.0',
      id: 2,
      method: 'eth_getLogs',
      params: [{
        fromBlock: '0x0',
        toBlock: 'latest',
        address: contract,
        topics: [
          transferBatchSig,
          null,
          mintingTopic
        ]
      }]
    });

    const batchLogs = batchResponse.data.result || [];

    for (const log of batchLogs) {
      const data = log.data.slice(2); // remove '0x'
      const itemCount = (data.length / 64) / 2;
      const ids = [];
      const values = [];

      for (let i = 0; i < itemCount; i++) {
        const idHex = data.slice(i * 64, (i + 1) * 64);
        const valHex = data.slice((itemCount + i) * 64, (itemCount + i + 1) * 64);
        ids.push(parseInt(idHex, 16));
        values.push(parseInt(valHex, 16));
      }

      for (let i = 0; i < ids.length; i++) {
        if (ids[i] === parseInt(tokenId)) {
          total += values[i];
        }
      }
    }

    res.status(200).json({ tokenId, balance: total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from Shape RPC', details: err.message });
  }
}