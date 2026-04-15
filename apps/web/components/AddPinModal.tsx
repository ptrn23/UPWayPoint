"use client";

import { trpc } from "@/lib/trpc";
import type { PinRouterInputs } from "@repo/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import z from "zod";
import { fileSchema } from "@repo/api/schemas";
import { getPinColor } from "@/data/pin-categories";
import { clsxm } from "@repo/ui/clsxm";

type Pin = Omit<PinRouterInputs["userCreate"], "ownerId">;

interface AddPinModalProps {
  coords: { lat: number; lng: number };
  onSave: (pinId: string) => void;
  onCancel: () => void;
}

async function uploadImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const { urls } = await res.json();
  return urls;
}

export function AddPinModal({ coords, onSave, onCancel }: AddPinModalProps) {
  const pinCreationSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    tags: z.array(z.string()),
    images: z
      .instanceof(FileList)
      .transform((list) => Array.from(list))
      .pipe(z.array(fileSchema).max(10)),
  });

  type pinCreationSchemaType = z.infer<typeof pinCreationSchema>;

  const utils = trpc.useUtils();
  const createPin = trpc.pin.userCreate.useMutation({
    onSuccess: (newPin) => {
      utils.pin.getAll.invalidate();
      if (!newPin) return;
      onSave(newPin.id);
    },
  });
  const { data: tagsData } = trpc.tag.getAll.useQuery();


  const formMethods = useForm({
    defaultValues: { tags: [] },
    resolver: zodResolver(pinCreationSchema),
  });

  const { refetch: checkIfSimilar, } = trpc.pin.isSimilar.useQuery({ lat: formMethods.watch("latitude"), lng: formMethods.watch("longitude"), title: formMethods.watch("title") })


  const onSubmit = async (data: pinCreationSchemaType) => {
    const { data: isSimilar } = await checkIfSimilar()
    if (isSimilar) {
      formMethods.setError("title", { message: "A similar pin already exists here" })
      return;
    }
    let urls: string[] = [];
    if (data.images.length > 0) urls = await uploadImages(data.images);
    const newPin: Pin = {
      title: data.title.trim(),
      description: data.description?.trim(),
      latitude: coords.lat,
      longitude: coords.lng,
      tags: data.tags,
      imageURLs: urls,
    };

    createPin.mutate(newPin);
  };

  const handleCancel = () => {
    formMethods.clearErrors();
    formMethods.reset();
    onCancel();
  };

  const tags = formMethods.watch("tags");

  useEffect(() => {
    formMethods.setValue("latitude", coords.lat);
    formMethods.setValue("longitude", coords.lng);
  }, [formMethods, coords]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-border-color backdrop-blur-md flex items-center justify-center z-[200] p-5">
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
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <h2 className="font-cubao-wide text-primary text-[20px] m-0 tracking-[0.05em]">
            ADD NEW PIN
          </h2>
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
              className={clsxm("transition-all duration-200 ease-in-out bg-base border border-border-color rounded-lg p-3 text-primary font-nunito text-[14px] outline-none transition-all duration-200 focus:border-neon-blue focus:shadow-[0_0_10px_var(--shadow-glow)]",
                formMethods.formState.errors.title && "border-status-danger text-status-danger"
              )}
              {...formMethods.register("title")}
            />
            {formMethods.formState.errors.title && <span className="font-chakra text-status-danger">{formMethods.formState.errors.title.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-chakra text-[12px] text-neon-blue tracking-[0.1em] font-bold">
              DESCRIPTION
            </span>
            <textarea
              placeholder="Enter description..."
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
                const isActive = tags.includes(t.id);
                const tagColor = getPinColor(t.title);

                return (
                  <button
                    key={t.id}
                    type="button"
                    className="bg-transparent border border-border-color text-secondary p-2.5 rounded-md font-chakra text-[11px] cursor-pointer transition-all duration-200 hover:bg-panel-hover hover:text-primary"
                    onClick={() => {
                      if (isActive) {
                        formMethods.setValue("tags", []);
                      } else {
                        formMethods.setValue("tags", [t.id]);
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

          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            multiple
            {...formMethods.register("images")}
          />

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
