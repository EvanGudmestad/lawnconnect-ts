import { toast } from "@/components/ui/toast";

export function notify(title: string, type: "success" | "error" = "success") {
  toast.add({ title, type });
}
