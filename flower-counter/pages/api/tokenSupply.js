import axios from 'axios';

export default async function handler(req, res) {
  const { tokenId } = req.query;
  const contract = '0x383fc0c18Ae1282FD2FAE17fe107A6D05390DDeB';
  const alchemyApi = 'https://shape-mainnet.g.alchemy.com/v2/rAq0Y_hENR59WLQgEpKLJnC8tXIP4wMt';

  const data = '0xbd85b039' + tokenId.toString(16).padStart(64, '0');

  try {
    const response = await axios.post(alchemyApi, {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_call',
      params: [
        {
          to: contract,
          data: data
        },
        'latest'
      ]
    });

    const hex = response.data.result;
    const supply = parseInt(hex, 16);

    res.status(200).json({ tokenId, balance: supply });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch token supply', details: err.message });
  }
}