import { db } from "../lib/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

const incrementMessageCount = async (email: string) => {
  const userRef = doc(db, "users", email);

  try {
    await updateDoc(userRef, {
      messageCount: increment(1),
    });
  } catch (error) {
    console.error("Error incrementing message count:", error);
  }
};

export default incrementMessageCount;
