import { create } from "zustand";
import type { Repo } from "../repo/model";
import { createLocalRepo } from "../repo";

type RepoStore = {
  repo: Repo;
  setRepo: (repo: Repo) => void;
};

export const repoStore = create<RepoStore>((set) => ({
  repo: createLocalRepo(),
  setRepo: (repo) => set({ repo }),
}));
