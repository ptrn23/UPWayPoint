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
    <div className="fixed inset-0 w-screen h-screen bg-border-color backdrop-blur-md flex items-center justify-center z-[150] p-5">
      <div className="w-full max-w-[400px] p-6 animate-slide-up tactical-panel flex flex-col gap-5">
        <div className="flex items-center gap-3 border-b border-border-color pb-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--neon-blue)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <h2 className="font-cubao-wide text-primary text-[20px] m-0 tracking-[0.05em]">
            EDIT PIN
          </h2>
          <span className="text-status-danger text-[11px] font-nunito font-bold ml-auto">
            {formMethods.formState.errors.tags?.message as string}
          </span>
        </div>

        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <span className="font-chakra text-[12px] text-neon-blue tracking-[0.1em] font-bold">
              PIN TITLE
            </span>
            <input
              type="text"
              placeholder="e.g. Quezon Hall"
              required
              className="bg-base border border-border-color rounded-lg p-3 text-primary font-nunito text-[14px] outline-none transition-all duration-200 focus:border-neon-blue focus:shadow-[0_0_10px_var(--shadow-glow)]"
              {...formMethods.register("title")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-chakra text-[12px] text-neon-blue tracking-[0.1em] font-bold">
              DESCRIPTION
            </span>
            <textarea
              placeholder="Enter description..."
              rows={3}
              className="bg-base border border-border-color rounded-lg p-3 text-primary font-nunito text-[14px] outline-none transition-all duration-200 focus:border-neon-blue focus:shadow-[0_0_10px_var(--shadow-glow)]"
              {...formMethods.register("description")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-chakra text-[12px] text-neon-blue tracking-[0.1em] font-bold">
              PIN TYPE
            </span>
            <div className="grid grid-cols-2 gap-2">
              {tagsData?.map((t) => {
                const isActive = tags?.includes(t.id);
                const tagColor = getPinColor(t.title);

                return (
                  <button
                    key={t.id}
                    type="button"
                    className="bg-transparent border border-border-color text-secondary p-2.5 rounded-md font-chakra text-[11px] cursor-pointer transition-all duration-200 hover:bg-panel-hover hover:text-primary"
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

          <div className="flex gap-3 mt-3">
            <button
              type="button"
              className="tactical-button flex-1 p-3.5 text-[13px] tracking-[0.05em]"
              onClick={handleCancel}
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
        </form>
      </div>
    </div>
  );
}
