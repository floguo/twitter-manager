export interface TwitterResponse {
  tweets?: Array<{
    id: string;
    text: string;
    // ... other tweet properties
  }>;
  error?: string;
}

export type TwitterUser = {
  // ... type definition ...
}

export type UserGroup = {
  // ... type definition ...
} 