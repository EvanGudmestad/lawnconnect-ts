export interface JobApplication {
  id: string;
  jobId: string;
  providerId: string;
  appliedAt: string;
  providerResponse?: "accepted" | "declined"; // like an Uber driver responding to a ride
}
