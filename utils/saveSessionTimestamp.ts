import { db } from "../lib/firebase";
import {
  doc,
  collection,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const getStartOfWeek = () => {
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const diff = (day === 0 ? -6 : 1) - day; // Get to Monday
  const startOfWeek = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + diff,
      0,
      0,
      0
    )
  );
  return startOfWeek;
};

const saveSessionTimestamp = async (email: string) => {
  const userRef = doc(collection(db, "users"), email);

  try {
    const userDoc = await getDoc(userRef);
    const startOfWeek = getStartOfWeek();

    console.log("Start of current week:", startOfWeek);

    if (!userDoc.exists()) {
      console.log("User document does not exist, creating new session.");
      await setDoc(
        userRef,
        { lastSession: serverTimestamp(), messageCount: 0 },
        { merge: true }
      );
      return { allowed: true };
    }

    const userData = userDoc.data();
    const lastSession = userData?.lastSession?.toDate();
    const messageCount = userData?.messageCount || 0;

    console.log("Last session:", lastSession);
    console.log("Message count:", messageCount);

    if (lastSession && lastSession >= startOfWeek && messageCount >= 15) {
      //TODO: change to 5
      console.log("Session limit reached.");
      return {
        allowed: false,
        message:
          "You’ve reached your weekly session limit (5 messages). Come back next Monday!",
      };
    }

    // If user is in a new week or has messages left, allow session
    if (!lastSession || lastSession < startOfWeek) {
      console.log("New week detected, resetting session.");
      await setDoc(
        userRef,
        { lastSession: serverTimestamp(), messageCount: 0 },
        { merge: true }
      );
    }

    return { allowed: true };
  } catch (error) {
    console.error("Error saving session:", error);
    return {
      allowed: false,
      message: "Server error. Please try again later.",
    };
  }
};

export default saveSessionTimestamp;
