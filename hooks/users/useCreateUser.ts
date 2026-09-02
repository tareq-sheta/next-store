// hooks / users / useCreateUser.ts;
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "@/lib";

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] }); // refetch users list
    },
  });
}
