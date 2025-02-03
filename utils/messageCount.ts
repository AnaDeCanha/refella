import { db } from "../lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

const incrementMessageCount = async (email: string) => {
  const userRef = doc(db, "users", email);

  try {
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) return;

    const userData = userDoc.data();
    const currentCount = userData?.messageCount || 0;
    console.log(currentCount, "MESSAGES");

    if (currentCount >= 15) {
      // TODO: update to 5
      console.log(userData);
      console.log("Message limit reached, stopping messages.");
      return { allowed: false, message: "Session limit reached (5 messages)." };
    }

    await updateDoc(userRef, { messageCount: increment(1) });

    return { allowed: true };
  } catch (error) {
    console.error("Error incrementing message count:", error);
    return { allowed: false, message: "Error processing message count." };
  }
};

export default incrementMessageCount;
