"use client";

import { getFilterColor } from "@/components/TopBar";
import { useSession } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

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
				{/* {depth === 0 && comment.rating && (
					<span className="comment-rating">
						{"★".repeat(comment.rating)} {comment.rating}/5
					</span>
				)} */}
			</div>

			<p className="comment-text">{comment.message}</p>

			<div className="comment-actions">
				{/* <button type="button" className="action-btn">
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
					>
						<path d="M12 19V5M5 12l7-7 7 7" />
					</svg>
					{comment.upvotes}
				</button> */}
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
					<form onSubmit={formMethods.handleSubmit(onSubmit)}>
						<input {...formMethods.register("message")} />
						<button type="submit">Send</button>
						<button type="button" onClick={() => setIsReplying(false)}>
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
          margin-left: 16px; padding-left: 16px; border-left: 2px solid rgba(255, 255, 255, 0.05); margin-top: 12px;
        }
        .comment-header { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
        .comment-author { font-family: var(--font-chakra); font-weight: 700; font-size: 13px; color: #fff; }
        .comment-time { font-family: var(--font-nunito); font-size: 11px; color: #666; }
        .comment-rating { color: var(--neon-yellow); font-size: 11px; margin-left: auto; letter-spacing: 0.1em; }
        .comment-text { font-family: var(--font-nunito); font-size: 14px; color: #ccc; line-height: 1.5; margin: 4px 0; }
        .comment-actions { display: flex; gap: 16px; align-items: center; margin-top: 8px; }
        .action-btn {
          background: none; border: none; color: #888; font-family: var(--font-chakra); font-size: 11px;
          font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 0; transition: color 0.2s;
        }
        .action-btn:hover { color: #fff; }
      `}</style>
		</div>
	);
};

export function ExpandedPinView({ pinId, onClose }: ExpandedPinViewProps) {
	const utils = trpc.useUtils();
	const { data: sessionData } = useSession();
	const { data: pin } = trpc.pin.getById.useQuery(
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

	const color = getFilterColor(
		pin?.pinTags ? pin.pinTags[0]?.tag.title || "" : "",
	);

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div className="modal-overlay" onClick={onClose}>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<div className="scroll-area custom-vertical-scrollbar">
					{/* HEADER */}
					<div className="modal-header">
						<div>
							<span className="badge" style={{ color }}>
								{pin?.pinTags?.map((pt) => pt.tag.title).join(", ")}
							</span>
							<h2>{pin?.title}</h2>
						</div>
						<button type="button" className="close-btn" onClick={onClose}>
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

					{/* HORIZONTAL BENTO GALLERY */}
					<div className="photo-gallery custom-scrollbar">
						{pin?.images?.map((img) => (
							<div key={img.id} className={`photo-placeholder large`}>
								<Image alt="" src={`${img.url}`} fill objectFit="cover" />
								{/* <svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="rgba(255,255,255,0.2)"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
									<circle cx="8.5" cy="8.5" r="1.5"></circle>
									<polyline points="21 15 16 10 5 21"></polyline>
								</svg> */}
							</div>
						))}
					</div>

					{/* BODY: INTEL DASHBOARD */}
					<div className="modal-body">
						<p className="description">{pin?.description}</p>

						<div className="meta-grid">
							{/* PIN ID */}
							<div className="meta-item">
								<span className="meta-label">PIN ID</span>
								<span className="meta-value font-mono">
									{pin?.id?.padStart(7, "0")}
								</span>
							</div>

							{/* OWNER */}
							<div className="meta-item">
								<span className="meta-label">OWNED BY</span>
								<span className="meta-value text-muted">{pin?.ownerId}</span>
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
								<span className="meta-value text-neon-green font-cubao-wide">
									{pin?.status}
								</span>
							</div>

							{/* RATING */}
							{/* <div className="meta-item">
								<span className="meta-label">AVG RATING</span>
								<span className="meta-value text-neon-yellow">★ 5.0 / 5.0</span>
							</div> */}

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
							<div className="meta-item">
								<span className="meta-label">LAST UPDATED</span>
								<span className="meta-value">
									{new Date(pin?.updatedAt || "").toLocaleString("default", {
										month: "long",
										year: "numeric",
										day: "2-digit",
									})}
								</span>
							</div>
						</div>

						{!isDeleting && sessionData?.user.id === pin?.ownerId && (
							<button type="button" onClick={() => setIsDeleting(true)}>
								delete pin
							</button>
						)}

						{isDeleting && (
							<div>
								Are you sure you want to delete?
								<div
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										width: "full",
									}}
								>
									<button type="button" onClick={onDelete}>
										delete
									</button>
									<button type="button" onClick={() => setIsDeleting(false)}>
										cancel
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
										COMMENT
									</button>
								)
							) : (
								<form onSubmit={formMethods.handleSubmit(onSubmit)}>
									<input {...formMethods.register("message")} />
									<button type="submit">Send</button>
									<button type="button" onClick={() => setIsReplying(false)}>
										Cancel
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
                position: fixed; inset: 0; 
                background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px);
                z-index: 200; display: flex; align-items: center; justify-content: center;
                padding: 24px; animation: fadeIn 0.2s ease-out; pointer-events: auto;
            }

            .modal-content {
                background: rgba(10, 10, 12, 0.95);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-top: 4px solid ${color}; 
                border-radius: 24px;
                width: 100%; 
                max-width: 500px; 
                
                height: 70vh; 
                
                display: flex; 
                flex-direction: column;
                box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8);
                animation: scalePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                
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
                /* Fades from solid background color to transparent */
                background: linear-gradient(to top, rgba(10, 10, 12, 1) 10%, rgba(10, 10, 12, 0) 100%);
                pointer-events: none; /* Ensures you can still click text behind the fade */
                border-bottom-left-radius: 24px;
                border-bottom-right-radius: 24px;
            }

            .custom-vertical-scrollbar::-webkit-scrollbar {
                width: 6px;
            }
            .custom-vertical-scrollbar::-webkit-scrollbar-track {
                background: transparent;
                margin-top: 24px;
                margin-bottom: 24px;
            }
            .custom-vertical-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 10px;
            }
            .custom-vertical-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
            .badge { font-family: var(--font-cubao-wide); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; }
            h2 { font-family: var(--font-chakra); color: white; font-size: 26px; font-weight: 800; margin: 4px 0 0 0; }

            .close-btn {
                background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 50%; width: 44px; height: 44px; color: white; cursor: pointer;
                display: flex; align-items: center; justify-content: center; transition: all 0.2s;
                flex-shrink: 0;
            }
            .close-btn:active { transform: scale(0.9); background: rgba(255, 255, 255, 0.1); }

            .photo-gallery {
                display: grid;
                grid-template-rows: repeat(2, 90px);
                grid-auto-flow: column;
                gap: 12px;
                margin-bottom: 24px;
                overflow-x: auto;
                overscroll-behavior-x: contain;
                padding-bottom: 8px;
                scroll-snap-type: x mandatory;
            }
            .no-scrollbar::-webkit-scrollbar { display: none; }

            .photo-placeholder {
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                scroll-snap-align: start;
                position: relative;
                overflow: hidden;
            }

            .photo-placeholder::after {
                content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
                animation: shimmer 2s infinite;
            }

            .photo-placeholder.large {
                grid-row: span 2; /* Spans both rows (192px tall including gap) */
                width: 192px;
            }

            .photo-placeholder.small {
                grid-row: span 1; /* Spans 1 row (90px tall) */
                width: 140px;
            }

            .custom-scrollbar::-webkit-scrollbar {
                height: 6px; /* Thin horizontal scrollbar */
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.02);
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 10px;
                transition: background 0.2s;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3); /* Highlights when hovered */
            }

            .modal-body { display: flex; flex-direction: column; gap: 24px; }
            .description { font-family: var(--font-nunito); font-size: 15px; color: #ccc; line-height: 1.5; margin: 0; }

            .meta-grid {
                display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
                background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 16px; padding: 20px;
            }
            .meta-item { display: flex; flex-direction: column; gap: 4px; }

            .forum-section {
                margin-top: 16px;
                border-top: 1px solid rgba(255, 255, 255, 0.05);
                padding-top: 24px;
            }

            .section-title {
                font-family: var(--font-chakra);
                font-size: 12px;
                font-weight: 900;
                letter-spacing: 0.15em;
                color: #666;
                margin-bottom: 20px;
            }

            .action-btn {
                background: none;
                border: none;
                color: #888;
                font-family: var(--font-chakra);
                font-size: 11px;
                font-weight: 700;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 0;
                transition: color 0.2s;
            }

            .action-btn:hover {
                color: #fff;
            }

            .col-span-2 { grid-column: span 2; } 

            .meta-label { font-family: var(--font-chakra); font-size: 10px; font-weight: 800; color: #666; letter-spacing: 0.1em; }
            .meta-value { font-family: var(--font-nunito); font-size: 14px; font-weight: 700; color: #eee; }

            .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; letter-spacing: 0.05em; }
            .font-cubao-wide { font-family: var(--font-cubao-wide); font-weight: 100; letter-spacing: 0.1em;}
            .text-muted { color: #888; font-style: italic; }
            .text-neon-green { color: var(--neon-green, #00FF99); text-shadow: 0 0 10px rgba(0, 255, 153, 0.3); }
            .text-neon-yellow { color: var(--neon-yellow, #FFD700); text-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }

            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes scalePop { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
            @keyframes shimmer { 100% { left: 200%; } }
      `}</style>
		</div>
	);
}
