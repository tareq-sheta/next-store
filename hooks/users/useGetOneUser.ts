// hooks/users/useUser.ts
import { fetchUserById } from "@/lib";
import { useQuery } from "@tanstack/react-query";
// import { fetchUserById } from "@/handlers/users";

export function useUser(id: string) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id, // don't run if id is empty
  });
}
