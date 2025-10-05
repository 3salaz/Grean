// src/utils/requestCounter.js
let readCount = 0;
let writeCount = 0;
let deleteCount = 0;
const REQUEST_LIMIT = 20000; // Example limit, adjust based on your quota

export const incrementReadCount = () => {
  readCount++;
  checkQuota();
};

export const incrementWriteCount = () => {
  writeCount++;
  checkQuota();
};

export const incrementDeleteCount = () => {
  deleteCount++;
  checkQuota();
};

const checkQuota = () => {
  if (readCount + writeCount + deleteCount >= REQUEST_LIMIT) {
    alert("You are approaching your Firestore request quota limit!");
    console.warn("Firestore request limit is approaching:", {
      reads: readCount,
      writes: writeCount,
      deletes: deleteCount,
    });
  }
};

export const resetCounters = () => {
  readCount = 0;
  writeCount = 0;
  deleteCount = 0;
};
