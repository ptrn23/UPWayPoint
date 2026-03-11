CREATE TABLE "pin_images" (
	"id" text PRIMARY KEY NOT NULL,
	"pin_id" text NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pin_images" ADD CONSTRAINT "pin_images_pin_id_pin_id_fk" FOREIGN KEY ("pin_id") REFERENCES "public"."pin"("id") ON DELETE cascade ON UPDATE no action;