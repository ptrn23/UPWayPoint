"use client";

import { trpc } from "@/lib/trpc";
import type { PinRouterInputs } from "@repo/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import z from "zod";
import { fileSchema } from "@repo/api/schemas";

type Pin = Omit<PinRouterInputs["create"], "ownerId">;

interface AddPinModalProps {
	coords: { lat: number; lng: number };
	onSave: (pinId: string) => void;
	onCancel: () => void;
}

async function uploadImages(files: File[]): Promise<string[]> {
	const formData = new FormData();
	files.forEach((file) => {
		formData.append("images", file);
	});

	const res = await fetch("/api/upload", { method: "POST", body: formData });
	const { urls } = await res.json();
	return urls;
}

export function AddPinModal({ coords, onSave, onCancel }: AddPinModalProps) {
	const pinCreationSchema = z.object({
		title: z.string().min(1),
		description: z.string().optional(),
		latitude: z.number().min(-90).max(90),
		longitude: z.number().min(-180).max(180),
		tags: z.array(z.string()),
		images: z
			.instanceof(FileList)
			.transform((list) => Array.from(list))
			.pipe(z.array(fileSchema).max(10)),
	});

	type pinCreationSchemaType = z.infer<typeof pinCreationSchema>;

	const utils = trpc.useUtils();
	const createPin = trpc.pin.create.useMutation({
		onSuccess: (newPin) => {
			utils.pin.getAll.invalidate(); // this forces a refresh on the main page
			if (!newPin) return;
			onSave(newPin.id);
		},
	});
	const { data: tagsData } = trpc.tag.getAll.useQuery();

	const formMethods = useForm({
		defaultValues: { tags: [] },
		resolver: zodResolver(pinCreationSchema),
	});

	const onSubmit = async (data: pinCreationSchemaType) => {
		let urls: string[] = [];
		if (data.images.length > 0) urls = await uploadImages(data.images);
		const newPin: Pin = {
			title: data.title.trim(),
			description: data.description?.trim(),
			latitude: coords.lat,
			longitude: coords.lng,
			tags: data.tags,
			imageURLs: urls,
		};

		createPin.mutate(newPin);
	};

	const handleCancel = () => {
		formMethods.clearErrors();
		formMethods.reset();
		onCancel();
	};

	const tags = formMethods.watch("tags");

	useEffect(() => {
		formMethods.setValue("latitude", coords.lat);
		formMethods.setValue("longitude", coords.lng);
	}, [formMethods, coords]);

	return (
		<div className="modal-overlay">
			<div className="modal-card">
				<div className="modal-header">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="var(--neon-blue, #00E5FF)"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<line x1="12" y1="5" x2="12" y2="19"></line>
						<line x1="5" y1="12" x2="19" y2="12"></line>
					</svg>
					<h2 className="modal-title">ADD NEW PIN</h2>
				</div>

				<form
					onSubmit={formMethods.handleSubmit(onSubmit)}
					className="modal-form"
				>
					<div className="input-group">
						<span>PIN TITLE</span>
						<input
							type="text"
							placeholder="e.g. Quezon Hall"
							required
							{...formMethods.register("title")}
						/>
					</div>

					<div className="input-group">
						<span>DESCRIPTION</span>
						<textarea
							placeholder="Enter description..."
							rows={3}
							{...formMethods.register("description")}
						/>
					</div>

					<div className="input-group">
						<span>PIN TYPES (select all that apply)</span>
						<div className="type-selector">
							{tagsData?.map((t) => (
								<button
									key={t.id}
									type="button"
									className={`type-btn ${tags.includes(t.id) ? "active" : ""}`}
									onClick={() => {
										if (tags.includes(t.id)) {
											formMethods.setValue(
												"tags",
												tags.filter((tag) => tag !== t.id),
											);
										} else {
											formMethods.setValue("tags", [...tags, t.id]);
										}
									}}
								>
									{t.title.toUpperCase()}
								</button>
							))}
						</div>
					</div>

					<input
						type="file"
						accept="image/jpeg,image/png,image/jpg"
						multiple
						{...formMethods.register("images")}
					/>

					<div className="action-row">
						<button type="button" className="cancel-btn" onClick={handleCancel}>
							CANCEL
						</button>
						<button type="submit" className="save-btn">
							CONFIRM
						</button>
					</div>
				</form>
			</div>

			<style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 20px;
        }

        .modal-card {
          width: 100%;
          max-width: 400px;
          background: rgba(10, 10, 12, 0.85);
          border: 1px solid rgba(0, 229, 255, 0.3);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 0 30px rgba(0, 229, 255, 0.1);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 16px;
        }

        .modal-title {
          font-family: var(--font-cubao-wide), sans-serif;
          color: white;
          font-size: 20px;
          margin: 0;
          letter-spacing: 0.05em;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-family: var(--font-chakra), sans-serif;
          font-size: 12px;
          color: var(--neon-blue, #00E5FF);
          letter-spacing: 0.1em;
          font-weight: 700;
        }

        input, textarea {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 12px;
          color: white;
          font-family: var(--font-nunito), sans-serif;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }

        input:focus, textarea:focus {
          border-color: var(--neon-blue, #00E5FF);
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.2);
        }

        .type-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .type-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #aaa;
          padding: 10px;
          border-radius: 6px;
          font-family: var(--font-chakra), sans-serif;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .type-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .type-btn.active {
          background: rgba(0, 229, 255, 0.15);
          border-color: var(--neon-blue, #00E5FF);
          color: var(--neon-blue, #00E5FF);
          box-shadow: inset 0 0 8px rgba(0, 229, 255, 0.2);
        }

        .action-row {
          display: flex;
          gap: 12px;
          margin-top: 12px;
        }

        .cancel-btn, .save-btn {
          flex: 1;
          padding: 14px;
          border-radius: 8px;
          font-family: var(--font-chakra), sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #aaa;
        }

        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .save-btn {
          background: rgba(0, 229, 255, 0.1);
          border: 1px solid var(--neon-blue, #00E5FF);
          color: var(--neon-blue, #00E5FF);
        }

        .save-btn:hover:not(:disabled) {
          background: var(--neon-blue, #00E5FF);
          color: black;
          box-shadow: 0 0 15px rgba(0, 229, 255, 0.4);
        }

        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
		</div>
	);
}
