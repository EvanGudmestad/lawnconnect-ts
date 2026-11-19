import type { Provider } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ProviderCardProps = {
  provider: Provider;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function ProviderCard({
  provider,
  onSelect,
  onDelete,
}: ProviderCardProps) {
  return (
    <article>
      <Card>
        <CardContent className="flex flex-col gap-3">
          <h3 className="text-base font-medium">{provider.name}</h3>
          <div className="flex flex-wrap items-center gap-2">
            {provider.servicesOffered.map((service) => (
              <Badge key={service} variant="secondary">
                {service}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Serves{" "}
            {provider.serviceAreaZipCodes.length > 0
              ? provider.serviceAreaZipCodes.join(", ")
              : "no ZIP codes yet"}
          </p>
          {provider.createdBy && (
            <p className="text-sm text-muted-foreground">
              Listed by {provider.createdBy.fullName}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {onSelect && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onSelect(provider.id)}
              >
                View
              </Button>
            )}
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger
                  render={<Button type="button" variant="ghost" size="sm" />}
                >
                  Delete
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {provider.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This removes the listing for everyone. It cannot be
                      undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={() => onDelete(provider.id)}
                    >
                      Yes, delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
