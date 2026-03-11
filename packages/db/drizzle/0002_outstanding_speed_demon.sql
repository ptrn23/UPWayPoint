CREATE TABLE "pin_tags" (
	"pin_id" text NOT NULL,
	"tag_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pin_tags_pin_id_tag_id_pk" PRIMARY KEY("pin_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "pins" (
	"id" text PRIMARY KEY NOT NULL,
	"status" text DEFAULT 'PENDING_VERIFICATION' NOT NULL,
	"title" text NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"description" text,
	"owner_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"color" text DEFAULT '#ffffff',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pin_tags" ADD CONSTRAINT "pin_tags_pin_id_pins_id_fk" FOREIGN KEY ("pin_id") REFERENCES "public"."pins"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pin_tags" ADD CONSTRAINT "pin_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pins" ADD CONSTRAINT "pins_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;