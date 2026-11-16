import { useState } from "react";
import type { Provider } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  const [confirming, setConfirming] = useState(false);

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
            {onDelete && !confirming && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirming(true)}
              >
                Delete
              </Button>
            )}
            {onDelete && confirming && (
              <span className="flex flex-wrap items-center gap-2 text-sm">
                <span>Delete this listing?</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(provider.id)}
                >
                  Yes, delete
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirming(false)}
                >
                  Cancel
                </Button>
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
