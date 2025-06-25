import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { getIdToken } from "firebase/auth";
import axios from "axios";

export const createProfileIfMissing = async (user: any, accountType: string) => {
  if (!user) return;

  const profileRef = doc(db, "profiles", user.uid);
  const profileSnap = await getDoc(profileRef);

  if (!profileSnap.exists()) {
    const token = await getIdToken(user);
    const newProfile = {
      displayName: user.displayName || `user${Math.floor(Math.random() * 10000)}`,
      email: user.email,
      uid: user.uid,
      locations: [],
      pickups: [],
      accountType,
      photoURL: "",
    };

    await axios.post(
      "https://us-central1-grean-de04f.cloudfunctions.net/api/createProfileFunction",
      newProfile,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log("✅ Profile created for new user");
  }
};
