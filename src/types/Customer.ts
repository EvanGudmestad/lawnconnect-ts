export interface Customer {
  id: string;
  name: string;
  email: string;
  customerType: CustomerType; // "residential" or "commercial" upgrade to a union type
}

export type CustomerType = "residential" | "commercial";

export function getServiceInstructions(customerType: CustomerType): string {
  return customerType === "commercial"
    ? "Check in with the property manager or front desk before starting."
    : "Standard residential access — check the gate code on file.";
}
