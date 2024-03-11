import Fileupload from "./Fileupload";
import { DataTable } from "./data-table";
import { storage } from "@/lib/firebase/firebase";
import { listAll, ref } from "firebase/storage";
import { Files, columns } from "./columns";
import { cookies } from "next/headers";
import { auth } from "firebase-admin";

const Page = async ({ params: { client } }: { params: { client: string } }) => {
  async function getData(client: string): Promise<Files[]> {
    const session = cookies().get("session")?.value || "";

    if (!session) {
      console.log("No session cookie found");
    }

    try {
      const decodedClaims = await auth().verifySessionCookie(session, true);
      if (decodedClaims) {
        try {
          const storageRef = ref(storage, `${decodedClaims.uid}/${client}`);
          const res = await listAll(storageRef);

          const files = res.items.map((item) => item.name);
          // console.log("Files retrieved successfully:", files);
          return files.map((fileName) => ({
            Filename: fileName,
          }));
        } catch (error) {
          console.error("Error retrieving files:");
          return [];
        }
      } else {
        console.log("Invalid session cookie");
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  const data = await getData(client);

  return (
    <div className="w-full px-5 mt-4 ml-16 sm:ml-44">
      <div className="text-3xl font-bold mt-4 lg:ml-32">Create a project</div>
      <div className="ml-2 lg:ml-32">Client Name - Apple</div>
      <Fileupload />
      <div className="mt-7">
        <div className="mx-auto overflow-hidden max-w-[70vw]">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
};

export default Page;
