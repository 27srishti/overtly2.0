import { db } from "@/lib/firebase/firebase";
import { setDoc, doc } from "firebase/firestore";

export const logErrorToFirestore = async (
    userId: string,
    clientId: string,
    functionName: string,
    errorDetails: string
) => {
    const timestamp = Date.now();
    const docId = `${userId}_${timestamp}`;

    const errorData = {
        timestamp,
        user_id: userId,
        client_id: clientId,
        function_name: functionName,
        error_details: errorDetails,
    };

    try {
        await setDoc(doc(db, 'frontend-error-logging', docId), errorData);
    } catch (logError) {
        console.error("Error logging to Firestore:", logError);
    }
};