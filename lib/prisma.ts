import { PrismaClient } from "./generated/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientSingleton = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
  var prismaVersion: string | undefined;
}

const PRISMA_CLIENT_VERSION = "v12"; // Increment this to force re-instantiation

const prisma = (() => {
  if (globalThis.prismaGlobal && (globalThis as any).prismaVersion === PRISMA_CLIENT_VERSION) {
    return globalThis.prismaGlobal;
  }
  
  if (globalThis.prismaGlobal) {
    console.log(`[Prisma] Stale client (version mismatch). Upgrading to ${PRISMA_CLIENT_VERSION}...`);
  }
  
  const client = prismaClientSingleton();
  
  // Proxy to debug missing properties
  const proxy = new Proxy(client, {
    get(target, prop, receiver) {
      if (typeof prop === "string" && !prop.startsWith("_") && !(prop in target)) {
        const available = Object.keys(target).filter(k => !k.startsWith("_"));
        const errorMsg = `[Prisma Runtime Error] Model "${prop}" is missing from the Prisma client. Available models on this instance: ${available.join(", ")}. Please check if schema.prisma is correctly synced and prisma generate was run.`;
        console.error(errorMsg);
        // Throwing explicitly to show in the dev overlay
        throw new Error(errorMsg);
      }
      return Reflect.get(target, prop, receiver);
    }
  });

  (globalThis as any).prismaVersion = PRISMA_CLIENT_VERSION;
  return proxy;
})();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
