import { Controller, useForm } from "react-hook-form";
import type { FieldErrors, Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Mail, MapPin, Phone } from "lucide-react";
import { ApiError } from "../api";
import type { ProviderDraft } from "../api";
import { createProviderSchema } from "../schemas/providerForm";

// What the boxes hold is text. What the API wants for two of them is a list.
export type ProviderFormValues = {
  name: string;
  email: string;
  phone: string;
  serviceAreaZipCodes: string;
  servicesOffered: string;
};

const empty: ProviderFormValues = {
  name: "",
  email: "",
  phone: "",
  serviceAreaZipCodes: "",
  servicesOffered: "",
};

const splitList = (text: string) =>
  text
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");

export function toDraft(values: ProviderFormValues): unknown {
  const phone = values.phone.trim();
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    ...(phone !== "" ? { phone } : {}),
    serviceAreaZipCodes: splitList(values.serviceAreaZipCodes),
    servicesOffered: splitList(values.servicesOffered),
  };
}

export function toFormValues(p: {
  name: string;
  email: string;
  phone?: string;
  serviceAreaZipCodes: string[];
  servicesOffered: string[];
}): ProviderFormValues {
  return {
    name: p.name,
    email: p.email,
    phone: p.phone ?? "",
    serviceAreaZipCodes: p.serviceAreaZipCodes.join(", "),
    servicesOffered: p.servicesOffered.join(", "),
  };
}

const fieldNames = [
  "name",
  "email",
  "phone",
  "serviceAreaZipCodes",
  "servicesOffered",
] as const;
type FieldName = (typeof fieldNames)[number];
function isFieldName(value: string): value is FieldName {
  return fieldNames.some((n) => n === value);
}

// Turn the boxes into what the API expects, then ask the API's own schema.
const resolver: Resolver<ProviderFormValues> = (values) => {
  const parsed = createProviderSchema.safeParse(toDraft(values));
  if (parsed.success) return { values, errors: {} };
  const errors: FieldErrors<ProviderFormValues> = {};
  for (const issue of parsed.error.issues) {
    const key = String(issue.path[0]);
    if (isFieldName(key) && !errors[key])
      errors[key] = { type: "validate", message: issue.message };
  }
  return { values: {}, errors };
};

type ProviderFormProps = {
  onSave: (draft: ProviderDraft) => Promise<void> | void;
  initial?: ProviderFormValues;
  submitLabel?: string;
  clearOnSuccess?: boolean;
};

export function ProviderForm({
  onSave,
  initial = empty,
  submitLabel = "Add provider",
  clearOnSuccess = true,
}: ProviderFormProps) {
  const form = useForm<ProviderFormValues>({
    resolver,
    defaultValues: initial,
  });

  async function onValid(values: ProviderFormValues) {
    try {
      await onSave(createProviderSchema.parse(toDraft(values)));
      if (clearOnSuccess) form.reset(empty);
    } catch (err) {
      if (!(err instanceof ApiError)) {
        form.setError("root.server", { message: "Could not reach the server" });
        return;
      }
      let placed = false;
      for (const detail of err.details) {
        if (isFieldName(detail.path)) {
          form.setError(detail.path, {
            type: "server",
            message: detail.message,
          });
          placed = true;
        }
      }
      if (!placed) form.setError("root.server", { message: err.message });
    }
  }

  const rootMessage = form.formState.errors.root?.server?.message;
  const box = (
    name: FieldName,
    label: string,
    hint?: string,
    icon?: React.ReactNode,
  ) => (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={`provider-${name}`}>{label}</FieldLabel>
          {icon ? (
            <InputGroup>
              <InputGroupAddon>{icon}</InputGroupAddon>
              <InputGroupInput
                {...field}
                id={`provider-${name}`}
                aria-invalid={fieldState.invalid}
              />
            </InputGroup>
          ) : (
            <Input
              {...field}
              id={`provider-${name}`}
              aria-invalid={fieldState.invalid}
            />
          )}
          {hint && <FieldDescription>{hint}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );

  return (
    <form
      onSubmit={form.handleSubmit(onValid)}
      noValidate
      className="rounded-lg border p-4"
    >
      <FieldGroup>
        {box("name", "Name")}
        {box("email", "Email", undefined, <Mail />)}
        {box("phone", "Phone (optional)", undefined, <Phone />)}
        {box(
          "serviceAreaZipCodes",
          "ZIP codes served",
          "Separate with commas",
          <MapPin />,
        )}
        {box("servicesOffered", "Services offered", "Separate with commas")}
        {rootMessage && <FieldError>{rootMessage}</FieldError>}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}
          {submitLabel}
        </Button>
      </FieldGroup>
    </form>
  );
}
