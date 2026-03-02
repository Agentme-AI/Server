import type { GatewayBrowserClient } from "../gateway.ts";
import type { AgentsListResult } from "../types.ts";

export type AgentsState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  agentsLoading: boolean;
  agentsError: string | null;
  agentsList: AgentsListResult | null;
  agentsSelectedId: string | null;
};

export type SaveAgentResult = { ok: true; agentId: string } | { ok: false; error: string };

export async function saveAgent(
  state: AgentsState,
  agentId: string,
  updates: { name?: string; avatar?: string },
): Promise<SaveAgentResult> {
  if (!state.client || !state.connected) {
    return { ok: false, error: "Not connected" };
  }
  try {
    const res = await state.client.request<{ ok: true; agentId: string }>("agents.update", {
      agentId,
      ...(updates.name ? { name: updates.name } : {}),
      ...(updates.avatar ? { avatar: updates.avatar } : {}),
    });
    if (res) {
      return { ok: true, agentId: res.agentId };
    }
    return { ok: false, error: "Failed to save agent" };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

export async function loadAgents(state: AgentsState) {
  if (!state.client || !state.connected) {
    return;
  }
  if (state.agentsLoading) {
    return;
  }
  state.agentsLoading = true;
  state.agentsError = null;
  try {
    const res = await state.client.request<AgentsListResult>("agents.list", {});
    if (res) {
      state.agentsList = res;
      const selected = state.agentsSelectedId;
      const known = res.agents.some((entry) => entry.id === selected);
      if (!selected || !known) {
        state.agentsSelectedId = res.defaultId ?? res.agents[0]?.id ?? null;
      }
    }
  } catch (err) {
    state.agentsError = String(err);
  } finally {
    state.agentsLoading = false;
  }
}
