CREATE TABLE "modification" (
	"id" text PRIMARY KEY NOT NULL,
	"pin_id" text NOT NULL,
	"user_id" text NOT NULL,
	"difference" jsonb NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "modification" ADD CONSTRAINT "modification_pin_id_pin_id_fk" FOREIGN KEY ("pin_id") REFERENCES "public"."pin"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modification" ADD CONSTRAINT "modification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modification" ADD CONSTRAINT "modification_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;