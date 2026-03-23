"use client";

import { trpc } from "@/lib/trpc";
import type { PinRouterInputs } from "@repo/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import z from "zod";
import { fileSchema } from "@repo/api/schemas";
import { getPinColor } from "@/data/pin-categories";

type Pin = Omit<PinRouterInputs["userCreate"], "ownerId">;

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
	const createPin = trpc.pin.userCreate.useMutation({
		onSuccess: (newPin) => {
			utils.pin.getAll.invalidate();
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
			<div className="modal-card tactical-panel">
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
                            {tagsData?.map((t) => {
                                const isActive = tags.includes(t.id);
                                const tagColor = getPinColor(t.title);

                                return (
                                    <button
                                        key={t.id}
                                        type="button"
                                        className="type-btn"
                                        onClick={() => {
                                            if (isActive) {
                                                formMethods.setValue(
                                                    "tags",
                                                    tags.filter((tag) => tag !== t.id),
                                                );
                                            } else {
                                                formMethods.setValue("tags", [...tags, t.id]);
                                            }
                                        }}
                                        style={isActive ? {
                                            backgroundColor: `${tagColor}25`,
                                            borderColor: tagColor,
                                            color: tagColor,
                                            boxShadow: `inset 0 0 10px ${tagColor}40`
                                        } : {}}
                                    >
                                        {t.title.toUpperCase()}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

					<input
						type="file"
						accept="image/jpeg,image/png,image/jpg"
						multiple
						{...formMethods.register("images")}
					/>

					<div className="action-row">
						<button type="button" className="tactical-button" onClick={handleCancel}>
							CANCEL
						</button>
						<button type="submit" className="tactical-button-primary save-btn">
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
          padding: 24px;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
        }

        .modal-title {
          font-family: var(--font-cubao-wide), sans-serif;
          color: var(--text-primary);
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

        .input-group span {
          font-family: var(--font-chakra), sans-serif;
          font-size: 12px;
          color: var(--neon-blue, #00E5FF);
          letter-spacing: 0.1em;
          font-weight: 700;
        }

        input, textarea {
          background: var(--bg-base);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 12px;
          color: var(--text-primary);
          font-family: var(--font-nunito), sans-serif;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }

        input:focus, textarea:focus {
          border-color: var(--neon-blue, #00E5FF);
          box-shadow: 0 0 10px var(--shadow-glow);
        }

        .type-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .type-btn {
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 10px;
          border-radius: 6px;
          font-family: var(--font-chakra), sans-serif;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .type-btn:hover {
          background: var(--bg-panel-hover);
          color: var(--text-primary);
        }

        .action-row {
          display: flex;
          gap: 12px;
          margin-top: 12px;
        }

        .action-row button {
          flex: 1;
          padding: 14px;
          font-size: 13px;
          letter-spacing: 0.05em;
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