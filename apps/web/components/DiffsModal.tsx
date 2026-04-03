"use client";

import type { PinRouterOutputs } from "@repo/api";
import type { PinDiffType } from "@/types/pins";
import { getPinColor } from "@/data/pin-categories";
import { clsxm } from "@repo/ui/clsxm";

interface IDiffsModal {
	current: PinRouterOutputs["getSimpleById"];
	diffs: PinDiffType;
	onCancel: () => void;
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

export function DiffsModal({ current, diffs, onCancel }: IDiffsModal) {
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
		<div className="fixed inset-0 w-screen h-screen bg-border-color backdrop-blur-md flex items-center justify-center z-[200] p-5">
			<div className="w-full max-w-[800px] p-6 animate-slide-up tactical-panel flex flex-col gap-5">
				<div className="flex items-center gap-3 border-b border-border-color pb-4">
					<h2 className="font-cubao-wide text-primary text-[20px] m-0 tracking-[0.05em]">
						VIEW PIN DIFFERENCES
					</h2>
				</div>

				<div className="flex flex-row gap-6 w-full">
					<div className="flex flex-col gap-5 w-full">
						{titleDiffs && (
							<div className="flex flex-col gap-2">
								<span className="font-chakra text-[12px] text-neon-blue tracking-[0.1em] font-bold">
									TITLE
								</span>
								<div className="flex flex-row leading-tight flex-wrap items-end w-full">
									{currentTitle?.map((ct, i) => (
										<span
											key={`${ct.type} ${ct.value} ${i + 1}`}
											className={clsxm(
												"text-primary font-nunito text-[16px] p-1",
												ct.type === "removed" &&
													"text-status-danger bg-status-danger/15",
											)}
										>
											{ct.type === "removed" && "- "}
											{ct.value}
										</span>
									))}
								</div>
							</div>
						)}

						{descDiffs && (
							<div className="flex flex-col gap-2">
								<span className="font-chakra text-[12px] text-neon-blue tracking-[0.1em] font-bold">
									DESCRIPTION
								</span>
								<div className="flex flex-row leading-tight flex-wrap items-end w-full">
									{currentDesc?.map((cd, i) => (
										<span
											key={`${cd.type} ${cd.value} ${i + 1}`}
											className={clsxm(
												"text-primary font-nunito text-[16px] p-1",
												cd.type === "removed" &&
													"text-status-danger bg-status-danger/15",
											)}
										>
											{cd.type === "removed" && "- "}
											{cd.value}
										</span>
									))}
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
					<div className="flex flex-row gap-6 w-full">
						<div className="flex flex-col gap-5 w-full">
							{titleDiffs && (
								<div className="flex flex-col gap-2">
									<span className="font-chakra text-[12px] text-neon-blue tracking-[0.1em] font-bold">
										TITLE
									</span>
									<div className="flex flex-row leading-tight flex-wrap items-end w-full">
										{afterTitle?.map((ct, i) => (
											<span
												key={`${ct.type} ${ct.value} ${i + 1}`}
												className={clsxm(
													"text-primary font-nunito text-[16px] p-1",
													ct.type === "added" &&
														"text-status-danger bg-status-danger/15",
												)}
											>
												{ct.type === "added" && "+ "}
												{ct.value}
											</span>
										))}
									</div>
								</div>
							)}

							{descDiffs && (
								<div className="flex flex-col gap-2">
									<span className="font-chakra text-[12px] text-neon-blue tracking-[0.1em] font-bold">
										DESCRIPTION
									</span>

									<div className="flex flex-row leading-tight flex-wrap items-end w-full">
										{afterDesc?.map((ad, i) => (
											<span
												key={`${ad.type} ${ad.value} ${i + 1}`}
												className={clsxm(
													"text-primary font-nunito text-[16px] p-1",
													ad.type === "added" &&
														"text-status-success bg-status-success/15",
												)}
											>
												{ad.type === "added" && "+ "}
												{ad.value}
											</span>
										))}
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
				</div>
				<div className="flex gap-3 mt-3">
					<button
						type="button"
						className="tactical-button flex-1 p-3.5 text-[13px] tracking-[0.05em]"
						onClick={onCancel}
					>
						CANCEL
					</button>
					<button
						type="submit"
						className="tactical-button-primary flex-1 p-3.5 text-[13px] tracking-[0.05em] disabled:opacity-50 disabled:cursor-not-allowed"
					>
						CONFIRM
					</button>
				</div>
			</div>
		</div>
	);
}
