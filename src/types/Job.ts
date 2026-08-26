export interface Job {
  id: string;
  propertyId: string;
  serviceType: string;   // upgraded to a ServiceType enum Day 6
  recurrence: string;    // "one-time" | "weekly" | "biweekly" | "monthly" for now
  status: string;        // upgraded to a JobStatus union type Day 5
}
