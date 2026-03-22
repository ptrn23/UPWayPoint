import type { PinRouterOutputs } from "@repo/api";
import { getFilterColor } from "./TopBar";
type Pin = PinRouterOutputs["getAll"][number];

interface NeonPinProps {
	pin: Pin;
	isSelected: boolean;
	isLocked: boolean;
	isVisible: boolean;
	onClick: () => void;
}

export function NeonPin({
	pin,
	isSelected,
	isLocked,
	isVisible,
	onClick,
}: NeonPinProps) {
	const color = getFilterColor(pin?.pinTags[0]?.tag.title || "");
	const baseScale = isVisible ? (isSelected ? 1.2 : 1) : 0;
	const opacity = isVisible ? 1 : 0;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			className="pin-interactive-area"
			onClick={(e) => {
				e.stopPropagation();
				if (isVisible) onClick();
			}}
			style={{
				width: "44px",
				height: "44px",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				cursor: isVisible ? "pointer" : "default",
				pointerEvents: isVisible ? "auto" : "none",
				transform: `scale(${baseScale})`,
				opacity: opacity,
				transition:
					"transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease",
			}}
		>
			{/* diamond shape */}
			<div
				style={{
					width: "100%",
					height: "100%",
					transform: "rotate(45deg)",
					border: `2px solid ${color}`,
					backgroundColor: isSelected ? color : "var(--bg-panel)",
					boxShadow: isLocked
						? `0 0 30px 5px ${color}`
						: isSelected
							? `0 0 15px ${color}`
							: `none`,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					transition: "all 0.3s ease",
				}}
			>
				{/* icon */}
				<div
					style={{
						transform: "rotate(-45deg)",
						fontSize: "18px",
						color: isSelected ? "var(--bg-base)" : color,
						fontFamily: "var(--font-cubao-wide), sans-serif",
					}}
				>
					{pin?.title[0]?.toUpperCase()}
				</div>
			</div>
		</div>
	);
}