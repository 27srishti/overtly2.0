import { db } from "@/lib/firebase/firebase";
import { setDoc, doc } from "firebase/firestore";

export const logErrorToFirestore = async (
    userId: string,
    clientId: string,
    functionName: string,
    errorDetails: string | Error, // Accept Error type as well
    requestdetails? : any
) => {
    const timestamp = Date.now();
    const docId = `${userId}_${timestamp}`;

    const errorData = {
        timestamp,
        user_id: userId,
        client_id: clientId,
        function_name: functionName,
        error_details: typeof errorDetails === 'string' ? errorDetails : errorDetails.message,
        request_details: requestdetails ? JSON.stringify(requestdetails) : "{}"
    };

    try {
        await setDoc(doc(db, 'frontend-error-logging', docId), errorData);
    } catch (logError) {
        console.error("Error logging to Firestore:", logError);
    }
};