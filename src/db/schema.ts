import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

// Users table (linked to Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
  lastLoginAt: timestamp('last_login_at').defaultNow(),
});

// Workspace Sync & Hub Items
export const workspaceItems = pgTable('workspace_items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  hubId: text('hub_id').notNull(), // e.g. 'idea-lab', 'business-hub', 'legal-hub', etc.
  title: text('title').notNull(),
  content: text('content'),
  category: text('category').default('general'), // 'sheets', 'meet', 'forms', 'tasks', 'action'
  externalId: text('external_id'), // e.g. Google Sheet ID, Form ID, Meet URI, Task ID
  externalUrl: text('external_url'),
  metadata: jsonb('metadata'),
  isCompleted: boolean('is_completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Reflections and Soul Journal logs
export const soulReflections = pgTable('soul_reflections', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  prompt: text('prompt').notNull(),
  response: text('response').notNull(),
  moodTag: text('mood_tag'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  workspaceItems: many(workspaceItems),
  reflections: many(soulReflections),
}));

export const workspaceItemsRelations = relations(workspaceItems, ({ one }) => ({
  user: one(users, {
    fields: [workspaceItems.userId],
    references: [users.id],
  }),
}));

export const soulReflectionsRelations = relations(soulReflections, ({ one }) => ({
  user: one(users, {
    fields: [soulReflections.userId],
    references: [users.id],
  }),
}));
