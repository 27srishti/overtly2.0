import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";
import { auth } from "firebase-admin";
import { customInitApp } from "@/lib/firebase/firebase-admin-config";
import { getFirestore, CollectionReference, DocumentData } from "firebase-admin/firestore";
import { cookies } from "next/headers";

customInitApp();

async function getData(
  page: number,
  perPage: number,
  sort: string,
  client: string
): Promise<{ data: Payment[]; total: number }> {
  try {
    const assignmentData: Payment[] = [];
    const session = cookies().get("session")?.value || "";

    if (!session) {
      console.log("No session cookie found");
      return { data: assignmentData, total: 0 };
    }

    const decodedClaims = await auth().verifySessionCookie(session, true);
    if (!decodedClaims) {
      console.log("Invalid session cookie");
      return { data: assignmentData, total: 0 };
    }

    const db = getFirestore();
    let cityRef: CollectionReference<DocumentData> = db.collection(
      `users/${decodedClaims.uid}/clients/${client}/files`
    );

    if (sort) {
      const [sortField, sortOrder] = sort.split(".");
      cityRef = cityRef.orderBy(sortField, sortOrder as any) as CollectionReference<DocumentData>;
    }

    const totalSnapshot = await cityRef.get();
    const total = totalSnapshot.size;

    const querySnapshot = await cityRef
      .offset((page - 1) * perPage)
      .limit(perPage)
      .get();

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
    return { data: files, total };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: [], total: 0 };
  }
}

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

  const { data, total } = await getData(page, perPage, sort as string, params.client);

  console.log("Data:", data);

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={data}
        pageCount={Math.ceil(total / perPage)}
      />
    </div>
  );
}
