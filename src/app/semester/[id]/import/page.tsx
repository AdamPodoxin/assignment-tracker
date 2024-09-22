"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CSVImporter } from "csv-import-react";
import { FileIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { importCsv, type ImportCsvData } from "../importCsv";

const ImportCsvPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant={"secondary"}
        className="my-2"
        onClick={() => setIsModalOpen(true)}
      >
        <span className="flex items-center">
          <FileIcon className="mr-2 h-4 w-4" /> Import CSV
        </span>
      </Button>

      <CSVImporter
        modalIsOpen={isModalOpen}
        modalOnCloseTriggered={() => setIsModalOpen(false)}
        darkMode={true}
        onComplete={async (data) => {
          await importCsv({
            data: data as ImportCsvData,
            semesterId: params.id,
          });

          router.push(`/semester/${params.id}`);
        }}
        template={{
          columns: [
            {
              name: "Course",
              key: "course",
              required: true,
            },
            {
              name: "Assignment",
              key: "assignment",
              required: true,
            },
            {
              name: "Due Date",
              key: "dueDate",
              required: true,
            },
            {
              name: "Status",
              key: "status",
              required: true,
            },
          ],
        }}
      />
    </>
  );
};

export default ImportCsvPage;
