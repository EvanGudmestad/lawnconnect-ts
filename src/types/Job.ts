export interface Job {
  id: string;
  propertyId: string;
  serviceType: ServiceType;   // upgraded to a ServiceType enum Day 6
  recurrence: string;    // "one-time" | "weekly" | "biweekly" | "monthly" for now
  status: JobStatus;        // upgraded to a JobStatus union type Day 5
  quotedPrice:number; // the app’s upfront price — set before any Provider is involved, no bidding
  priceAcceptedAt? : string; // when the Customer accepted quotedPrice; undefined until they do
}

export enum ServiceType {
  Mowing,
  Edging,
  Fertalizing,
  LeafCleanup,
}

export class RecurringJobPlan{
  private recurrence: string;
  constructor(recurrence:string){
    this.recurrence = recurrence;
  }
  describe():string{
    switch (this.recurrence) {
      case "weekly": return "every week";
      case "biweekly": return "every 2 weeks";
      case "monthly": return "once a month";
      default: return "a one-time visit";
  }
}
}



export type JobStatus = "pending" | "accepted" | "completed" | "cancelled";

export function describeJobStatus(status: JobStatus): string {
  switch (status) {
    case "pending": return "Waiting for a Provider to accept.";
    case "accepted": return "A Provider is on the way.";
    case "completed": return "Done — payment can be processed.";
    case "cancelled": return "This job was cancelled.";
  }
}

const myJob = new RecurringJobPlan("biweekly");
console.log(myJob.describe()); // Output: "every 2 weeks"