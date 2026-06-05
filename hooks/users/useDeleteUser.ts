// hooks/users/useDeleteUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/handlers/users";

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.removeQueries({ queryKey: ["users", id] });
    },
  });
}
