import z from "zod";

export const fileSchema = z
	.instanceof(File)
	.refine((f) => f.size <= 2 * 1024 * 1024, {
		message: "File must be under 2MB",
	})
	.refine((f) => ["image/jpeg", "image/png", "image/jpg"].includes(f.type), {
		message: "Invalid file type",
	});

export const pinCreationSchema = z.object({
	title: z.string().min(1),
	description: z.string().optional(),
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
	tags: z.array(z.string()),
	imageURLs: z.array(z.string()).max(10),
});
