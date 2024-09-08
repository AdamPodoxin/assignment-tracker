"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Semester } from "@prisma/client";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const NewSemesterDialog = () => {
  const router = useRouter();

  const [name, setName] = useState("");

  return (
    <Dialog>
      <DialogTrigger>
        <Button>+</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New semester</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={async () => {
              const response = await fetch("/api/semesters", {
                method: "POST",
                body: JSON.stringify({ name: name }),
              });

              const data = (await response.json()) as Semester;

              router.push(`/semester/${data.id}`);
            }}
            type="submit"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewSemesterDialog;
