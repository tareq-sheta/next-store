// hooks / users / useCreateUser.ts;
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/handlers/users";

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] }); // refetch users list
    },
  });
}
