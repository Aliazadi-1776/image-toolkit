<<<<<<< HEAD
import { useState } from "react";
import { BadgeInfo, Eraser, PenLine } from "lucide-react";
import { useToolkitStore } from "@/stores/useToolkitStore";
import type { MetadataOptions, MetadataWriteOptions } from "@/types/toolkit";
const stripFields: Array<{ key: keyof MetadataOptions; label: string }>=[{key:"stripAll",label:"Remove everything"},{key:"stripExif",label:"EXIF"},{key:"stripGps",label:"GPS"},{key:"stripCameraInfo",label:"Camera info"},{key:"stripIcc",label:"ICC profile"},{key:"stripXmp",label:"XMP"}];
const writeFields: Array<{ key: keyof MetadataWriteOptions; label: string; placeholder: string }>=[{key:"title",label:"Title",placeholder:"Product photo, hero image, ..."},{key:"description",label:"Description",placeholder:"A short description for this image"},{key:"author",label:"Author",placeholder:"Photographer / author"},{key:"creator",label:"Creator",placeholder:"Creator name or software"},{key:"keywords",label:"Keywords",placeholder:"webp, product, ecommerce"},{key:"copyright",label:"Copyright",placeholder:"Copyright notice"},{key:"comment",label:"Comment",placeholder:"Internal note"}];
type Tab="write"|"clean";
export function MetadataOptionsPanel(){ const [activeTab,setActiveTab]=useState<Tab>("write"); const request=useToolkitStore((s)=>s.request); const setMetadataFlag=useToolkitStore((s)=>s.setMetadataFlag); const setMetadataWriteField=useToolkitStore((s)=>s.setMetadataWriteField); return <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"><div className="border-b border-zinc-800 p-4"><h2 className="text-lg font-semibold">Properties</h2><p className="mt-1 text-sm text-zinc-400">ExifTool writes real metadata after conversion, so Windows Details and image apps can read it better.</p></div><div className="flex border-b border-zinc-800 bg-zinc-950 p-2"><TabButton active={activeTab==="write"} icon={<PenLine className="h-4 w-4"/>} label="Write" onClick={()=>setActiveTab("write")}/><TabButton active={activeTab==="clean"} icon={<Eraser className="h-4 w-4"/>} label="Clean" onClick={()=>setActiveTab("clean")}/></div>{activeTab==="write"&&<div className="p-4"><div className="mb-4 flex gap-3 rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-3 text-sm text-emerald-100"><BadgeInfo className="mt-0.5 h-4 w-4 shrink-0"/><p>ImageMagick handles image operations. ExifTool handles real metadata/properties writing.</p></div><div className="grid gap-3 md:grid-cols-2">{writeFields.map((field)=><label key={String(field.key)} className="space-y-1"><span className="text-xs text-zinc-500">{field.label}</span><input type="text" value={request.writeMetadata[field.key] ?? ""} onChange={(e)=>setMetadataWriteField(field.key,e.target.value)} placeholder={field.placeholder} className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-emerald-500"/></label>)}</div></div>}{activeTab==="clean"&&<div className="p-4"><div className="grid gap-2 md:grid-cols-2">{stripFields.map((field)=><label key={String(field.key)} className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-300"><input type="checkbox" checked={Boolean(request.metadata[field.key])} onChange={(e)=>setMetadataFlag(field.key,e.target.checked)} className="h-4 w-4 accent-emerald-500"/>{field.label}</label>)}</div></div>}</section>; }
function TabButton({active,icon,label,onClick}:{active:boolean;icon:React.ReactNode;label:string;onClick:()=>void}){ return <button type="button" onClick={onClick} className={["inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm transition",active?"bg-emerald-500/15 text-emerald-200":"text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"].join(" ")}>{icon}{label}</button>; }
=======
import { useToolkitStore } from "@/stores/useToolkitStore";
import type { MetadataOptions, MetadataWriteOptions } from "@/types/toolkit";

const stripOptions: Array<{
  key: keyof MetadataOptions;
  label: string;
  help?: string;
}> = [
  {
    key: "stripEverything",
    label: "Strip everything",
    help: "Uses -strip. Best option before writing clean metadata.",
  },
  {
    key: "stripExif",
    label: "Strip EXIF",
  },
  {
    key: "stripGps",
    label: "Strip GPS",
    help: "ImageMagick removes GPS by removing EXIF profile.",
  },
  {
    key: "stripCameraInformation",
    label: "Strip camera information",
    help: "Camera info is usually stored inside EXIF.",
  },
  {
    key: "stripIccProfile",
    label: "Strip ICC profile",
  },
  {
    key: "stripXmp",
    label: "Strip XMP",
  },
];

const writeFields: Array<{
  key: keyof MetadataWriteOptions;
  label: string;
  placeholder: string;
}> = [
  {
    key: "copyright",
    label: "Copyright",
    placeholder: "© 2026 Your Brand",
  },
  {
    key: "author",
    label: "Author",
    placeholder: "Author name",
  },
  {
    key: "creator",
    label: "Creator",
    placeholder: "Creator or company",
  },
  {
    key: "description",
    label: "Description",
    placeholder: "Short image description",
  },
  {
    key: "keywords",
    label: "Keywords",
    placeholder: "keyword1, keyword2, keyword3",
  },
  {
    key: "comment",
    label: "Comment",
    placeholder: "Internal note or public comment",
  },
];

export function MetadataOptionsPanel() {
  const request = useToolkitStore((state) => state.request);
  const setMetadataFlag = useToolkitStore((state) => state.setMetadataFlag);
  const setMetadataWriteField = useToolkitStore(
    (state) => state.setMetadataWriteField,
  );

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="font-medium">Metadata</h2>

      <div className="mt-4 rounded-lg border border-amber-900/50 bg-amber-950/30 px-3 py-2 text-xs leading-5 text-amber-200">
        For a clean SEO/content workflow, keep <b>Strip everything</b> enabled,
        then fill only the fields you want to write back.
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {stripOptions.map((option) => (
          <label
            key={option.key}
            className="rounded-lg border border-zinc-800 bg-zinc-950 p-3"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(request.metadata[option.key])}
                onChange={(event) =>
                  setMetadataFlag(option.key, event.target.checked)
                }
              />
              <span className="text-sm text-zinc-200">{option.label}</span>
            </div>

            {option.help && (
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                {option.help}
              </p>
            )}
          </label>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {writeFields.map((field) => (
          <label key={field.key} className="space-y-2">
            <span className="text-sm text-zinc-400">{field.label}</span>
            <input
              value={request.metadataWrite[field.key] ?? ""}
              onChange={(event) =>
                setMetadataWriteField(field.key, event.target.value)
              }
              placeholder={field.placeholder}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
            />
          </label>
        ))}
      </div>
    </section>
  );
}
>>>>>>> e2cf61b00c4b93804c91a2f10e49509b357c3b76
