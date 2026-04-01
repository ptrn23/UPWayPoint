"use client";

import { useMemo, useState } from "react";
import { PinDetailsCard } from "@/components/PinDetailsCard";
import { ExpandedPinView } from "@/components/ExpandedPinView";
import { useSession } from "@/lib/auth-client";

interface HUDProps {
	selectedPinId: string | null;
	onLockClick: () => void;
	isLocked: boolean;
	onClearSelection?: () => void;
	onAddPinClick?: () => void;
}

export function HeadsUpDisplay({
	selectedPinId,
	onLockClick,
	isLocked,
	onClearSelection,
	onAddPinClick,
}: HUDProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const handleClear = () => {
		setIsExpanded(false);
		if (onClearSelection) onClearSelection();
	};

	const { data: sessionData } = useSession();
	const isLoggedIn = useMemo(() => !!sessionData?.user?.id, [sessionData]);
    
	return (
		<div className="absolute inset-0 w-full h-full pointer-events-none z-[90] flex flex-col justify-end">
			
			{/* BOTTOM SECTION */}
			<div className="p-5 pointer-events-auto flex flex-col items-center gap-2.5 mb-5">
				
				{/* ADD PIN BUTTON (Only if NO pin is selected AND we are logged in) */}
				{!selectedPinId && isLoggedIn && (
					<button
						type="button"
						className="w-16 h-16 flex items-center justify-center rounded-full bg-panel border-2 border-neon-blue text-neon-blue shadow-[0_0_20px_var(--shadow-glow),inset_0_0_10px_var(--shadow-glow)] cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] animate-pulse-glow hover:bg-neon-blue hover:text-base hover:scale-110 hover:shadow-[0_0_30px_var(--shadow-glow),inset_0_0_15px_var(--shadow-glow)] active:scale-95"
						onClick={onAddPinClick}
						title="Deploy New Waypoint"
					>
						<svg
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<line x1="12" y1="5" x2="12" y2="19"></line>
							<line x1="5" y1="12" x2="19" y2="12"></line>
						</svg>
					</button>
				)}

				{/* DETAILS CARD (Only if pin IS selected) */}
				{selectedPinId && (
					<PinDetailsCard
						pinId={selectedPinId}
						isLocked={isLocked}
						onLockClick={onLockClick}
						onClose={onClearSelection}
						onExpand={() => setIsExpanded(true)}
					/>
				)}

				{/* EXPANDED MODAL LAYER (Renders on top of everything if isExpanded is true) */}
				{selectedPinId && isExpanded && (
					<ExpandedPinView
						pinId={selectedPinId}
						onClose={() => {
							setIsExpanded(false);
							onClearSelection?.();
						}}
					/>
				)}
			</div>
		</div>
	);
}