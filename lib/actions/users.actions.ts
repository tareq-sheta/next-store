"use server";

import connectToDatabase from "@/lib/database";
import { usersModel } from "@/models/users";
import { UserDTO } from "@/types";
import { ApiResponse } from "@/utils/general";

type QueryProp = {
  prop: "id" | "_id" | "email" | "userName";
  value: string;
};

export async function fetchUserByProperty(
  query: QueryProp,
): Promise<ApiResponse<UserDTO>> {
  try {
    await connectToDatabase();
    const { prop, value } = query;

    const user = await usersModel.findOne({ [prop]: value }).lean();
    console.log("user in the action: ", user);

    if (!user) {
      return {
        success: false,
        data: null,
        error: "User not found",
        // status: 404,
      };
    }

    console.log("user in the action111: ", user);

    // Helper to safely format dates whether they are Strings or Date objects
    const safeFormatDate = (dateVal: any) => {
      if (!dateVal) return new Date().toISOString();
      return new Date(dateVal).toISOString();
    };

    const serializedUser: UserDTO = {
      ...user,
      _id: user._id.toString(),
      createdAt: safeFormatDate(user.createdAt),
      updatedAt: safeFormatDate(user.updatedAt),
    } as UserDTO;

    return {
      success: true,
      data: serializedUser,
      // status: 200,
    };
  } catch (error) {
    console.error(`Error in fetchUserAction (${query.prop}):`, error);
    return {
      success: false,
      data: null,
      error: "Internal server error",
      // status: 500,
    };
  }
}
