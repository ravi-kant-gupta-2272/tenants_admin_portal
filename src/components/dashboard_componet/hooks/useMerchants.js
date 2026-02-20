import { useQuery } from "@tanstack/react-query";

import { getAllMerchants } from "../../../services/merchant.service";

// export const useMerchants = () => {
//   return useQuery({
//     queryKey: ["merchants"],
//     queryFn: fetchMerchants,
//   });
// };

export const useMerchants = (page, limit) => {
  const skip = (page - 1) * limit;

  return useQuery({
    queryKey: ["merchants", page, limit],
    queryFn: () => getAllMerchants(limit, skip),
    keepPreviousData: true,
  });
};
