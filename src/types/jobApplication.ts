export interface JobApplication {
  id: string;
  jobId: string;
  providerId: string;
  appliedAt: string;
  providerResponse?: "accepted" | "declined" //Like an uber driver responding to a ride
}
