import { db } from "../lib/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const saveSessionTimestamp = async (email: string) => {
  const userRef = doc(collection(db, "users"), email); // Use email as the document ID

  try {
    const userDoc = await getDoc(userRef);
    const now = new Date();

    if (userDoc.exists()) {
      const lastSession = userDoc.data().lastSession.toDate();
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));

      if (lastSession > oneWeekAgo) {
        return {
          allowed: false,
          message: "Session limit reached. Try again later.",
        };
      }
    }

    await setDoc(userRef, { lastSession: serverTimestamp() }, { merge: true });
    return { allowed: true };
  } catch (error) {
    console.error("Error saving session:", error);
    return { allowed: false, message: "Server error. Please try again later." };
  }
};

export default saveSessionTimestamp;
