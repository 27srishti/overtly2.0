import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";
import { auth } from "firebase-admin";
import { customInitApp } from "@/lib/firebase/firebase-admin-config";
import {
  getFirestore,
  CollectionReference,
  DocumentData,
} from "firebase-admin/firestore";
import { cookies } from "next/headers";
import Client from "./client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Uploadbtn from "./uploadbtn";
import Newsarticle from "./newsarticle";

customInitApp();

async function getData(
  page: number,
  perPage: number,
  sort: string,
  client: string,
  name: string
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

    // Add sorting if provided
    if (sort) {
      const [sortField, sortOrder] = sort.split(".");
      cityRef = cityRef.orderBy(
        sortField,
        sortOrder as any
      ) as CollectionReference<DocumentData>;
    }

    // Add filtering by name if provided
    if (name) {
      cityRef = cityRef.where(
        "name",
        "==",
        name
      ) as CollectionReference<DocumentData>;
    }

    // Get total count of documents
    const totalSnapshot = await cityRef.get();
    const total = totalSnapshot.size;

    // Get paginated documents
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
  const name = searchParams.name || "";

  console.log("Params:", searchParams);

  const { data, total } = await getData(
    page,
    perPage,
    sort as string,
    params.client,
    name as string
  );

  // console.log("Data:", data);

  return (
    <div className="w-full px-16 mt-4 font-montserrat">
      <div className="flex gap-16 mt-6 mb-10">
        <div className="text-[23px] mt-4  font-montserrat capitalize">
          <Client />
        </div>
      </div>
      <div>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-5 flex flex-row justify-between ml-3">
            <div className="flex gap-8">
              <TabsTrigger
                value="account"
                className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#585858] bg-[#ECECEC]"
              >
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="newsarticles"
                className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#585858] bg-[#ECECEC]"
              >
                News Articles
              </TabsTrigger>
              <TabsTrigger
                value="knowledgegraph"
                className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#585858] bg-[#ECECEC]"
              >
                Knowledge Graph
              </TabsTrigger>
              <TabsTrigger
                value="mediadatabase"
                className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#585858] bg-[#ECECEC]"
              >
                Media Database
              </TabsTrigger>
            </div>
            <div>
              <Uploadbtn />
            </div>
          </TabsList>
          <TabsContent
            value="account"
            className="px-0 bg-transparent border rounded-[30px]"
          >
            <div className="mx-auto overflow-hidden">
              <div className="container mx-auto py-10">
                <DataTable
                  columns={columns}
                  data={data}
                  pageCount={Math.ceil(total / perPage)}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="newsarticles"
            className="px-0 bg-transparent border rounded-[30px]"
          >
<Newsarticle/>
          </TabsContent>
          <TabsContent value="knowledgegraph"> knowledge graph</TabsContent>
          <TabsContent value="mediadatabase">media database</TabsContent>
        </Tabs>
      </div>
    </div>

    // <div className="container mx-auto py-10">
    //   <DataTable
    //     columns={columns}
    //     data={data}
    //     pageCount={Math.ceil(total / perPage)}
    //   />
    // </div>
  );
}
