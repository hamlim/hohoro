import type { Context } from "hono";
import { getHonoContext as wakuHonoCtx } from "waku/unstable_hono";

export function getHonoContext(): null | Context<{ Bindings: Env }> {
  const ctx = wakuHonoCtx<{ Bindings: Env }>();
  if (!ctx) {
    return null;
  }
  return ctx as unknown as Context<{ Bindings: Env }>;
}
