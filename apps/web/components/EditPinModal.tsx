"use client";

import { trpc } from "@/lib/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { getPinColor } from "@/data/pin-categories";
import { useEffect } from "react";
type Pin = {
	id?: string | undefined;
	createdAt?: string | undefined;
	updatedAt?: string | undefined;
	title?: string | undefined;
	pinTags?:
		| {
				createdAt: string;
				updatedAt: string;
				tag: {
					id: string;
					createdAt: string;
					updatedAt: string;
					title: string;
					color: string | null;
				};
				pinId: string;
				tagId: string;
		  }[]
		| undefined;
	status?: string | undefined;
	latitude?: number | undefined;
	longitude?: number | undefined;
	description?: string | null;
	ownerId?: string | undefined;
};

interface IEditPinModalProps {
	onSave: (pinId: string) => void;
	onCancel: () => void;
	pin: Pin;
}

export function EditPinModal({ onSave, onCancel, pin }: IEditPinModalProps) {
	const pinCreationSchema = z.object({
		title: z.string().min(1).optional(),
		description: z.string().optional(),
		tags: z.array(z.string()).optional(),
	});

	type pinCreationSchemaType = z.infer<typeof pinCreationSchema>;

	const updatePin = trpc.pin.update.useMutation({
		onSuccess: (newPin) => {
			if (!newPin) return;
			onSave(newPin.id);
		},
	});
	const { data: tagsData } = trpc.tag.getAll.useQuery();

	const formMethods = useForm({
		defaultValues: {
			tags: pin.pinTags?.map((pt) => pt.tagId),
			title: pin.title,
			description: pin.description || "",
		},
		resolver: zodResolver(pinCreationSchema),
	});

	const onSubmit = async (data: pinCreationSchemaType) => {
		if (!pin.id) {
			handleCancel();
			return;
		}
		const diffs = Object.keys(formMethods.formState.dirtyFields);
		if (diffs.length === 0) return;

		updatePin.mutate({
			id: pin.id,
			title: diffs.includes("title") ? data.title : undefined,
			description: diffs.includes("description") ? data.description : undefined,
			tags: diffs.includes("tags") ? data.tags || [] : [],
		});
	};

	const handleCancel = () => {
		formMethods.clearErrors();
		formMethods.reset();
		onCancel();
	};

	const tags = formMethods.watch("tags");

	useEffect(() => {
		formMethods.reset({
			tags: pin.pinTags?.map((pt) => pt.tagId),
			title: pin.title,
			description: pin.description || "",
		});
	}, [formMethods, pin.description, pin.pinTags, pin.title]);

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
					<h2 className="modal-title">EDIT PIN</h2>
					<span>{formMethods.formState.errors.tags?.message}</span>
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
						<span>PIN TYPE</span>
						<div className="type-selector">
							{tagsData?.map((t) => {
								const isActive = tags?.includes(t.id);
								const tagColor = getPinColor(t.title);

								return (
									<button
										key={t.id}
										type="button"
										className="type-btn"
										onClick={() => {
											if (isActive) {
												formMethods.setValue("tags", [], { shouldDirty: true });
											} else {
												formMethods.setValue("tags", [t.id], {
													shouldDirty: true,
												});
											}
										}}
										style={
											isActive
												? {
														backgroundColor: `color-mix(in srgb, ${tagColor} 25%, transparent)`,
														borderColor: tagColor,
														color: tagColor,
														boxShadow: `inset 0 0 10px color-mix(in srgb, ${tagColor} 40%, transparent)`,
													}
												: {}
										}
									>
										{t.title.toUpperCase()}
									</button>
								);
							})}
						</div>
					</div>

					<div className="action-row">
						<button
							type="button"
							className="tactical-button"
							onClick={handleCancel}
						>
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
					background-color: black;
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
