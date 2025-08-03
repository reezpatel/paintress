import { useEffect, useState } from "react";
import { repoStore } from "@/lib/store/repo.store";
import { migrate } from "@/lib/db";

export const SyncProvider = ({ children }: { children: React.ReactNode }) => {
  const repo = repoStore((state) => state.repo);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    migrate().then(() => {
      repo.init().then(() => {
        setLoading(false);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
