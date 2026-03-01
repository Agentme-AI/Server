import { html, nothing } from "lit";
import type { TaskResult, RecentItem, AgentApp } from "../types.ts";

export type DashboardProps = {
  connected: boolean;
  agentCount: number;
  recentActivity: RecentItem[];
  taskResults: TaskResult[];
  dashboardNotice: { text: string; tone: "info" | "success" | "error" | "warning" } | null;
  agentsList: { agents: AgentApp[]; count: number } | null;
  agentSearch: string;
  agentSort: "name" | "id";
  agentModal: string | null;
  agentAvatarDraft: string;
  onEditAgentAvatar: (agentId: string, currentAvatar: string) => void;
  onClearNotice: () => void;
  onOpenTab: (tab: string) => void;
  onAddAgent: () => void;
  onAgentSearchChange: (v: string) => void;
  onAgentSortChange: (v: "name" | "id") => void;
  onEditAgentProfile: (agentId: string) => void;
  onEditAgentAvatar: (agentId: string, currentAvatar: string) => void;
  onAgentAvatarDraftChange: (v: string) => void;
  onAgentSaveAvatar: () => void;
  onCloseAgentModal: () => void;
};

export function renderDashboard(props: DashboardProps) {
  const agents = props.agentsList?.agents ?? [];

  const filteredAgents = agents
    .filter((a) => {
      if (!props.agentSearch.trim()) {
        return true;
      }
      const q = props.agentSearch.toLowerCase();
      return a.id.toLowerCase().includes(q) || a.name.toLowerCase().includes(q);
    })
    .toSorted((a, b) => {
      if (props.agentSort === "name") {
        return a.name.localeCompare(b.name);
      }
      return a.id.localeCompare(b.id);
    });

  return html`
    <section class="dashboard-hero card" style="margin-bottom:14px;">
      <div>
        <div class="card-title">Agent Dashboard</div>
        <div class="card-sub">Manage your AI workforce — ${props.agentCount} agent${props.agentCount !== 1 ? "s" : ""} configured</div>
      </div>
    </section>

    ${
      props.dashboardNotice
        ? html`<div class="callout ${props.dashboardNotice.tone}" style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; gap:8px;">
          <span>${props.dashboardNotice.text}</span>
          <button class="btn" @click=${props.onClearNotice}>Dismiss</button>
        </div>`
        : nothing
    }

    <!-- AI Agents Profile Cards -->
    <section class="card" style="margin-bottom:14px; padding: 20px;">
      <div class="agents-dashboard__header-content" style="margin-bottom: 20px;">
        <div>
          <div class="card-title">AI Agents</div>
          <div class="card-sub">${props.agentCount} agent${props.agentCount !== 1 ? "s" : ""} available</div>
        </div>
        <div class="agents-dashboard__header-actions">
          <button class="btn primary" @click=${props.onAddAgent}>
            <span style="margin-right: 4px;">+</span> Add Agent
          </button>
        </div>
      </div>

      <div class="agents-dashboard__filters" style="margin-bottom: 20px;">
        <input 
          class="input agents-dashboard__search" 
          placeholder="Search agents by name or ID..." 
          .value=${props.agentSearch}
          @input=${(e: Event) => props.onAgentSearchChange((e.target as HTMLInputElement).value)}
        />
        <label class="field" style="min-width: 130px; margin: 0;">
          <span>Sort</span>
          <select .value=${props.agentSort} @change=${(e: Event) => props.onAgentSortChange((e.target as HTMLSelectElement).value as "name" | "id")}>
            <option value="name">Name</option>
            <option value="id">ID</option>
          </select>
        </label>
      </div>

      <div class="agent-cards-grid">
        ${
          filteredAgents.length === 0
            ? html`
          <div class="card agents-dashboard__empty" style="grid-column: 1 / -1; text-align: center; padding: 48px 32px;">
            <div style="font-size: 48px; margin-bottom: 16px;">🤖</div>
            <div class="card-title">No agents found</div>
            <div class="card-sub" style="margin-bottom: 20px;">
              ${props.agentSearch ? "No agents match your search." : "Get started by creating your first AI agent."}
            </div>
            ${!props.agentSearch ? html`<button class="btn primary" @click=${props.onAddAgent}>Create First Agent</button>` : ""}
          </div>
        `
            : filteredAgents.map((app, idx) => {
                const isDefault = app.id === "main";
                const accentColor = [
                  "#06b6d4",
                  "#8b5cf6",
                  "#22c55e",
                  "#f59e0b",
                  "#ef4444",
                  "#3b82f6",
                ][idx % 6];
                return html`
            <article class="agent-card" @click=${() => props.onEditAgentProfile(app.id)} style="--agent-accent: ${accentColor}">
              <button class="agent-card__star" type="button" @click=${(e: Event) => {
                e.stopPropagation();
              }} title="Favorite">
                ⭐
              </button>
              <div class="agent-card__avatar-wrap">
                <div class="agent-card__avatar">
                  ${app.icon}
                </div>
                ${
                  isDefault
                    ? html`
                        <span class="agent-card__badge">Default</span>
                      `
                    : nothing
                }
              </div>
              <h3 class="agent-card__name">${app.name}</h3>
              <p class="agent-card__role">${app.role}</p>
            </article>
          `;
              })
        }
      </div>
    </section>

    ${
      props.agentModal
        ? html`
            <section class="card" style="margin-top:14px; border-color: #6b5cf0;">
              <div class="card-title">Edit Agent Profile Picture</div>
              <div class="card-sub">Agent: ${props.agentModal}</div>
              <label class="field" style="margin-top:10px;">
                <span>Avatar (emoji, URL, or workspace path)</span>
                <input
                  class="input"
                  .value=${props.agentAvatarDraft}
                  placeholder="🤖 or https://... or avatars/emc2.png"
                  @input=${(e: Event) =>
                    props.onAgentAvatarDraftChange((e.target as HTMLInputElement).value)}
                />
              </label>
              <div class="row" style="margin-top:10px; gap:8px;">
                <button class="btn primary" @click=${props.onAgentSaveAvatar}>Save avatar</button>
                <button class="btn" @click=${props.onCloseAgentModal}>Cancel</button>
                <button class="btn" @click=${() => props.onEditAgentProfile(props.agentModal!)}>
                  Open full profile
                </button>
              </div>
            </section>
          `
        : nothing
    }

  `;
}
