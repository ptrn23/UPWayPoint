"use client";

import type { ModificationRouterOutputs, PinRouterOutputs } from "@repo/api";
import type { PinDiffType } from "@/types/pins";
import { trpc } from "@/lib/trpc";
import { useMemo, useState } from "react";
import { DiffsModal } from "./DiffsModal";
interface IHistoryModal {
  pinId: string;
  onClose: () => void;
}
export function HistoryModal({ pinId, onClose }: IHistoryModal) {
  const [mod, setMod] =
    useState<ModificationRouterOutputs["getPendingByUser"][number]>();
  const [diffs, setDiffs] = useState<PinDiffType | undefined>();
  const [current, setCurrent] = useState<
    PinRouterOutputs["getSimpleById"] | undefined
  >();
  const { data: modifications } = trpc.modification.getByPinId.useQuery({
    pinId: pinId,
  });
  const parsedMods = useMemo(
    () => modifications?.filter((m) => m.status === "APPLIED") || [],
    [modifications],
  );

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      onClick={() => {
        onClose();
      }}
      className="cursor-pointer fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-md flex items-center justify-center z-[200] p-5"
    >
      {diffs && mod && (
        <DiffsModal
          isUser
          isApplied={mod.status !== "PENDING"}
          onCancel={() => setDiffs(undefined)}
          current={current}
          diffs={diffs}
          modId={mod.id}
        />
      )}
      {/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[500px] p-6 animate-slide-up tactical-panel flex flex-col gap-5"
      >
        <h3 className="font-cubao-wide text-primary text-[20px] m-0 tracking-[0.05em]">
          PIN MODIFICATION HISTORY
        </h3>
        <div className="flex flex-col gap-4 max-h-[53vh] overflow-y-auto ">
          {parsedMods.map((m) => {
            const after = m.after as PinDiffType | undefined;
            const fields = Object.keys(after?.data || {});
            if ((after?.tags.length || 0) > 0) fields.push("tags");
            return (
              <div
                key={m.id}
                className="font-chakra flex flex-col gap-1 pb-3 border border-solid border-x-0 border-t-0 border-border-color"
              >
                <div className="flex flex-row justify-between items-start">
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center gap-2">
                      <span className="text-neon-blue">Modified: </span>
                      {fields.join(", ")}
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <span className="text-neon-blue">By: </span>
                      {m.owner}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-9 h-9 bg-transparent border border-border-color rounded-lg flex items-center justify-center text-secondary cursor-pointer shrink-0 transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:bg-neon-blue/15 hover:border-neon-blue hover:text-neon-blue hover:scale-105 active:scale-95"
                    onClick={() => {
                      setDiffs(after);
                      setCurrent(m.pin);
                      setMod(m);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-file-diff-icon lucide-file-diff"
                    >
                      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                      <path d="M9 10h6" />
                      <path d="M12 13V7" />
                      <path d="M9 17h6" />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-[#aaa] flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-2">
                    <span className="">Applied On: </span>
                    {new Date(m.reviewedAt || "").toLocaleString("default", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <span className="">Reviewer: </span>
                    {m.reviewer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className="tactical-button w-full sm:w-fit p-3.5 px-6 text-[13px] tracking-[0.05em]"
          onClick={onClose}
        >
          BACK
        </button>
      </div>
    </div>
  );
}
