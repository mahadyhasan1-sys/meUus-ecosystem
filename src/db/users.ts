import { db } from './index.ts';
import { users, workspaceItems, soulReflections } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName?: string, photoUrl?: string) {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        displayName: displayName || null,
        photoUrl: photoUrl || null,
        lastLoginAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || null,
          photoUrl: photoUrl || null,
          lastLoginAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database getOrCreateUser failed:', error);
    throw new Error('Database operation failed. Please try again later.', { cause: error });
  }
}

export async function getUserWorkspaceItems(uid: string) {
  try {
    const userList = await db.select().from(users).where(eq(users.uid, uid));
    if (!userList.length) return [];
    
    const user = userList[0];
    return await db.select().from(workspaceItems).where(eq(workspaceItems.userId, user.id)).orderBy(desc(workspaceItems.createdAt));
  } catch (error) {
    console.error('Database getUserWorkspaceItems failed:', error);
    throw new Error('Failed to fetch workspace items.', { cause: error });
  }
}

export async function createWorkspaceItem(uid: string, item: {
  hubId: string;
  title: string;
  content?: string;
  category?: string;
  externalId?: string;
  externalUrl?: string;
  metadata?: any;
}) {
  try {
    const userList = await db.select().from(users).where(eq(users.uid, uid));
    if (!userList.length) {
      throw new Error('User not found in Cloud SQL database');
    }
    const user = userList[0];

    const result = await db.insert(workspaceItems)
      .values({
        userId: user.id,
        hubId: item.hubId,
        title: item.title,
        content: item.content || null,
        category: item.category || 'general',
        externalId: item.externalId || null,
        externalUrl: item.externalUrl || null,
        metadata: item.metadata || null,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database createWorkspaceItem failed:', error);
    throw new Error('Failed to save workspace item in Cloud SQL.', { cause: error });
  }
}

export async function toggleWorkspaceItemStatus(uid: string, itemId: number, isCompleted: boolean) {
  try {
    const userList = await db.select().from(users).where(eq(users.uid, uid));
    if (!userList.length) return null;
    const user = userList[0];

    const result = await db.update(workspaceItems)
      .set({ isCompleted, updatedAt: new Date() })
      .where(eq(workspaceItems.id, itemId))
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database toggleWorkspaceItemStatus failed:', error);
    throw new Error('Failed to update workspace item.', { cause: error });
  }
}

export async function createSoulReflection(uid: string, prompt: string, response: string, moodTag?: string) {
  try {
    const userList = await db.select().from(users).where(eq(users.uid, uid));
    if (!userList.length) throw new Error('User not found');
    const user = userList[0];

    const result = await db.insert(soulReflections)
      .values({
        userId: user.id,
        prompt,
        response,
        moodTag: moodTag || null,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database createSoulReflection failed:', error);
    throw new Error('Failed to save soul reflection in Cloud SQL.', { cause: error });
  }
}

export async function getUserSoulReflections(uid: string) {
  try {
    const userList = await db.select().from(users).where(eq(users.uid, uid));
    if (!userList.length) return [];
    const user = userList[0];

    return await db.select().from(soulReflections).where(eq(soulReflections.userId, user.id)).orderBy(desc(soulReflections.createdAt));
  } catch (error) {
    console.error('Database getUserSoulReflections failed:', error);
    throw new Error('Failed to fetch reflections.', { cause: error });
  }
}
