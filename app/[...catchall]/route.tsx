import { NextResponse } from "next/server";

async function fallbackHandler() {
  return NextResponse.json(
    {
      error: "Not Found",
      message: "The requested API endpoint does not exist.",
    },
    { status: 404 },
  );
}

// Export for all possible HTTP methods
export {
  fallbackHandler as GET,
  fallbackHandler as POST,
  fallbackHandler as PUT,
  fallbackHandler as DELETE,
  fallbackHandler as PATCH,
};
