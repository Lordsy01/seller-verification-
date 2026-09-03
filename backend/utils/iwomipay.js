const axios = require('axios');

const BASE_URL = 'https://www.pay.iwomitechnologies.com/api/iwomipay_sandbox';

let cachedToken = null;
let tokenFetchedAt = 0;
const TOKEN_TTL = 5 * 60 * 1000; // refresh every 5 minutes — the docs don't state an expiry, so we play it safe

async function getToken() {
  if (cachedToken && Date.now() - tokenFetchedAt < TOKEN_TTL) {
    return cachedToken;
  }

  const res = await axios.post(`${BASE_URL}/authenticate`, {
    username: process.env.IWOMIPAY_USERNAME,
    password: process.env.IWOMIPAY_PASSWORD
  });

  if (!res.data.token) {
    throw new Error(res.data.message || 'IwomiPay authentication failed');
  }

  cachedToken = res.data.token;
  tokenFetchedAt = Date.now();
  return cachedToken;
}

// combines apiKey:apiSecret into the single base64 "AccountKey" header the API expects
function getAccountKey(type) {
  let apiKey, apiSecret;

  if (type === 'momo') {
    apiKey = process.env.IWOMIPAY_MOMO_KEY;
    apiSecret = process.env.IWOMIPAY_MOMO_SECRET;
  } else if (type === 'om') {
    apiKey = process.env.IWOMIPAY_OM_KEY;
    apiSecret = process.env.IWOMIPAY_OM_SECRET;
  } else {
    throw new Error(`Unsupported payment type: ${type}`);
  }

  return Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
}

async function initiatePayment({ type, amount, externalId, motif, tel, callbackUrl }) {
  const token = await getToken();
  const accountKey = getAccountKey(type);

  const res = await axios.post(`${BASE_URL}/iwomipay`, {
    op_type: 'credit', // collect money from the customer
    type,               // 'momo' or 'om'
    amount: String(amount),
    external_id: externalId,
    motif,
    tel,
    country: 'cm',
    currency: 'xaf',
    callback_url: callbackUrl
  }, {
    headers: {
      Authorization: token,
      AccountKey: accountKey
    }
  });

  return res.data; // { status, message, external_id, internal_id, redirectUrl }
}

async function checkStatus(internalId) {
  const token = await getToken();

  const res = await axios.get(`${BASE_URL}/iwomipayStatus/${internalId}`, {
    headers: { Authorization: token }
  });

  return res.data;
}

module.exports = { getToken, initiatePayment, checkStatus };