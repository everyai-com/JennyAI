// Simple JWT implementation for Edge runtime
export function createToken(payload: any, secret: string, expiresIn = "1h") {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const exp =
    now +
    (typeof expiresIn === "string"
      ? expiresIn.endsWith("h")
        ? parseInt(expiresIn) * 3600
        : 3600
      : expiresIn);

  const finalPayload = {
    ...payload,
    iat: now,
    exp,
  };

  const base64Header = btoa(JSON.stringify(header));
  const base64Payload = btoa(JSON.stringify(finalPayload));

  const input = `${base64Header}.${base64Payload}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const key = encoder.encode(secret);

  return crypto.subtle
    .importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
    .then((key) => crypto.subtle.sign("HMAC", key, data))
    .then((signature) => {
      const base64Signature = btoa(
        Array.from(new Uint8Array(signature))
          .map((byte) => String.fromCharCode(byte))
          .join("")
      );
      return `${base64Header}.${base64Payload}.${base64Signature}`;
    });
}
