"use client";

import { type ReactNode, useState } from "react";
import { type DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type Checked = DropdownMenuCheckboxItemProps["checked"];

const FilterDropdown = ({
  title,
  options,
}: {
  title: ReactNode;
  options: { id: string; name: string }[];
}) => {
  const [checkedOptions, setCheckedOptions] = useState(
    options.reduce((prev, curr) => ({ ...prev, [curr.id]: true }), {}),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">{title}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {options.map((o) => (
          <DropdownMenuCheckboxItem
            key={o.id}
            checked={checkedOptions}
            onCheckedChange={(e) => {
              console.log("NEW:", e);

              console.log(checkedOptions);
              const opts = checkedOptions;
              opts[o.id] = e;
              console.log(opts[o.id]);
              setCheckedOptions(opts);
            }}
          >
            {o.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
