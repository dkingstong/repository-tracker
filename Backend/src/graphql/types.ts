export type User = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  repositories: Repository[];
};

export type Repository = {
  id: string;
  githubRepoId: number;
  name: string;
  owner: string;
  latestRelease: Release;
};

export type Release = {
  version: string;
  releaseDate: Date;
  description: string;
};

export type UserRepository = {
  id: string;
  user: User;
  repository: Repository;
  seen: boolean;
};
