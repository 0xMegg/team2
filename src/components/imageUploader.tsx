import { useState } from "react";

export default function ImageUploader() {
  const [previewImage, setPreviewImage] = useState<string | File | null>(null);

  return <div>ImageUploader</div>;
}
