"use client";

import type { PinRouterOutputs } from "@repo/api";
import type { PinDiffType } from "@/types/pins";
import { getPinColor } from "@/data/pin-categories";
import { clsxm } from "@repo/ui/clsxm";
import { trpc } from "@/lib/trpc";
interface IDiffsModal {
	current: PinRouterOutputs["getSimpleById"];
	diffs: PinDiffType;
	onCancel: () => void;
	modId: string;
}

type DiffChunk =
	| { type: "same"; value: string }
	| { type: "removed"; value: string }
	| { type: "added"; value: string };

function diffStrings(before: string, after: string): DiffChunk[] {
	const a = before.split(" ");
	const b = after.split(" ");
	const m = a.length;
	const n = b.length;

	// Build LCS table
	const dp: number[][] = Array.from({ length: m + 1 }, () =>
		new Array(n + 1).fill(0),
	);
	for (let i = 1; i <= m; i++) {
		for (let j = 1; j <= n; j++) {
			dp[i]![j] =
				a[i - 1] === b[j - 1]
					? dp[i - 1]![j - 1]! + 1
					: Math.max(dp[i - 1]![j]!, dp[i]![j - 1]!);
		}
	}

	// Backtrack to build chunks
	const chunks: DiffChunk[] = [];
	let i = m,
		j = n;
	while (i > 0 || j > 0) {
		if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
			chunks.push({ type: "same", value: a[i - 1] as string });
			i--;
			j--;
		} else if (j > 0 && (i === 0 || dp[i]![j - 1]! >= dp[i - 1]![j]!)) {
			chunks.push({ type: "added", value: b[j - 1] as string });
			j--;
		} else {
			chunks.push({ type: "removed", value: a[i - 1] as string });
			i--;
		}
	}

	return chunks.reverse();
}

export function DiffsModal({ current, diffs, onCancel, modId }: IDiffsModal) {
	const utils = trpc.useUtils();

	const applyMod = trpc.pin.applyUpdate.useMutation({
		onSuccess: () => {
			utils.modification.getPending.invalidate();
			utils.pin.getAll.invalidate();
			utils.pin.getAllAdmin.invalidate();
			utils.pin.getStatusCounts.invalidate();
			onCancel();
		},
	});
	const rejectMod = trpc.pin.rejectUpdate.useMutation({
		onSuccess: () => {
			utils.modification.getPending.invalidate();
			onCancel();
		},
	});

	if (!(current && diffs)) return;

	// THIS IS FOR THE FUTURE DO NOT DELETE:
	// // in the current tags as well as in the diffs (to be toggled OFF)
	// const removedTags = current.pinTags
	// 	.map((pt) => pt.tag)
	// 	.filter((t) => diffs.tags.includes(t.id));

	// // in the diffs but not in the current tags (to be toggled ON)
	// const newTags = diffs.tags.filter(
	// 	(t) => !current.pinTags.map((pt) => pt.tag.id).includes(t),
	// );

	// NOTE TO FUTURE ME: WE NEED TO CHANGE HOW TAGS ARE ADDED TO THE after FIELD!!
	// IF A TAG ID IS IN THE ARRAY, IT MUST BE TOGGLED. NOT JUST ADDED. THIS ALLOWS TAGS TO BE REMOVED!!

	// another note, since we only have 1 tag for now we can
	// just change the way we handle it in the future

	const titleDiffs = diffs.data.title
		? diffStrings(current.title, diffs.data.title)
		: undefined;

	const descDiffs = diffs.data.description
		? diffStrings(current.description || "", diffs.data.description)
		: undefined;

	const currentDesc = descDiffs?.filter((dd) => dd.type !== "added");
	const currentTitle = titleDiffs?.filter((dd) => dd.type !== "added");
	const afterDesc = descDiffs?.filter((dd) => dd.type !== "removed");
	const afterTitle = titleDiffs?.filter((dd) => dd.type !== "removed");

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			onClick={() => {
				onCancel();
			}}
			className="cursor-pointer fixed inset-0 w-screen h-screen bg-black/15 backdrop-blur-md flex items-center justify-center z-[200] p-5"
		>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				onClick={(e) => e.stopPropagation()}
				className="w-full max-w-[400px] sm:max-w-[900px] p-6 animate-slide-up tactical-panel flex flex-col gap-5"
			>
				<div className="flex flex-row gap-6 w-full">
					<div className="flex flex-col gap-5 w-full border border-dashed border-y-0 border-l-0 border-r-2 border-border-color">
						<h3 className="font-cubao-wide text-primary text-[20px] m-0 tracking-[0.05em]">
							CURRENT PIN DETAILS
						</h3>
						{titleDiffs && (
							<div className="flex flex-col gap-2">
								<span className="font-chakra text-[12px] text-neon-blue tracking-[0.1em] font-bold">
									TITLE
								</span>
								<div className="flex flex-row leading-tight flex-wrap items-end w-full">
									{currentTitle?.map((ct, i) => {
										const isFirstInSequence =
											i !== 0 ? currentTitle[i - 1]?.type !== "removed" : true;
										return (
											<span
												key={`${ct.type} ${ct.value} ${i + 1}`}
												className={clsxm(
													"text-primary font-nunito text-[16px] p-1",
													ct.type === "removed" &&
														"text-status-danger bg-status-danger/15",
													!isFirstInSequence && "pl-0",
												)}
											>
												{ct.type === "removed" && isFirstInSequence && "- "}
												{ct.value}
											</span>
										);
									})}
								</div>
							</div>
						)}

						{descDiffs && (
							<div className="flex flex-col gap-2">
								<span className="font-chakra text-[12px] text-neon-blue tracking-[0.1em] font-bold">
									DESCRIPTION
								</span>
								<div className="flex flex-row leading-tight flex-wrap items-end w-full">
									{currentDesc?.map((cd, i) => {
										const isFirstInSequence =
											i !== 0 ? currentDesc[i - 1]?.type !== "removed" : true;
										return (
											<span
												key={`${cd.type} ${cd.value} ${i + 1}`}
												className={clsxm(
													"text-primary font-nunito text-[16px] p-1",
													cd.type === "removed" &&
														"text-status-danger bg-status-danger/15",
													!isFirstInSequence && "pl-0",
												)}
											>
												{cd.type === "removed" && isFirstInSequence && "- "}
												{cd.value}
											</span>
										);
									})}
								</div>
							</div>
						)}

						{diffs.tags.length > 0 && (
							<div className="flex flex-col gap-2">
								<span className="font-chakra text-[12px] text-neon-blue tracking-[0.1em] font-bold">
									PIN TYPE
								</span>
								<div className="grid grid-cols-2 gap-2">
									{current.pinTags.map((pt) => {
										const t = pt.tag;
										const tagColor = getPinColor(t.title);

										return (
											<div
												key={t.id}
												className="bg-transparent border border-border-color text-secondary p-2.5 rounded-md font-chakra text-[11px] cursor-pointer transition-all duration-200 hover:bg-panel-hover hover:text-primary"
												style={{
													backgroundColor: `color-mix(in srgb, ${tagColor} 25%, transparent)`,
													borderColor: tagColor,
													color: tagColor,
													boxShadow: `inset 0 0 10px color-mix(in srgb, ${tagColor} 40%, transparent)`,
												}}
											>
												{t.title.toUpperCase()}
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>
					<div className="flex flex-col gap-5 w-full">
						<h3 className="font-cubao-wide text-primary text-[20px] m-0 tracking-[0.05em]">
							MODIFIED PIN DETAILS
						</h3>
						{titleDiffs && (
							<div className="flex flex-col gap-2">
								<span className="font-chakra text-[12px] text-neon-blue tracking-[0.1em] font-bold">
									TITLE
								</span>
								<div className="flex flex-row leading-tight flex-wrap items-end w-full">
									{afterTitle?.map((ct, i) => {
										const isFirstInSequence =
											i !== 0 ? afterTitle[i - 1]?.type !== "added" : true;
										return (
											<span
												key={`${ct.type} ${ct.value} ${i + 1}`}
												className={clsxm(
													"text-primary font-nunito text-[16px] p-1",
													ct.type === "added" &&
														"text-status-success bg-status-success/15",
													!isFirstInSequence && "pl-0",
												)}
											>
												{ct.type === "added" && isFirstInSequence && "+ "}
												{ct.value}
											</span>
										);
									})}
								</div>
							</div>
						)}

						{descDiffs && (
							<div className="flex flex-col gap-2">
								<span className="font-chakra text-[12px] text-neon-blue tracking-[0.1em] font-bold">
									DESCRIPTION
								</span>

								<div className="flex flex-row leading-tight flex-wrap items-end w-full">
									{afterDesc?.map((ad, i) => {
										const isFirstInSequence =
											i !== 0 ? afterDesc[i - 1]?.type !== "added" : true;

										return (
											<span
												key={`${ad.type} ${ad.value} ${i + 1}`}
												className={clsxm(
													"text-primary font-nunito text-[16px] p-1",
													ad.type === "added" &&
														"text-status-success bg-status-success/15",
													!isFirstInSequence && "pl-0",
												)}
											>
												{ad.type === "added" && isFirstInSequence && "+ "}
												{ad.value}
											</span>
										);
									})}
								</div>
							</div>
						)}

						{diffs.tags.length > 0 && (
							<div className="flex flex-col gap-2">
								<span className="font-chakra text-[12px] text-neon-blue tracking-[0.1em] font-bold">
									PIN TYPE
								</span>
								<div className="grid grid-cols-2 gap-2">
									{diffs.tags.map((t) => {
										const tagColor = getPinColor(t);

										return (
											<div
												key={t}
												className="bg-transparent border border-border-color text-secondary p-2.5 rounded-md font-chakra text-[11px] cursor-pointer transition-all duration-200 hover:bg-panel-hover hover:text-primary"
												style={{
													backgroundColor: `color-mix(in srgb, ${tagColor} 25%, transparent)`,
													borderColor: tagColor,
													color: tagColor,
													boxShadow: `inset 0 0 10px color-mix(in srgb, ${tagColor} 40%, transparent)`,
												}}
											>
												{t.toUpperCase()}
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>
				</div>
				<div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 mt-3">
					<button
						type="button"
						className="tactical-button w-full sm:w-fit p-3.5 px-6 text-[13px] tracking-[0.05em]"
						onClick={onCancel}
					>
						CANCEL
					</button>
					<div className="flex flex-col sm:flex-row gap-3">
						<button
							type="button"
							className="bg-status-danger/15 w-full sm:w-fit px-8 border border-status-danger text-status-danger shadow-[0_0_10px_var(--shadow-glow)] rounded-lg font-chakra font-semibold cursor-pointer transition-all duration-200 hover:bg-status-danger hover:text-base hover:shadow-[0_0_20px_var(--status-danger)] active:translate-y-[1px] p-3.5 text-[13px] tracking-[0.05em] disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={() => rejectMod.mutate({ id: modId })}
						>
							REJECT
						</button>
						<button
							type="button"
							className="bg-status-success/15 w-full sm:w-fit px-8 border border-status-success text-status-success shadow-[0_0_10px_var(--shadow-glow)] rounded-lg font-chakra font-semibold cursor-pointer transition-all duration-200 hover:bg-status-success hover:text-base hover:shadow-[0_0_20px_var(--status-success)] active:translate-y-[1px] p-3.5 text-[13px] tracking-[0.05em] disabled:opacity-50 disabled:cursor-not-allowed"
							onClick={() => applyMod.mutate({ id: modId })}
						>
							APPLY
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
