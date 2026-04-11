"use client";

import { getPinColor } from "@/data/pin-categories";
import { useSession } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/hooks/useLanguage";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { EditPinModal } from "./EditPinModal";
import { HistoryModal } from "./HistoryModal";

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
    onSuccess() {
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
    <div
      className={`mt-4 ${depth > 0 ? "ml-4 pl-4 border-l-[2px] border-border-color mt-3" : ""}`}
    >
      <div className="flex items-center gap-3 mb-1">
        <span className="font-chakra font-bold text-[13px] text-primary">
          {comment.authorName}
        </span>
        <span className="font-nunito text-[11px] text-secondary">
          {new Date(comment.createdAt).toLocaleString("default")}
        </span>
      </div>

      <p className="font-nunito text-[14px] text-primary leading-relaxed my-1">
        {comment.message}
      </p>

      <div className="flex gap-4 items-center mt-2">
        {!isReplying ? (
          sessionData &&
          depth < 3 && (
            <button
              type="button"
              className="bg-transparent border-none text-secondary font-chakra text-[11px] font-bold cursor-pointer flex items-center gap-1 p-0 transition-colors duration-200 hover:text-primary"
              onClick={() => setIsReplying(true)}
            >
              REPLY
            </button>
          )
        ) : (
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className="flex flex-col w-full gap-3"
          >
            <input
              {...formMethods.register("message")}
              placeholder="Write a reply..."
              className="w-full rounded-md border p-2 flex-1 bg-base border border-border-color rounded-md py-2 px-3 text-primary font-nunito text-[13px] outline-none focus:border-neon-blue"
            />
            <div className="flex w-full justify-end gap-2">
              <button
                type="submit"
                className="tactical-button-primary px-3 py-1.5 text-[11px] rounded-md"
              >
                SEND
              </button>
              <button
                type="button"
                className="tactical-button px-3 py-1.5 text-[11px] rounded-md"
                onClick={() => setIsReplying(false)}
              >
                CANCEL
              </button>
            </div>
          </form>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentNode key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export function ExpandedPinView({ pinId, onClose }: ExpandedPinViewProps) {
  const utils = trpc.useUtils();
  const { t } = useLanguage();
  const { data: sessionData } = useSession();
  const { data: pin, isLoading: isPinLoading } = trpc.pin.getById.useQuery(
    { id: pinId },
    { refetchOnWindowFocus: false },
  );

  const createComment = trpc.comment.create.useMutation({
    onSuccess() {
      utils.pin.getById.invalidate();
      setIsReplying(false);
    },
  });
  const deletePin = trpc.pin.userDelete.useMutation({
    onSuccess() {
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
  const [isViewingHistory, setIsViewingHistory] = useState(false);

  if (isPinLoading || !pin)
    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
      // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
      <div
        className="fixed inset-0 bg-border-color backdrop-blur-md z-[200] flex items-center justify-center p-6 animate-fade-in pointer-events-auto"
        onClick={onClose}
      >
        <div
          className="w-full max-w-[500px] h-[70vh] min-h-[156px] bg-base border border-border-color border-t-4 rounded-[24px] shadow-[0_30px_60px_var(--border-color)] animate-[slideUp_0.4s_cubic-bezier(0.175,0.885,0.32,1.275),pulse_1s_ease-in-out_infinite]"
          style={{ borderTopColor: "black" }}
        ></div>
      </div>
    );

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div
      className="fixed inset-0 bg-border-color backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-fade-in pointer-events-auto"
      onClick={onClose}
    >
      {/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        className="w-full max-w-[500px] h-[70vh] bg-panel border border-border-color rounded-[24px] flex flex-col shadow-[0_30px_60px_var(--border-color)] overflow-hidden relative p-0 animate-[scalePop_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)]"
        style={{ borderTop: `4px solid ${color}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {isEditing && (
          <EditPinModal
            onSave={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
            pin={pin}
          />
        )}

        {isViewingHistory && (
          <HistoryModal
            pinId={pinId}
            onClose={() => setIsViewingHistory(false)}
          />
        )}

        <div className="flex-1 overflow-y-auto p-7 pb-[60px] custom-vertical-scrollbar">
          {/* HEADER */}
          <div className="flex justify-between items-start mb-5">
            <div>
              <span
                className="font-cubao-wide text-[12px] tracking-[0.1em] uppercase"
                style={{ color }}
              >
                {pin?.pinTags?.map((pt) => pt.tag.title).join(", ")}
              </span>
              <h2 className="font-chakra text-primary text-[26px] font-extrabold m-0 mt-1">
                {pin?.title}
              </h2>
            </div>

            <div className="flex gap-2 items-center">
              {!!sessionData && (
                <button
                  type="button"
                  className="bg-transparent border border-border-color rounded-full w-11 h-11 text-primary cursor-pointer flex items-center justify-center transition-all duration-200 shrink-0 hover:bg-panel-hover active:scale-90"
                  onClick={() => setIsEditing(true)}
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
                className="bg-transparent border border-border-color rounded-full w-11 h-11 text-primary cursor-pointer flex items-center justify-center transition-all duration-200 shrink-0 hover:bg-panel-hover active:scale-90"
                title="Waypoint history"
                onClick={() => setIsViewingHistory(true)}
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
                  className="lucide lucide-history-icon lucide-history"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M12 7v5l4 2" />
                </svg>
              </button>

              <button
                type="button"
                className="bg-transparent border border-border-color rounded-full w-11 h-11 text-primary cursor-pointer flex items-center justify-center transition-all duration-200 shrink-0 hover:bg-panel-hover active:scale-90"
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
            <div className="grid grid-rows-[repeat(2,90px)] grid-flow-col gap-3 mb-6 overflow-x-auto overscroll-x-contain pb-2 snap-x snap-mandatory custom-scrollbar no-scrollbar">
              {pin.images.map((img) => (
                <div
                  key={img.id}
                  className="bg-panel-hover border border-border-color rounded-2xl flex items-center justify-center snap-start relative overflow-hidden row-span-2 w-[192px]"
                >
                  <Image alt="" src={`${img.url}`} fill objectFit="cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[192px] mb-6 bg-panel-hover border border-dashed border-border-color rounded-2xl flex flex-col items-center justify-center text-secondary font-chakra text-[12px] font-bold tracking-[0.15em]">
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
              <span>{t("pin.images.none")}</span>
            </div>
          )}

          {/* BODY: INTEL DASHBOARD */}
          <div className="flex flex-col gap-6">
            <p className="font-nunito text-[15px] text-primary leading-relaxed m-0">
              {pin?.description}
            </p>

            <div className="grid grid-cols-2 gap-4 bg-panel-hover border border-border-color rounded-2xl p-5">
              {/* PIN ID */}
              <div className="flex flex-col gap-1 min-w-0 overflow-hidden @container">
                <span className="font-chakra text-[10px] font-extrabold text-secondary tracking-[0.1em]">
                  {t("pin.id")}
                </span>
                <span className="font-nunito text-[14px] font-bold text-primary whitespace-nowrap w-max bg-[length:200%_200%] animate-scroll-text overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden font-mono">
                  {pin?.id?.padStart(7, "0")}
                </span>
              </div>
              {/* OWNER */}
              <div className="flex flex-col gap-1 min-w-0 overflow-hidden @container">
                <span className="font-chakra text-[10px] font-extrabold text-secondary tracking-[0.1em]">
                  {t("pin.created.by")}
                </span>
                <span className="font-nunito text-[14px] font-bold text-primary whitespace-nowrap w-max bg-[length:200%_200%] animate-scroll-text overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {pin?.owner}
                </span>
              </div>
              {/* COORDINATES */}
              <div className="flex flex-col gap-1 min-w-0 overflow-hidden @container col-span-2">
                <span className="font-chakra text-[10px] font-extrabold text-secondary tracking-[0.1em]">
                  {t("pin.coordinates")}
                </span>
                <span className="font-nunito text-[14px] font-bold text-primary whitespace-nowrap w-max bg-[length:200%_200%] animate-scroll-text overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden font-mono">
                  {pin?.latitude?.toFixed(6)}, {pin?.longitude?.toFixed(6)}
                </span>
              </div>
              {/* STATUS */}
              <div className="flex flex-col gap-1 min-w-0 overflow-hidden @container">
                <span className="font-chakra text-[10px] font-extrabold text-secondary tracking-[0.1em]">
                  {t("pin.status")}
                </span>
                <span
                  className="font-nunito font-bold whitespace-nowrap w-max bg-[length:200%_200%] animate-scroll-text overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden font-mono flex items-center gap-1.5 text-[14px]"
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
              <div className="flex flex-col gap-1 min-w-0 overflow-hidden @container">
                <span className="font-chakra text-[10px] font-extrabold text-secondary tracking-[0.1em]">
                  {t("pin.created.at")}
                </span>
                <span className="font-nunito text-[14px] font-bold text-primary whitespace-nowrap w-max bg-[length:200%_200%] animate-scroll-text overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {new Date(pin?.createdAt || "").toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                    day: "2-digit",
                  })}
                </span>
              </div>

              {pin.modifications.filter((m) => m.status === "APPLIED").length >
                0 && (
                <div className="flex flex-col gap-1 min-w-0 overflow-hidden @container col-span-2">
                  <span className="font-chakra text-[10px] font-extrabold text-secondary tracking-[0.1em]">
                    {t("pin.last.updated")}
                  </span>
                  <span className="font-nunito text-[14px] font-bold text-primary whitespace-nowrap w-max bg-[length:200%_200%] animate-scroll-text overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                className="tactical-button border-status-danger text-status-danger p-3 hover:bg-status-danger hover:text-white hover:transform-none"
                onClick={() => setIsDeleting(true)}
              >
                {t("pin.delete")}
              </button>
            )}

            {isDeleting && (
              <div className="bg-panel-hover border border-status-danger rounded-xl p-4 flex flex-col gap-3">
                <p className="m-0 text-primary font-nunito text-[14px]">
                  {t("pin.delete.confirmation")}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="tactical-button-primary bg-status-danger border-status-danger text-white shadow-none flex-1 p-2.5 hover:bg-status-danger hover:shadow-[0_0_15px_var(--status-danger)]"
                    onClick={onDelete}
                  >
                    {t("pin.delete.confirm")}
                  </button>
                  <button
                    type="button"
                    className="tactical-button flex-1 p-2.5"
                    onClick={() => setIsDeleting(false)}
                  >
                    {t("pin.delete.cancel")}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-2 border-t border-border-color pt-6 pb-[100px]">
              <h3 className="font-chakra text-[12px] font-black tracking-[0.15em] text-secondary mb-5">
                {t("pin.forum")}
              </h3>
              {!isReplying ? (
                sessionData && (
                  <button
                    type="button"
                    className="bg-transparent border-none text-secondary font-chakra text-[11px] font-bold cursor-pointer flex items-center gap-1 p-0 transition-colors duration-200 hover:text-primary"
                    onClick={() => setIsReplying(true)}
                  >
                    {t("pin.comment.add")}
                  </button>
                )
              ) : (
                <form
                  onSubmit={formMethods.handleSubmit(onSubmit)}
                  className="flex flex-col w-full gap-3"
                >
                  <input
                    {...formMethods.register("message")}
                    placeholder="Write a comment..."
                    className="w-full rounded-md border p-2 flex-1 bg-base border border-border-color rounded-md py-2.5 px-3 text-primary font-nunito text-[13px] outline-none focus:border-neon-blue"
                  />
                  <div className="flex w-full justify-end gap-2">
                    <button
                      type="submit"
                      className="tactical-button-primary px-4 py-2.5 text-[11px] rounded-md"
                    >
                      {t("pin.comment.post")}
                    </button>
                    <button
                      type="button"
                      className="tactical-button px-4 py-2.5 text-[11px] rounded-md"
                      onClick={() => setIsReplying(false)}
                    >
                      {t("pin.comment.cancel")}
                    </button>
                  </div>
                </form>
              )}
              <div>
                {pin?.comments?.map((thread) => (
                  <CommentNode key={thread.id} comment={thread} depth={0} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[80px] bg-[linear-gradient(to_top,var(--bg-base)_10%,transparent_100%)] pointer-events-none rounded-b-[24px]"></div>
      </div>
    </div>
  );
}
