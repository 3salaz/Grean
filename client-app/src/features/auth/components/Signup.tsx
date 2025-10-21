import { useState } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import ProfileForm, { ProfileFormData } from "../components/ProfileForm";
import axios from "axios";

const SignUp = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [newUser, setNewUser] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      setNewUser(result.user);

      // Check if profile exists via backend
      const profileRef = await axios.get(`/api/checkProfileExists?uid=${result.user.uid}`);
      const profileExists = profileRef.data.exists;

      if (profileExists) {
        router.push("/account");
      } else {
        setShowProfileForm(true);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleProfileComplete = async (formData: ProfileFormData) => {
    try {
      const token = await newUser.getIdToken();
      await axios.post(
        "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api/profile/create",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      router.push("/account");
    } catch (err) {
      console.error("Failed to create profile:", err);
      setError("Failed to save profile.");
    }
  };

  return (
    <div className="p-4">
      {showProfileForm ? (
        <ProfileForm onComplete={handleProfileComplete} />
      ) : (
        <form onSubmit={handleSignUp} className="space-y-4 max-w-md mx-auto">
          <h2 className="text-xl font-semibold">Sign Up</h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Sign Up
          </button>
        </form>
      )}
    </div>
  );
};

export default SignUp;
