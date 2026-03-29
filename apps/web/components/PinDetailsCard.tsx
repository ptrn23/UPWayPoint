"use client";

import { getPinColor } from "@/data/pin-categories";
import { trpc } from "@/lib/trpc";
import { clsxm } from "@repo/ui/clsxm";

// STYLES
const detailsCardStyles = `
  p-[24px] w-full max-w-[400px] flex flex-col gap-[16px]
  bg-[var(--bg-panel)] backdrop-filter-[blur(20px)]
  border border-solid border-[1px] border-[var(--border-color)] border-t-[3px] rounded-[20px]
  shadow-[0_20px_40px_[var(--border-color)]]
  `;

interface PinDetailsCardProps {
	pinId: string;
	isLocked: boolean;
	onLockClick: () => void;
	onClose?: () => void;
	onExpand: () => void;
}

export function PinDetailsCard({
	pinId,
	isLocked,
	onLockClick,
	onClose,
	onExpand,
}: PinDetailsCardProps) {
	const { data: pin, isLoading: isPinLoading } =
		trpc.pin.getSimpleById.useQuery(
			{ id: pinId },
			{ refetchOnWindowFocus: false },
		);
	const color = getPinColor(
		pin?.pinTags ? pin?.pinTags[0]?.tag.title || "" : "",
	);

	if (isPinLoading)
		return (
			<div
				className={detailsCardStyles}
				style={{
					borderTop: "3px solid black",
					animation:
						"slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), pulse 1s ease-in-out infinite",
					minHeight: "156px",
				}}
			></div>
		);

	return (
		<div style={{ borderTopColor: `${color}` }} className={detailsCardStyles}>
			{/* HEADER */}
			<div className="card-header">
				<div>
					<h2>{pin?.title}</h2>
					<span className="badge" style={{ color: color }}>
						{pin?.pinTags?.map((pt) => pt.tag.title).join(", ")}
					</span>
				</div>

				{/* close button */}
				{onClose && (
					<button type="button" onClick={onClose} className="close-btn">
						<svg
							width="24"
							height="24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				)}
			</div>

			{/* BODY */}
			<div className="card-body">
				<p>{pin?.description}</p>
			</div>

			{/* FOOTER ACTIONS */}
			<div className="card-footer">
				<button type="button" className="expand-button" onClick={onExpand}>
					DETAILS
				</button>

				<button
					type="button"
					className={clsxm(
						`
            flex w-full justify-center p-[14px] rounded-[12px] border-none font-[var(--font-chakra)] text-[13px] tracking-[0.05em] cursor-pointer
            transition-all duration-[0.2s] ease-[cubic-bezier(0.175, 0.885, 0.32, 1.275)] text-[var(--bg-base)] bg-[var(--text-primary)] font-[900]
          `,
						isLocked && "opacity-[40%] scale-[95%]",
					)}
					onClick={onLockClick}
				>
					{isLocked ? "TARGET LOCKED" : "LOCK TARGET"}
				</button>
			</div>

			<style jsx>{`

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        h2 {
          font-size: 20px;
          font-weight: 800;
          margin: 0 0 4px 0;
          color: var(--text-primary);
          font-family: var(--font-chakra);
        }

        .badge {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-family: var(--font-cubao-wide);
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          color: var(--text-primary);
        }

        .card-body p {
          font-size: 14px;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.5;
          font-family: var(--font-nunito);
        }

        .card-footer {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }

        .expand-button {
          padding: 14px 20px;
          border-radius: 12px;
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-primary);
          font-weight: 900;
          font-family: var(--font-chakra);
          font-size: 13px;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
        }

        .expand-button:hover {
          background: var(--bg-panel-hover);
        }

        .expand-button:active { 
          transform: scale(0.95); 
          background: var(--border-color); 
        }

      `}</style>
		</div>
	);
}
