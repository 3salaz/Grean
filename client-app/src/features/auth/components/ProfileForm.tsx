import { useState } from "react";

export interface ProfileFormData {
  displayName: string;
  photoURL?: string;
  accountType: "User" | "Driver";
}

interface ProfileFormProps {
  initialData?: Partial<ProfileFormData>;
  onComplete: (data: ProfileFormData) => void;
}

export default function ProfileForm({ initialData = {}, onComplete }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(initialData.displayName || "");
  const [photoURL, setPhotoURL] = useState(initialData.photoURL || "");
  const [accountType, setAccountType] = useState<"User" | "Driver">(initialData.accountType || "User");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError("Display name is required");
      return;
    }

    setLoading(true);
    try {
      const data: ProfileFormData = {
        displayName: displayName.trim(),
        photoURL: photoURL.trim() || "",
        accountType,
      };

      await onComplete(data);
    } catch (err) {
      console.error("Error submitting profile form:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold">Complete Your Profile</h2>

      <input
        type="text"
        placeholder="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Photo URL (optional)"
        value={photoURL}
        onChange={(e) => setPhotoURL(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <select
        value={accountType}
        onChange={(e) => setAccountType(e.target.value as "User" | "Driver")}
        className="w-full border p-2 rounded"
      >
        <option value="User">User</option>
        <option value="Driver">Driver</option>
      </select>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
