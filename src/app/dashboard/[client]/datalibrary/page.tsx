import Fileupload from "./Fileupload";
import { DataTable } from "./data-table";
import { storage } from "@/lib/firebase/firebase";
import { listAll, ref } from "firebase/storage";
import { Files, columns } from "./columns";

const Page = async ({ params: { client } }: { params: { client: string } }) => {
  async function getData(client: string): Promise<Files[]> {
    try {
      const storageRef = ref(storage, `${client}`);
      const res = await listAll(storageRef);

      const files = res.items.map((item) => item.name);
      console.log("Files retrieved successfully:", files);
      return files.map((fileName) => ({
        Filename: fileName,
      }));
    } catch (error) {
      console.error("Error retrieving files:");
      return [];
    }
  }

  const data = await getData(client);
  console.log(client);
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
