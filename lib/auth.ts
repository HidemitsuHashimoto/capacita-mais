import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  signSession,
  verifySession,
  type SessionRole,
} from "@/lib/session";

export async function readSessionUser(): Promise<User | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  const payload = await verifySession(token);
  if (!payload) {
    return null;
  }
  return prisma.user.findUnique({ where: { id: payload.userId } });
}

export async function requireSessionUser(): Promise<User> {
  const user = await readSessionUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireAdminUser(): Promise<User> {
  const user = await requireSessionUser();
  if (user.role !== "ADMIN") {
    redirect("/catalog");
  }
  return user;
}

export async function authorizeAdminAction(): Promise<
  { ok: true; user: User } | { ok: false; message: string }
> {
  const user = await readSessionUser();
  if (!user) {
    return { ok: false, message: "Sessão expirada. Entre novamente." };
  }
  if (user.role !== "ADMIN") {
    return { ok: false, message: "Acesso restrito a administradores." };
  }
  return { ok: true, user };
}

export async function writeSessionCookie(input: {
  userId: string;
  role: SessionRole;
}): Promise<void> {
  const token = await signSession(input);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
