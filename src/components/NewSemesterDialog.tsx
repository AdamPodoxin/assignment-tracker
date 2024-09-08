"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { createSemester } from "~/app/actions/semester";
import { useToast } from "~/hooks/use-toast";

const NewSemesterDialog = () => {
  const router = useRouter();

  const { toast } = useToast();

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
              try {
                const semester = await createSemester(name);
                router.push(`/semester/${semester.id}`);
              } catch (e) {
                toast({
                  title: (e as Error).message,
                  variant: "destructive",
                });
              }
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
