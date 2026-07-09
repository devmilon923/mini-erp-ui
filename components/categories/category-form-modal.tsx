"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Category;
  onSubmit: (data: Omit<Category, "id">) => void;
};

const STATUS_OPTIONS: Category["status"][] = ["draft", "active", "disabled"];

export function CategoryFormModal({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [status, setStatus] = useState<Category["status"]>(
    initial?.status ?? "draft",
  );

  useEffect(() => {
    setName(initial?.name ?? "");
    setStatus(initial?.status ?? "draft");
  }, [initial, open]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({ name, status });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-0 border-mist p-0 sm:rounded-data">
        <DialogHeader className="space-y-1 border-b border-mist p-6">
          <DialogTitle className="font-heading text-2xl font-normal tracking-tight text-graphite">
            {initial ? "Edit category" : "Add category"}
          </DialogTitle>
          <DialogDescription className="text-slate-token">
            {initial
              ? "Update the category details below."
              : "Create a new category for your catalog."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-slate-token">
              Category name
            </Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter category name"
              className="h-11 rounded-xl border-mist bg-canvas"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-slate-token">
              Status
            </Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as Category["status"])}
            >
              <SelectTrigger className="h-11 rounded-xl border-mist bg-canvas">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option === "draft"
                      ? "Draft"
                      : option === "active"
                        ? "Active"
                        : "Disabled"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-pill border-mist text-steel hover:bg-fog"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-pill bg-graphite text-white hover:bg-graphite/90"
            >
              {initial ? "Save changes" : "Create category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
