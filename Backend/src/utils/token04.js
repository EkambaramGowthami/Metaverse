import crypto from "crypto";

/**
 * Generate ZEGOCLOUD token (token04 version)
 * 
 * @param {number} appId - Your ZEGOCLOUD appId
 * @param {string} userId - The user ID
 * @param {string} secret - Server Secret (must be 32 characters)
 * @param {number} effectiveTimeInSeconds - Valid duration of token
 * @param {string} [payload=""] - Optional payload (e.g., roomId)
 * @returns {string} token
 */
export function generateToken04(appId, userId, secret, effectiveTimeInSeconds, payload = "") {
  if (!userId) {
    throw new Error("userId is empty");
  }

  if (!appId || appId === 0) {
    throw new Error("appId is invalid");
  }

  if (!secret || secret.length !== 32) {
    throw new Error("secret must be a 32-character string");
  }

  const createTime = Math.floor(Date.now() / 1000);
  const randomInt = Math.floor(Math.random() * 0x7fffffff);

  const tokenInfo = {
    app_id: appId,
    user_id: userId,
    nonce: randomInt,
    ctime: createTime,
    expire: createTime + effectiveTimeInSeconds,
    payload: payload
  };

  const buffer = generateHmac(tokenInfo, secret);
  const base64Token = Buffer.from(buffer).toString("base64");

  return base64Token;
}

function generateHmac(tokenInfo, secret) {
  const textEncoder = new TextEncoder();

  const appIdBuffer = new DataView(new ArrayBuffer(8));
  appIdBuffer.setBigUint64(0, BigInt(tokenInfo.app_id));

  const nonceBuffer = new DataView(new ArrayBuffer(4));
  nonceBuffer.setUint32(0, tokenInfo.nonce);

  const ctimeBuffer = new DataView(new ArrayBuffer(4));
  ctimeBuffer.setUint32(0, tokenInfo.ctime);

  const expireBuffer = new DataView(new ArrayBuffer(4));
  expireBuffer.setUint32(0, tokenInfo.expire);

  const userIdBuffer = textEncoder.encode(tokenInfo.user_id);
  const payloadBuffer = tokenInfo.payload ? textEncoder.encode(tokenInfo.payload) : new Uint8Array();

  const userIdLengthBuffer = new DataView(new ArrayBuffer(2));
  userIdLengthBuffer.setUint16(0, userIdBuffer.length);

  const payloadLengthBuffer = new DataView(new ArrayBuffer(2));
  payloadLengthBuffer.setUint16(0, payloadBuffer.length);

  const message = Buffer.concat([
    Buffer.from(appIdBuffer.buffer),
    Buffer.from(userIdLengthBuffer.buffer),
    Buffer.from(userIdBuffer),
    Buffer.from(nonceBuffer.buffer),
    Buffer.from(ctimeBuffer.buffer),
    Buffer.from(expireBuffer.buffer),
    Buffer.from(payloadLengthBuffer.buffer),
    Buffer.from(payloadBuffer)
  ]);

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);

  const digest = hmac.digest();

  return Buffer.concat([message, digest]);
}
