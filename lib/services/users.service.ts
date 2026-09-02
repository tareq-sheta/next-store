import { UserDTO } from "@/types";
import { ApiResponse } from "@/utils/general";
import connectToDatabase from "../database";
import { usersModel } from "@/models/users";

type AllowedUserProps = "id" | "_id" | "email" | "userName";

export const fetchUserByProperty = async (
  prop: AllowedUserProps,
  value: string,
): Promise<ApiResponse<UserDTO>> => {
  try {
    await connectToDatabase();

    // 1. Fetch the data
    const user = await usersModel.findOne({ [prop]: value }).lean();

    if (!user) {
      // FIX: Added `data: null` and `status: 404` to satisfy ApiResponse
      return {
        success: false,
        data: null,
        error: "User not found",
        // status: 404,
      };
    }

    // 2. SERIALIZATION: Convert MongoDB specific types to plain JavaScript strings
    const serializedUser: UserDTO = {
      ...user,
      _id: user._id.toString(),
      // FIX: Convert Date objects to ISO strings to satisfy UserDTO
      createdAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: user.updatedAt?.toISOString() ?? new Date().toISOString(),
    } as UserDTO;

    // FIX: Added `status: 200` to satisfy ApiResponse
    return {
      success: true,
      data: serializedUser,
      // status: 200,
    };
  } catch (error) {
    console.error(`Error in fetchUserByProperty (${prop}):`, error);

    // FIX: Added `data: null` and `status: 500` to satisfy ApiResponse
    return {
      success: false,
      data: null,
      error: "Internal server error",
      // status: 500,
    };
  }
};
