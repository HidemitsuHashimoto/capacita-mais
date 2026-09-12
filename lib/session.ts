export const SESSION_COOKIE = "capacita_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type SessionRole = "ALUNO" | "ADMIN";

export type SessionPayload = {
  userId: string;
  role: SessionRole;
  exp: number;
};

function readSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }
  return secret;
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = padded.length % 4 === 0 ? 0 : 4 - (padded.length % 4);
  const binary = atob(`${padded}${"=".repeat(padLength)}`);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function signBody(body: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(readSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(body),
  );
  return encodeBase64Url(new Uint8Array(signature));
}

function hasSameSignature(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < left.length; i += 1) {
    mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function signSession(input: {
  userId: string;
  role: SessionRole;
}): Promise<string> {
  const payload: SessionPayload = {
    userId: input.userId,
    role: input.role,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = encodeBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await signBody(body);
  return `${body}.${signature}`;
}

export async function verifySession(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const [body, signature] = token.split(".");
    if (!body || !signature) {
      return null;
    }
    const expected = await signBody(body);
    if (!hasSameSignature(expected, signature)) {
      return null;
    }
    const payload = JSON.parse(
      new TextDecoder().decode(decodeBase64Url(body)),
    ) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    if (!payload.userId) {
      return null;
    }
    if (payload.role !== "ALUNO" && payload.role !== "ADMIN") {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
