import useDrivePicker from "react-google-drive-picker";

function App() {
  const [openPicker, authResponse] = useDrivePicker();

  console.log(process.env.GOOGLE_CLIENT_ID);

  const handleOpenPicker = () => {
    openPicker({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      developerKey: process.env.GOOGLE_API_KEY as string,
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: async (data) => {
        if (data.action === "picked") {
          const driveFiles = data.docs.map((doc) => ({
            id: doc.id,
            name: doc.name,
            mimeType: doc.mimeType,
          }));
          await downloadAndUploadFiles(driveFiles);
        } else if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        }
      },
    });
  };

  const downloadAndUploadFiles = async (
    driveFiles: { id: string; name: string; mimeType: string }[]
  ) => {
    let uploadedCount = 0;

    const uploadPromises = driveFiles.map(async (file) => {
      try {
        const fileBlob = await downloadFileFromDrive(file.id, file.mimeType);
        if (fileBlob) {
          console.log(fileBlob);
          //   await uploadFileToFirebase(fileBlob, file.name);
          uploadedCount++;
        } else {
          throw new Error(`Failed to download file: ${file.name}`);
        }
      } catch (error) {
        console.error(`Error with file ${file.name}:`, error);
        alert(
          `An error occurred while uploading ${file.name}. Please try again.`
        );
      }
    });

    try {
      await Promise.all(uploadPromises);
      //   clearCachesByServerAction(pathname);
    } catch (error: any) {
      console.error("Error uploading files:", error);
      alert("An error occurred while uploading files. Please try again.");
    } finally {
    }
  };

  const downloadFileFromDrive = async (fileId: string, mimeType: string) => {
    try {
      let url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

      // Fetch file metadata (mimeType and name)
      const fileMetadataResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=mimeType,name`,
        {
          headers: {
            Authorization: `Bearer ${authResponse}`,
          },
        }
      );

      if (!fileMetadataResponse.ok) {
        throw new Error(
          `Failed to retrieve file metadata. Status: ${fileMetadataResponse.status} - ${fileMetadataResponse.statusText}`
        );
      }

      const fileMetadata = await fileMetadataResponse.json();

      // Check if the file is a Google Docs file that requires exporting
      const isGoogleDocsFile = fileMetadata.mimeType.startsWith(
        "application/vnd.google-apps."
      );

      if (isGoogleDocsFile) {
        url = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=application/pdf`;
      }

      // Download or export the file from Google Drive
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${authResponse}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to download file from Drive. Status: ${response.status} - ${response.statusText}`
        );
      }

      // Return the file blob
      return await response.blob();
    } catch (error) {
      console.error("Error downloading or exporting file:", error);
      // Optionally provide user feedback or retry logic here
      return null; // Return null to signal failure to the caller
    }
  };

  return (
    <div>
      <button onClick={() => handleOpenPicker()}>Open Picker</button>
    </div>
  );
}

export default App;
