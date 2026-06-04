import { prisma } from "./prisma";

export async function getPageContent(pageKey: string): Promise<Record<string, string>> {
  try {
    const entries = await prisma.pageContent.findMany({ where: { pageKey } });
    const data: Record<string, string> = {};
    entries.forEach((e) => { data[e.fieldKey] = e.fieldValue ?? ""; });
    return data;
  } catch { return {}; }
}

export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  try {
    const entries = await prisma.setting.findMany({ where: { key: { in: keys } } });
    const data: Record<string, string> = {};
    entries.forEach((e) => { data[e.key] = e.value ?? ""; });
    return data;
  } catch { return {}; }
}

export async function getActiveShows() {
  try {
    return await prisma.show.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
  } catch { return []; }
}

export async function getTeamMembers() {
  try {
    return await prisma.teamMember.findMany({ orderBy: { displayOrder: "asc" } });
  } catch { return []; }
}

export async function getLiveStream() {
  try {
    return await prisma.liveStream.findFirst();
  } catch { return null; }
}
