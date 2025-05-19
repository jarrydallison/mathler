import { type UpdateUserFieldsArg } from "@dynamic-labs/sdk-react-core";
import type { UpdateUser } from "node_modules/@dynamic-labs/sdk-react-core/src/lib/utils/hooks";

export const handleUpdateUser = async (
  updateUser: UpdateUser,
  userFields: UpdateUserFieldsArg
) => {
  const response = await updateUser(userFields);
  return response;
};
