import { updateUser as updateUser1 } from "@/lib/api/users";
import { IUser } from "@/models/users";
import { useParams } from "next/navigation";

export const login = async (email: string, password: string) => {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Parse the JSON and return it directly back to the component
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error logging in:", error);
    // Return a fallback error structure if the network totally fails
    return { success: false, error: "Network error. Please try again." };
  }
};
export const register = async (email: string, password: string) => {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error registering:", error);
    return { success: false, error: "Network error. Please try again." };
  }
};
export const resetPassword = async (email: string, password: string) => {
  try {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, error: "Network error. Please try again." };
  }
};

export const updateUser = async (user: Partial<IUser>) => {
  const { id } = useParams();
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: "Network error. Please try again." };
  }
};
