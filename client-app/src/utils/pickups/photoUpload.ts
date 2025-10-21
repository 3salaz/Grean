// utils/photoUpload.ts

// Placeholder upload function – assumes integration with Firebase or similar
const uploadFileToStorage = async (file) => {
  // Simulate upload delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(URL.createObjectURL(file)), 500);
  });
};

export const uploadPickupPhotos = async (materials) => {
  const updatedMaterials = await Promise.all(
    materials.map(async (m) => {
      if (!m.photos?.length) return m;

      const uploadedPhotos = await Promise.all(
        m.photos.map(async (photo) => {
          if (typeof photo === "string") return photo; // Already a URL
          return await uploadFileToStorage(photo); // Upload File object
        })
      );

      return { ...m, photos: uploadedPhotos };
    })
  );

  return updatedMaterials;
};
