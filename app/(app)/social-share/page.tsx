"use client";

import React, { useEffect, useState, useRef } from "react";
import { CldImage } from "next-cloudinary";

const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectratio: "1:1" },
  "Instagram Portrait (4:5)": {
    width: 1080,
    height: 1350,
    aspectratio: "4:5",
  },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectratio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectratio: "3:1" },
  "Facebook Cover (205:78)": {
    width: 820,
    height: 312,
    aspectratio: "205:78",
  },
};

type SocialFormat = keyof typeof socialFormats;

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "Instagram Square (1:1)"
  );
  const [isUploading, setIsUploading] = useState(false); // Fixed typo
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        // Fixed: declared response variable
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.log(error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob); // Fixed: added (blob) parameter
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        // Removed duplicate removeChild call
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Social Media Image Formatter</h1>

      {/* File Upload */}
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="mb-2"
        />
        {isUploading && <p>Uploading...</p>}
      </div>

      {/* Format Selector */}
      {uploadedImage && (
        <div className="mb-4">
          <label className="block mb-2">Select Format:</label>
          <select
            value={selectedFormat}
            onChange={e => setSelectedFormat(e.target.value as SocialFormat)}
            className="border p-2 rounded"
          >
            {Object.keys(socialFormats).map(format => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Image Display */}
      {uploadedImage && (
        <div className="mb-4">
          <CldImage
            ref={imageRef}
            src={uploadedImage}
            width={socialFormats[selectedFormat].width}
            height={socialFormats[selectedFormat].height}
            crop="fill"
            gravity="center"
            onLoad={() => setIsTransforming(false)}
            alt="Formatted social media image"
          />
          {isTransforming && <p>Transforming image...</p>}
        </div>
      )}

      {/* Download Button */}
      {uploadedImage && !isTransforming && (
        <button
          onClick={handleDownload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Download Image
        </button>
      )}
    </div>
  );
}
