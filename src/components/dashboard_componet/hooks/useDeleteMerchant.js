import { useQueryClient } from "@tanstack/react-query";
import { deleteMerchant } from "../../../services/merchant.service";
import { useMutation } from "@tanstack/react-query";
import * as Sentry from "@sentry/react";
export const useDeleteMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMerchant,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["merchants"],
      });
    },
    onError: (error) => {
      Sentry.captureException(error);
    },
  });
};
