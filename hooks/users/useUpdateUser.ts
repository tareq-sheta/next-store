import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { updateUser } from "@/handlers/users";
import { UpdateUserInput } from "@/types/users";
import { updateUser } from "@/lib";

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserInput) => updateUser(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["users", id], updatedUser); // update cache directly
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
