import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";
import { auth } from 'firebase-admin';
import { customInitApp } from '@/lib/firebase/firebase-admin-config';
import { getFirestore } from "firebase-admin/firestore";
import { cookies } from "next/headers";

// Initialize Firebase app
customInitApp();

// Function to fetch data from Firestore
async function getData(page: number, perPage: number, sort: string, client: string): Promise<Payment[]> {
  try {
    const assignmentData: Payment[] = [];

    const session = cookies().get("session")?.value || "";

    if (!session) {
      console.log("No session cookie found");
      return assignmentData;
    }

    const decodedClaims = await auth().verifySessionCookie(session, true);
    if (!decodedClaims) {
      console.log("Invalid session cookie");
      return assignmentData;
    }
    const [sortField, sortOrder] = sort.split(".");
    console.log(sortField, sortOrder);
    const db = getFirestore();
    const cityRef = db.collection(`users/${decodedClaims.uid}/clients/${client}/files`)
                      .orderBy("type" , sortOrder as any) // Apply sorting

                      .offset((page - 1) * perPage) // Calculate offset
                      .limit(perPage); // Limit per page

    const querySnapshot = await cityRef.get();

    const files = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      url: doc.data().url,
      name: doc.data().name,
      originalName: doc.data().originalName,
      type: doc.data().type,
      createdAt: doc.data().createdAt,
      bucketName: doc.data().bucketName,
      filesCategory: doc.data().filesCategory,
    }));

    console.log("Fetch successful:", files);
    return files;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

// Next.js API route handler
export default async function Page({
  params,
  searchParams,
}: {
  params: { client: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = parseInt(searchParams.page as string, 10) || 1;
  const perPage = parseInt(searchParams.per_page as string, 10) || 10;
  const sort = searchParams.sort || "";

  console.log("Params:", searchParams);

  // Fetch data using parameters
  const data = await getData(page, perPage, sort as string, params.client);

  console.log("Data:", data);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} pageCount={5}/>
    </div>
  );
}
