import { db } from "../lib/firebase";
import {
  doc,
  collection,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const saveSessionTimestamp = async (email: string) => {
  const userRef = doc(collection(db, "users"), email);

  try {
    const userDoc = await getDoc(userRef);
    const now = new Date();
    const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));

    // Check if the user has an active session within the past week
    const lastSession = userDoc.data()?.lastSession?.toDate();

    if (lastSession && lastSession > oneWeekAgo) {
      return {
        allowed: false,
        message: "You’ve reached your weekly session limit. Come back later!",
      };
    }

    // Start a new session and reset message count
    await setDoc(
      userRef,
      { lastSession: serverTimestamp(), messageCount: 0 },
      { merge: true }
    );

    return {
      allowed: true,
    };
  } catch (error) {
    console.error("Error saving session:", error);
    return {
      allowed: false,
      message: "Server error. Please try again later.",
    };
  }
};

export default saveSessionTimestamp;
