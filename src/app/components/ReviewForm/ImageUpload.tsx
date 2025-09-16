'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ImageUploadService } from '../../lib/services/imageUploadService';

interface ImageUploadProps {
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export default function ImageUpload({
  onImagesChange,
  maxImages = 5,
  disabled = false
}: ImageUploadProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPreviewUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const cleanupPreviewUrls = (urls: string[]) => {
    urls.forEach(url => URL.revokeObjectURL(url));
  };

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);

    // Validate the new files
    const validation = ImageUploadService.validateImageArray([...selectedImages, ...fileArray]);
    if (!validation.isValid) {
      setUploadError(validation.error || 'Invalid files');
      return;
    }

    // Limit to maxImages
    const availableSlots = maxImages - selectedImages.length;
    const filesToAdd = fileArray.slice(0, availableSlots);

    if (filesToAdd.length < fileArray.length) {
      setUploadError(`Only ${availableSlots} more images can be added`);
    } else {
      setUploadError(null);
    }

    // Create preview URLs for new files
    const newPreviewUrls = filesToAdd.map(createPreviewUrl);

    // Update state
    const newSelectedImages = [...selectedImages, ...filesToAdd];
    const newAllPreviewUrls = [...previewUrls, ...newPreviewUrls];

    setSelectedImages(newSelectedImages);
    setPreviewUrls(newAllPreviewUrls);
    onImagesChange(newSelectedImages);
  }, [selectedImages, previewUrls, maxImages, onImagesChange]);

  const removeImage = useCallback((index: number) => {
    // Cleanup the preview URL
    URL.revokeObjectURL(previewUrls[index]);

    const newSelectedImages = selectedImages.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);

    setSelectedImages(newSelectedImages);
    setPreviewUrls(newPreviewUrls);
    onImagesChange(newSelectedImages);
    setUploadError(null);
  }, [selectedImages, previewUrls, onImagesChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [disabled, handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const openFileDialog = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      cleanupPreviewUrls(previewUrls);
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <motion.div
        className={`
          relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 cursor-pointer
          ${dragActive
            ? 'border-sage bg-sage/10 scale-105'
            : 'border-sage/30 hover:border-sage/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${selectedImages.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={selectedImages.length < maxImages ? openFileDialog : undefined}
        whileHover={!disabled && selectedImages.length < maxImages ? { scale: 1.02 } : {}}
        whileTap={!disabled && selectedImages.length < maxImages ? { scale: 0.98 } : {}}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled || selectedImages.length >= maxImages}
        />

        <div className="text-center">
          <motion.div
            animate={{
              rotate: dragActive ? [0, -10, 10, 0] : 0,
              scale: dragActive ? 1.1 : 1
            }}
            transition={{ duration: 0.3 }}
            className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-sage/20 to-sage/10 rounded-full flex items-center justify-center"
          >
            <ion-icon
              name={dragActive ? "cloud-upload" : "camera"}
              style={{ fontSize: '24px', color: 'var(--sage)' }}
            />
          </motion.div>

          {selectedImages.length >= maxImages ? (
            <p className="font-urbanist text-sm font-500 text-charcoal/60">
              Maximum {maxImages} images reached
            </p>
          ) : (
            <>
              <p className="font-urbanist text-base font-600 text-charcoal mb-2">
                {dragActive ? 'Drop images here' : 'Add photos to your review'}
              </p>
              <p className="font-urbanist text-sm font-400 text-charcoal/60">
                Drag & drop or click to select images
                <br />
                <span className="text-xs">
                  {selectedImages.length}/{maxImages} • JPEG, PNG, WebP • Max 5MB each
                </span>
              </p>
            </>
          )}
        </div>

        {/* Loading indicator when drag is active */}
        <AnimatePresence>
          {dragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-sage/5 rounded-xl flex items-center justify-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-sage"
              >
                <ion-icon name="cloud-upload-outline" style={{ fontSize: '48px' }} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3"
          >
            <div className="flex items-center space-x-2 text-red-700">
              <ion-icon name="alert-circle" style={{ fontSize: '18px' }} />
              <span className="font-urbanist text-sm font-500">{uploadError}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Previews */}
      <AnimatePresence>
        {selectedImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h4 className="font-urbanist text-sm font-600 text-charcoal flex items-center">
              <ion-icon name="images" style={{ fontSize: '16px', marginRight: '6px' }} />
              Selected Images ({selectedImages.length})
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {selectedImages.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-sage/10">
                    <Image
                      src={previewUrls[index]}
                      alt={`Preview ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Remove Button */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors duration-200"
                    disabled={disabled}
                  >
                    <ion-icon name="close" style={{ fontSize: '14px' }} />
                  </motion.button>

                  {/* File Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-xs font-urbanist font-500 truncate">
                      {file.name}
                    </p>
                    <p className="text-white/70 text-xs font-urbanist">
                      {(file.size / (1024 * 1024)).toFixed(1)}MB
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}