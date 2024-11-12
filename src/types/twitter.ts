interface TwitterUser {
  id: string;
  name: string;
  username: string;
  description: string;
  groups?: string[];
}

interface UserGroup {
  id: string;
  name: string;
  description?: string;
  userIds: string[];
}

export type _TwitterUser = TwitterUser;
export type _UserGroup = UserGroup; 