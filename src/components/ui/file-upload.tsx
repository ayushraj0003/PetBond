import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebaseConfig";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export function FileUpload({ onFileUploadComplete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress monitoring, if desired
      },
      (error) => {
        setError("Upload failed. Try again.");
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUploading(false);
        onFileUploadComplete(downloadURL); // Notify parent component
      }
    );
  };

  return (
    <div>
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
