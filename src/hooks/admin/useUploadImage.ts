import { useMutation } from '@tanstack/react-query';
import adminApi from '@/lib/adminAxios';
import { useAdminStore } from '@/store/adminStore';
import { ApiResponse } from '@/types';
import toast from 'react-hot-toast';

export interface UploadResult {
  url: string;
  publicId: string;
}

export function useUploadImage() {
  return useMutation({
    mutationFn: async ({ file, folder }: { file: File; folder?: string }) => {
      const token = useAdminStore.getState().token;

      const formData = new FormData();
      formData.append('file', file);
      if (folder) formData.append('folder', folder);

      // Use native fetch so the browser sets Content-Type with the correct
      // multipart boundary automatically — axios's default application/json
      // header breaks multer's form parser when set on a FormData body.
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
        signal: AbortSignal.timeout(60_000),
      });

      const json: ApiResponse<UploadResult> = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? json.message ?? 'Upload failed');
      }

      return json.data!;
    },
    onError: (e: Error) => toast.error(`Upload failed: ${e.message}`),
  });
}

export function useDeleteCloudinaryImage() {
  return useMutation({
    mutationFn: async (publicId: string) => {
      await adminApi.delete('/admin/upload', { data: { publicId } });
    },
    onError: (e: Error) => toast.error(`Delete failed: ${e.message}`),
  });
}
