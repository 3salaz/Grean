import {db} from "../firebase";

/**
 * Updates the user's profile stats by incrementing material weights.
 *
 * @param {string} userId - The UID of the user whose stats are being updated.
 * @param {Array<{type: string, weight: number}>} materials
 * - Array of materials and their corresponding weights.
 * Each material object contains a `type` (material name) and its associated `weight` in pounds.
 */
export async function updateUserStats(
    userId: string,
    materials: { type: string; weight: number }[]
) {
  const profileRef = db.collection("profiles").doc(userId);
  const doc = await profileRef.get();

  if (!doc.exists) throw new Error("Profile not found");

  const stats = doc.data()?.stats || {
    totalWeight: 0,
    completedPickups: 0,
    materials: {},
  };

  let total = 0;
  for (const mat of materials) {
    total += mat.weight;
    stats.materials[mat.type] = (stats.materials[mat.type] || 0) + mat.weight;
  }

  stats.totalWeight += total;
  stats.completedPickups += 1;

  await profileRef.update({stats});
}
