// Polyfill for jose library - implements basic JWT functionality
import crypto from "crypto"

const TextEncoder = globalThis.TextEncoder

export async function jwtSign(payload: any, secret: Uint8Array): Promise<string> {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url")
  const token = `${header}.${body}`

  const hmac = crypto.createHmac("sha256", Buffer.from(secret))
  hmac.update(token)
  const signature = hmac.digest("base64url")

  return `${token}.${signature}`
}

export async function jwtVerify(token: string, secret: Uint8Array): Promise<{ payload: any }> {
  const [header, body, signature] = token.split(".")

  if (!header || !body || !signature) {
    throw new Error("Invalid token")
  }

  const hmac = crypto.createHmac("sha256", Buffer.from(secret))
  hmac.update(`${header}.${body}`)
  const expectedSignature = hmac.digest("base64url")

  if (signature !== expectedSignature) {
    throw new Error("Invalid signature")
  }

  const payload = JSON.parse(Buffer.from(body, "base64url").toString())
  return { payload }
}
