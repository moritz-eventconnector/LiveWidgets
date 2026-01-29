import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { getAuthOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  defaultWorkspaceSettings,
  normalizeWorkspaceSettings
} from '@/lib/workspace-settings';

type WorkspaceSettingsResponse = {
  settings: typeof defaultWorkspaceSettings;
};

function toPayload(settings: typeof defaultWorkspaceSettings) {
  return {
    workspaceName: settings.workspaceName,
    tagline: settings.tagline,
    brandColor: settings.brandColor,
    timezone: settings.timezone,
    language: settings.language,
    autoRecord: settings.autoRecord,
    alertPreview: settings.alertPreview
  };
}

async function getUserId() {
  const session = await getServerSession(getAuthOptions());
  return session?.user?.id ?? null;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await prisma.workspaceSettings.findUnique({
    where: { userId }
  });

  return NextResponse.json<WorkspaceSettingsResponse>({
    settings: settings ? toPayload(settings) : defaultWorkspaceSettings
  });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const normalized = normalizeWorkspaceSettings(body);

  const settings = await prisma.workspaceSettings.upsert({
    where: { userId },
    update: normalized,
    create: {
      userId,
      ...normalized
    }
  });

  return NextResponse.json<WorkspaceSettingsResponse>({
    settings: toPayload(settings)
  });
}
