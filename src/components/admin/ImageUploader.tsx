import { useRef, useState, DragEvent } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';
import { useUploadImage } from '@/hooks/admin/useUploadImage';
import toast from 'react-hot-toast';

interface Props {
  images: string[];
  onChange: (urls: string[]) => void;
  folder?: 'products' | 'categories' | 'general';
  maxImages?: number;
  label?: string;
}

const ACCEPTED = '.jpg,.jpeg,.png,.webp';
const MAX_SIZE_MB = 5;

export default function ImageUploader({
  images,
  onChange,
  folder = 'products',
  maxImages = 6,
  label = 'Product Images',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: upload } = useUploadImage();
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const canAddMore = images.length < maxImages;

  async function handleFiles(files: FileList | null) {
    if (!files || !canAddMore) return;

    const toUpload = Array.from(files).slice(0, maxImages - images.length);

    for (const file of toUpload) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name} exceeds ${MAX_SIZE_MB} MB limit.`);
        continue;
      }
    }

    const valid = toUpload.filter((f) => f.size <= MAX_SIZE_MB * 1024 * 1024);
    if (!valid.length) return;

    setUploading(true);
    try {
      const results = await Promise.all(valid.map((file) => upload({ file, folder })));
      const newUrls = results.map((r) => r.url);
      onChange([...images, ...newUrls]);
    } catch {
      // toast is shown by the mutation's onError; re-render guard only
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave() {
    setIsDragging(false);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-brown">{label}</label>
        <span className="text-xs text-brown/40">
          {images.length}/{maxImages} · JPEG, PNG, WebP · max {MAX_SIZE_MB} MB each
        </span>
      </div>

      {/* Existing images */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {images.map((url, i) => (
            <div key={i} className="relative group">
              <img
                src={url}
                alt={`Image ${i + 1}`}
                className="w-20 h-20 object-cover rounded-xl border border-cream-dark"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/A8CABA/3F2A1E?text=?';
                }}
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                title="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[9px] bg-black/50 text-white px-1 rounded font-medium">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {canAddMore && (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-terracotta bg-terracotta/5'
              : 'border-cream-dark hover:border-sage hover:bg-sage/5'
          } ${uploading ? 'pointer-events-none' : ''}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-brown/50">
              <Loader2 className="h-7 w-7 animate-spin text-terracotta" />
              <p className="text-sm font-medium">Uploading…</p>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center gap-2 text-brown/40">
              <ImageIcon className="h-8 w-8" />
              <div>
                <p className="text-sm font-medium text-brown/60">Click to upload or drag & drop</p>
                <p className="text-xs mt-0.5">JPEG, PNG, WebP up to {MAX_SIZE_MB} MB</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-brown/40">
              <Upload className="h-4 w-4" />
              <span className="text-sm">Add more ({maxImages - images.length} remaining)</span>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            multiple={maxImages > 1}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}
    </div>
  );
}
