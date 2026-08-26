export interface Customer {
  id: string;
  name: string;
  email: string;
  customerType:string; // "residential" or "commercial" upgrade to a union type
}