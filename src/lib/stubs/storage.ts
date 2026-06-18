// BACKEND STUB — in production, upload to Cloudflare R2 or S3. Apply virus scanning and format validation.

export interface UploadResult {
  url: string;
  key: string;
  sizeBytes: number;
  expiresAt: Date;
}

export async function uploadPhoto(file: File): Promise<UploadResult> {
  // BACKEND STUB — returns a local object URL for demo purposes.
  const url = URL.createObjectURL(file);
  return {
    url,
    key: `demo/${Date.now()}-${file.name}`,
    sizeBytes: file.size,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
}

export async function deletePhoto(key: string): Promise<void> {
  // BACKEND STUB — in production, delete from object storage.
  console.info("[vestra:storage] delete", key);
}
