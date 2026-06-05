// hooks/users/useUsers.ts
import { useQuery } from "@tanstack/react-query";
import { fetchAllUsers } from "@/handlers/users";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });
}
