export type WorkspaceSettingsPayload = {
  workspaceName: string;
  tagline: string;
  brandColor: string;
  timezone: string;
  language: string;
  autoRecord: boolean;
  alertPreview: boolean;
};

export const defaultWorkspaceSettings: WorkspaceSettingsPayload = {
  workspaceName: 'LiveWidgets Studio',
  tagline: 'Overlays, Aktionen und Community-Tools an einem Ort.',
  brandColor: '#6366f1',
  timezone: 'Europe/Berlin',
  language: 'Deutsch',
  autoRecord: true,
  alertPreview: true
};

export function normalizeWorkspaceSettings(
  input?: Partial<WorkspaceSettingsPayload> | null
): WorkspaceSettingsPayload {
  return {
    workspaceName:
      input?.workspaceName?.trim() || defaultWorkspaceSettings.workspaceName,
    tagline: input?.tagline?.trim() || defaultWorkspaceSettings.tagline,
    brandColor: input?.brandColor || defaultWorkspaceSettings.brandColor,
    timezone: input?.timezone || defaultWorkspaceSettings.timezone,
    language: input?.language || defaultWorkspaceSettings.language,
    autoRecord: input?.autoRecord ?? defaultWorkspaceSettings.autoRecord,
    alertPreview: input?.alertPreview ?? defaultWorkspaceSettings.alertPreview
  };
}
