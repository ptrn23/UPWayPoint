import { relations } from "drizzle-orm";
import {
	pgTable,
	pgEnum,
	text,
	timestamp,
	boolean,
	index,
	doublePrecision,
	primaryKey,
	integer,
} from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	userRole: userRoleEnum().default("user"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const tag = pgTable("tag", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	title: text("title").notNull(),
	color: text("color").default("#ffffff"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const pinTags = pgTable(
	"pin_tags",
	{
		pinId: text("pin_id")
			.notNull()
			.references(() => pin.id, { onDelete: "cascade" }),
		tagId: text("tag_id")
			.notNull()
			.references(() => tag.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [primaryKey({ columns: [table.pinId, table.tagId] })],
);

export const pinImages = pgTable("pin_images", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	pinId: text("pin_id")
		.notNull()
		.references(() => pin.id, { onDelete: "cascade" }),
	url: text("url").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pin = pgTable("pin", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	status: text("status").notNull().default("PENDING_VERIFICATION"),
	title: text("title").notNull(),
	latitude: doublePrecision("latitude").notNull(),
	longitude: doublePrecision("longitude").notNull(),
	description: text("description"),
	ownerId: text("owner_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const comment = pgTable("comment", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	message: text("message").notNull(),
	ownerId: text("owner_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	parentId: text("parent_id"),
	pinId: text("pin_id")
		.notNull()
		.references(() => pin.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	deletedAt: timestamp("deleted_at"),
});

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	pins: many(pin),
	comments: many(comment),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const pinRelations = relations(pin, ({ one, many }) => ({
	owner: one(user, {
		fields: [pin.ownerId],
		references: [user.id],
	}),
	pinTags: many(pinTags),
	images: many(pinImages),
	comments: many(comment),
}));

export const tagRelations = relations(tag, ({ many }) => ({
	pinTags: many(pinTags),
}));

export const pinTagsRelations = relations(pinTags, ({ one }) => ({
	pin: one(pin, { fields: [pinTags.pinId], references: [pin.id] }),
	tag: one(tag, { fields: [pinTags.tagId], references: [tag.id] }),
}));

export const pinImagesRelations = relations(pinImages, ({ one }) => ({
	pin: one(pin, { fields: [pinImages.pinId], references: [pin.id] }),
}));

export const commentRelations = relations(comment, ({ one, many }) => ({
	owner: one(user, { fields: [comment.ownerId], references: [user.id] }),
	pin: one(pin, { fields: [comment.pinId], references: [pin.id] }),
	parent: one(comment, {
		fields: [comment.parentId],
		references: [comment.id],
	}),
	replies: many(comment),
}));
