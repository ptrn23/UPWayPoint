"use client";

import { getPinColor } from "@/data/pin-categories";
import { useSession } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { EditPinModal } from "./EditPinModal";

interface ExpandedPinViewProps {
	pinId: string;
	onClose: () => void;
}

type Comment = {
	id: string;
	createdAt: string;
	updatedAt: string;
	ownerId: string;
	pinId: string;
	message: string;
	parentId: string | null;
	deletedAt: string | null;
	replies: Comment[];
	authorName: string;
};

const commentSchema = z.object({
	message: z.string(),
});

type commentSchemaType = z.infer<typeof commentSchema>;

const CommentNode = ({
	comment,
	depth = 0,
}: {
	comment: Comment;
	depth: number;
}) => {
	const { data: sessionData } = useSession();
	const utils = trpc.useUtils();
	const createComment = trpc.comment.create.useMutation({
		onSuccess(output) {
			utils.pin.getById.invalidate();
			setIsReplying(false);
		},
	});
	const formMethods = useForm({ resolver: zodResolver(commentSchema) });
	const [isReplying, setIsReplying] = useState(false);
	if (depth > 3) return null;

	function onSubmit(data: commentSchemaType) {
		createComment.mutate({
			message: data.message,
			pinId: comment.pinId,
			parentId: comment.id,
		});
	}

	return (
		<div className={`comment-node ${depth > 0 ? "is-reply" : ""}`}>
			<div className="comment-header">
				<span className="comment-author">{comment.authorName}</span>
				<span className="comment-time">
					{new Date(comment.createdAt).toLocaleString("default")}
				</span>
			</div>

			<p className="comment-text">{comment.message}</p>

			<div className="comment-actions">
				{!isReplying ? (
					sessionData &&
					depth < 3 && (
						<button
							type="button"
							className="action-btn"
							onClick={() => setIsReplying(true)}
						>
							REPLY
						</button>
					)
				) : (
					<form
						onSubmit={formMethods.handleSubmit(onSubmit)}
						className="reply-form"
					>
						<input
							{...formMethods.register("message")}
							placeholder="Write a reply..."
							className="reply-input"
						/>
						<button type="submit" className="tactical-button-primary form-btn">
							Send
						</button>
						<button
							type="button"
							className="tactical-button form-btn"
							onClick={() => setIsReplying(false)}
						>
							Cancel
						</button>
					</form>
				)}
			</div>

			{comment.replies && comment.replies.length > 0 && (
				<div className="replies-container">
					{comment.replies.map((reply) => (
						<CommentNode key={reply.id} comment={reply} depth={depth + 1} />
					))}
				</div>
			)}

			<style jsx>{`
        .comment-node { margin-top: 16px; }
        .comment-node.is-reply {
          margin-left: 16px; 
          padding-left: 16px; 
          border-left: 2px solid var(--border-color); 
          margin-top: 12px;
        }
        .comment-header { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
        .comment-author { font-family: var(--font-chakra); font-weight: 700; font-size: 13px; color: var(--text-primary); }
        .comment-time { font-family: var(--font-nunito); font-size: 11px; color: var(--text-secondary); }
        
        .comment-text { font-family: var(--font-nunito); font-size: 14px; color: var(--text-primary); line-height: 1.5; margin: 4px 0; }
        .comment-actions { display: flex; gap: 16px; align-items: center; margin-top: 8px; }
        .action-btn {
          background: none; border: none; color: var(--text-secondary); font-family: var(--font-chakra); font-size: 11px;
          font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 0; transition: color 0.2s;
        }
        .action-btn:hover { color: var(--text-primary); }

        .reply-form { display: flex; gap: 8px; width: 100%; align-items: center; margin-top: 8px; }
        .reply-input {
            flex: 1;
            background: var(--bg-base);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: 8px 12px;
            color: var(--text-primary);
            font-family: var(--font-nunito);
            font-size: 13px;
            outline: none;
        }
        .reply-input:focus { border-color: var(--neon-blue); }
        .form-btn { padding: 6px 12px; font-size: 11px; border-radius: 6px; }
      `}</style>
		</div>
	);
};

export function ExpandedPinView({ pinId, onClose }: ExpandedPinViewProps) {
	const utils = trpc.useUtils();
	const { data: sessionData } = useSession();
	const { data: pin, isLoading: isPinLoading } = trpc.pin.getById.useQuery(
		{ id: pinId },
		{ refetchOnWindowFocus: false },
	);

	const createComment = trpc.comment.create.useMutation({
		onSuccess(output) {
			utils.pin.getById.invalidate();
			setIsReplying(false);
		},
	});
	const deletePin = trpc.pin.userDelete.useMutation({
		onSuccess(output) {
			utils.pin.getAll.invalidate();
			onClose();
		},
	});

	const formMethods = useForm({ resolver: zodResolver(commentSchema) });
	const [isReplying, setIsReplying] = useState(false);

	function onSubmit(data: commentSchemaType) {
		createComment.mutate({
			message: data.message,
			pinId: pinId,
		});
	}

	const [isDeleting, setIsDeleting] = useState(false);

	function onDelete() {
		deletePin.mutate({ id: pinId });
	}

	const color = getPinColor(
		pin?.pinTags ? pin.pinTags[0]?.tag.title || "" : "",
	);

	const getStatusDisplay = (status: string | undefined) => {
		switch (status) {
			case "VERIFIED":
				return {
					text: "VERIFIED",
					// color: "var(--status-success)",
					icon: (
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
							<polyline points="22 4 12 14.01 9 11.01"></polyline>
						</svg>
					),
				};
			case "PENDING_VERIFICATION":
				return {
					text: "PENDING",
					// color: "var(--neon-yellow)",
					icon: (
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="12" cy="12" r="10"></circle>
							<polyline points="12 6 12 12 16 14"></polyline>
						</svg>
					),
				};
			case "REJECTED":
				return {
					text: "REJECTED",
					// color: "var(--status-danger)",
					icon: (
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="15" y1="9" x2="9" y2="15"></line>
							<line x1="9" y1="9" x2="15" y2="15"></line>
						</svg>
					),
				};
			default:
				return {
					text: status || "UNKNOWN",
					color: "var(--text-secondary)",
					icon: (
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="3"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="12" cy="12" r="10"></circle>
							<line x1="12" y1="8" x2="12" y2="12"></line>
							<line x1="12" y1="16" x2="12.01" y2="16"></line>
						</svg>
					),
				};
		}
	};

	const statusData = getStatusDisplay(pin?.status);

	const [isEditing, setIsEditing] = useState(false);

	if (isPinLoading || !pin)
		return (
			// biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
			// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
			<div className="modal-overlay" onClick={onClose}>
				<div
					className="modal-content"
					style={{
						borderTop: "3px solid black",
						animation:
							"slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), pulse 1s ease-in-out infinite",
						minHeight: "156px",
					}}
				></div>
				<style jsx>{`
            .modal-overlay {
                position: fixed; inset: 0; 
                background: var(--border-color); backdrop-filter: blur(8px);
                z-index: 200; display: flex; align-items: center; justify-content: center;
                padding: 24px; animation: fadeIn 0.2s ease-out; pointer-events: auto;
            }

            .modal-content {
                background: var(--bg-base);
                border: 1px solid var(--border-color);
                border-top: 4px solid ${color}; 
                border-radius: 24px;
                width: 100%; 
                max-width: 500px; 
                height: 70vh; 
                display: flex; 
                flex-direction: column;
                box-shadow: 0 30px 60px var(--border-color);
                animation: scalePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                overflow: hidden; 
                position: relative;
                padding: 0; 
            }
      `}</style>
			</div>
		);

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div className="modal-overlay" onClick={onClose}>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				{isEditing && (
					<EditPinModal
						onSave={() => {
							setIsEditing(false);
						}}
						onCancel={() => {
							setIsEditing(false);
						}}
						pin={pin}
					/>
				)}
				<div className="scroll-area custom-vertical-scrollbar">
					{/* HEADER */}
					<div className="modal-header">
						<div>
							<span className="badge" style={{ color }}>
								{pin?.pinTags?.map((pt) => pt.tag.title).join(", ")}
							</span>
							<h2>{pin?.title}</h2>
						</div>

						<div className="header-actions">
							{!!sessionData && (
								<button
									type="button"
									className="edit-btn"
									onClick={() => {
										setIsEditing(true);
									}}
									title="Edit Waypoint"
								>
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
										<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
									</svg>
								</button>
							)}

							<button
								type="button"
								className="close-btn"
								onClick={onClose}
								title="Close Terminal"
							>
								<svg
									width="28"
									height="28"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<line x1="18" y1="6" x2="6" y2="18"></line>
									<line x1="6" y1="6" x2="18" y2="18"></line>
								</svg>
							</button>
						</div>
					</div>

					{/* HORIZONTAL BENTO GALLERY OR FALLBACK */}
					{pin?.images && pin.images.length > 0 ? (
						<div className="photo-gallery custom-scrollbar">
							{pin.images.map((img) => (
								<div key={img.id} className={`photo-placeholder large`}>
									<Image alt="" src={`${img.url}`} fill objectFit="cover" />
								</div>
							))}
						</div>
					) : (
						<div className="no-photo-placeholder">
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								style={{ opacity: 0.5, marginBottom: "8px" }}
							>
								<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
								<circle cx="8.5" cy="8.5" r="1.5"></circle>
								<polyline points="21 15 16 10 5 21"></polyline>
								<line x1="3" y1="3" x2="21" y2="21"></line>
							</svg>
							<span>NO IMAGES AVAILABLE</span>
						</div>
					)}

					{/* BODY: INTEL DASHBOARD */}
					<div className="modal-body">
						<p className="description">{pin?.description}</p>

						<div className="meta-grid">
							{/* PIN ID */}
							<div className="meta-item">
								<span className="meta-label">PIN ID</span>
								<span className="meta-value font-mono animate-pan">
									{pin?.id?.padStart(7, "0")}
								</span>
							</div>
							{/* OWNER */}
							<div className="meta-item">
								<span className="meta-label">CREATED BY</span>
								<span className="meta-value">{pin?.owner}</span>
							</div>
							{/* COORDINATES */}
							<div className="meta-item col-span-2">
								<span className="meta-label">COORDINATES (LAT, LNG)</span>
								<span className="meta-value font-mono">
									{pin?.latitude?.toFixed(6)}, {pin?.longitude?.toFixed(6)}
								</span>
							</div>
							{/* STATUS */}
							<div className="meta-item">
								<span className="meta-label">STATUS</span>
								<span
									className="meta-value font-mono status-badge"
									style={{
										color: statusData.color,
										textShadow: `0 0 10px ${statusData.color}40`,
									}}
								>
									{statusData.icon}
									{statusData.text}
								</span>
							</div>
							{/* TIMESTAMPS */}
							<div className="meta-item">
								<span className="meta-label">CREATED AT</span>
								<span className="meta-value">
									{new Date(pin?.createdAt || "").toLocaleString("default", {
										month: "long",
										year: "numeric",
										day: "2-digit",
									})}
								</span>
							</div>

							{pin.modifications.filter((m) => m.status === "APPLIED").length >
								0 && (
								<div className="meta-item">
									<span className="meta-label">LAST UPDATED</span>

									<span className="meta-value">
										{new Date(pin?.updatedAt || "").toLocaleString("default", {
											month: "long",
											year: "numeric",
											day: "2-digit",
										})}{" "}
										by {pin.modifications[0]?.user.name}
									</span>
								</div>
							)}
						</div>

						{/* OWNER ACTIONS */}
						{!isDeleting && sessionData?.user.id === pin?.ownerId && (
							<button
								type="button"
								className="tactical-button danger-btn"
								onClick={() => setIsDeleting(true)}
							>
								DELETE PIN
							</button>
						)}

						{isDeleting && (
							<div className="delete-confirm-box">
								<p>Are you sure you want to permanently delete this pin?</p>
								<div className="delete-actions">
									<button
										type="button"
										className="tactical-button-primary danger-btn-solid"
										onClick={onDelete}
									>
										CONFIRM DELETE
									</button>
									<button
										type="button"
										className="tactical-button"
										onClick={() => setIsDeleting(false)}
									>
										CANCEL
									</button>
								</div>
							</div>
						)}

						<div className="forum-section">
							<h3 className="section-title">FORUM</h3>
							{!isReplying ? (
								sessionData && (
									<button
										type="button"
										className="action-btn"
										onClick={() => setIsReplying(true)}
									>
										+ ADD COMMENT
									</button>
								)
							) : (
								<form
									onSubmit={formMethods.handleSubmit(onSubmit)}
									className="reply-form"
								>
									<input
										{...formMethods.register("message")}
										placeholder="Write a comment..."
										className="reply-input"
									/>
									<button
										type="submit"
										className="tactical-button-primary form-btn"
									>
										POST
									</button>
									<button
										type="button"
										className="tactical-button form-btn"
										onClick={() => setIsReplying(false)}
									>
										CANCEL
									</button>
								</form>
							)}
							<div className="forum-threads">
								{pin?.comments?.map((thread) => (
									<CommentNode key={thread.id} comment={thread} depth={0} />
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="bottom-fade"></div>
			</div>

			<style jsx>{`
            .modal-overlay {
							position: fixed;
							top: 0; left: 0; width: 100vw; height: 100vh;
							background: var(--border-color);
							backdrop-filter: blur(8px);
							-webkit-backdrop-filter: blur(8px);
							display: flex;
							align-items: center;
							justify-content: center;
							z-index: 200;
							padding: 20px;
						}

            .modal-content {
                background: var(--bg-panel);
                border: 1px solid var(--border-color);
                border-top: 4px solid ${color}; 
                border-radius: 24px;
                width: 100%; 
                max-width: 500px; 
                height: 70vh; 
                display: flex; 
                flex-direction: column;
                box-shadow: 0 30px 60px var(--border-color);
                overflow: hidden; 
                position: relative;
                padding: 0; 
            }

            .scroll-area {
                flex: 1;
                overflow-y: auto;
                padding: 28px;
                padding-bottom: 60px;
            }

            .bottom-fade {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 80px;
                /* Fades to transparent seamlessly in both Light and Dark mode */
                background: linear-gradient(to top, var(--bg-base) 10%, transparent 100%);
                pointer-events: none; 
                border-bottom-left-radius: 24px;
                border-bottom-right-radius: 24px;
            }

            /* Custom Scrollbars */
            .custom-vertical-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-vertical-scrollbar::-webkit-scrollbar-track { background: transparent; margin: 24px 0; }
            .custom-vertical-scrollbar::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }
            .custom-vertical-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--text-secondary); }

            .custom-scrollbar::-webkit-scrollbar { height: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; transition: background 0.2s; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--text-secondary); }

            /* Header & Actions */
            .modal-header { 
                display: flex; 
                justify-content: space-between; 
                align-items: flex-start; 
                margin-bottom: 20px; 
            }
            
            .header-actions {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .badge { font-family: var(--font-cubao-wide); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; }
            h2 { font-family: var(--font-chakra); color: var(--text-primary); font-size: 26px; font-weight: 800; margin: 4px 0 0 0; }

            .close-btn, .edit-btn {
                background: transparent; 
                border: 1px solid var(--border-color);
                border-radius: 50%; 
                width: 44px; 
                height: 44px; 
                color: var(--text-primary); 
                cursor: pointer;
                display: flex; 
                align-items: center; 
                justify-content: center; 
                transition: all 0.2s;
                flex-shrink: 0;
            }
            .close-btn:hover, .edit-btn:hover { background: var(--bg-panel-hover); }
            .close-btn:active, .edit-btn:active { transform: scale(0.9); }

            .photo-gallery {
                display: grid; grid-template-rows: repeat(2, 90px); grid-auto-flow: column;
                gap: 12px; margin-bottom: 24px; overflow-x: auto; overscroll-behavior-x: contain;
                padding-bottom: 8px; scroll-snap-type: x mandatory;
            }
            .no-scrollbar::-webkit-scrollbar { display: none; }

            .photo-placeholder {
                background: var(--bg-panel-hover);
                border: 1px solid var(--border-color);
                border-radius: 16px;
                display: flex; align-items: center; justify-content: center;
                scroll-snap-align: start; position: relative; overflow: hidden;
            }
            .photo-placeholder.large { grid-row: span 2; width: 192px; }

			.no-photo-placeholder {
                height: 192px;
                margin-bottom: 24px;
                background: var(--bg-panel-hover);
                border: 1px dashed var(--border-color);
                border-radius: 16px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: var(--text-secondary);
                font-family: var(--font-chakra);
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 0.15em;
            }

            /* Body Data */
            .modal-body { display: flex; flex-direction: column; gap: 24px; }
            .description { font-family: var(--font-nunito); font-size: 15px; color: var(--text-primary); line-height: 1.5; margin: 0; }

            .meta-grid {
                display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
                background: var(--bg-panel-hover); border: 1px solid var(--border-color);
                border-radius: 16px; padding: 20px;
            }
            
            .meta-item { 
                display: flex; 
                flex-direction: column; 
                gap: 4px; 
                min-width: 0; 
                /* 1. Turn the container into a measurable query zone */
                container-type: inline-size;
                overflow: hidden; 
            }

            .col-span-2 { grid-column: span 2; } 
            .meta-label { font-family: var(--font-chakra); font-size: 10px; font-weight: 800; color: var(--text-secondary); letter-spacing: 0.1em; }
            
            .meta-value { 
                font-family: var(--font-nunito); 
                font-size: 14px; 
                font-weight: 700; 
                color: var(--text-primary); 
                white-space: nowrap;
                width: max-content;
				background-size: 200% 200%;
                animation: scrollText 6s ease-in-out infinite alternate;
				scrollbar-width: none; /* Firefox */
				overflow: hidden;
            }
            .meta-value::-webkit-scrollbar { 
                display: none; /* Safari and Chrome */
            }

			.status-badge {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 14px;
            }

            .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; letter-spacing: 0.05em; }
            .font-cubao-wide { font-family: var(--font-cubao-wide); font-weight: 100; letter-spacing: 0.1em;}
            .text-muted { color: var(--text-secondary); font-style: italic; }
            .text-neon-green { color: var(--status-success); text-shadow: 0 0 10px var(--status-success); }

            .danger-btn { border-color: var(--status-danger); color: var(--status-danger); padding: 12px; }
            .danger-btn:hover { background: var(--status-danger); color: white; transform: none;}
            
            .delete-confirm-box {
                background: var(--bg-panel-hover);
                border: 1px solid var(--status-danger);
                border-radius: 12px;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .delete-confirm-box p { margin: 0; color: var(--text-primary); font-family: var(--font-nunito); font-size: 14px; }
            .delete-actions { display: flex; gap: 8px; }
            .danger-btn-solid { background: var(--status-danger); border-color: var(--status-danger); color: white; box-shadow: none; flex: 1; padding: 10px;}
            .danger-btn-solid:hover { background: var(--status-danger); color: white; box-shadow: 0 0 15px var(--status-danger);}
            
            .forum-section {
                margin-top: 8px;
                border-top: 1px solid var(--border-color);
                padding-top: 24px;
								padding-bottom: 100px;
            }
            .section-title {
                font-family: var(--font-chakra); font-size: 12px; font-weight: 900;
                letter-spacing: 0.15em; color: var(--text-secondary); margin-bottom: 20px;
            }

            .action-btn {
                background: none; border: none; color: var(--text-secondary);
                font-family: var(--font-chakra); font-size: 11px; font-weight: 700;
                cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 0; transition: color 0.2s;
            }
            .action-btn:hover { color: var(--text-primary); }

            .reply-form { display: flex; gap: 8px; width: 100%; align-items: center; margin-bottom: 24px; }
            .reply-input {
                flex: 1; background: var(--bg-base); border: 1px solid var(--border-color);
                border-radius: 6px; padding: 10px 12px; color: var(--text-primary);
                font-family: var(--font-nunito); font-size: 13px; outline: none;
            }
            .reply-input:focus { border-color: var(--neon-blue); }
            .form-btn { padding: 10px 16px; font-size: 11px; border-radius: 6px; }
      `}</style>
		</div>
	);
}
