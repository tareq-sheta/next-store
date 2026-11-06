// import { NextResponse } from "next/server";

// export class CustomError extends Error {
//   status: number;
//   location: string | undefined;

//   constructor(message: string, status: number, location = "") {
//     super(message);
//     this.status = status;
//     this.location =
//       process.env.NODE_ENV !== "production" ? location : undefined;
//     // this.location = location;
//     // this.name = this.constructor.name;
//     // Error.captureStackTrace(this, this.constructor);
//   }
// }
// export function handleError(error: unknown, fallbackMessage: string) {
//   if (error instanceof CustomError) {
//     return NextResponse.json(
//       {
//         success: false,
//         error: error.message,
//         ...(process.env.NODE_ENV !== "production" && {
//           location: error.location,
//         }),
//       },
//       { status: error.status },
//     );
//   }
//   return NextResponse.json(
//     { success: false, error: fallbackMessage, location: undefined },
//     { status: 500 },
//   );
// }
import { NextResponse } from "next/server";

export class CustomError extends Error {
  status: number;
  location?: string; // Optional property

  constructor(message: string, status: number, location = "") {
    super(message);
    this.status = status;

    // ⚡ FIX: Destructure process.env to bypass Next.js static replacement
    const { NODE_ENV } = process.env;

    if (NODE_ENV !== "production") {
      this.location = location;
    }
  }
}

export function handleError(error: unknown, fallbackMessage: string) {
  // ⚡ FIX: Destructure here as well
  const { NODE_ENV } = process.env;

  if (error instanceof CustomError) {
    const payload: Record<string, any> = {
      success: false,
      error: error.message,
    };

    if (NODE_ENV !== "production" && error.location !== undefined) {
      payload.location = error.location;
    }

    return NextResponse.json(payload, { status: error.status });
  }

  // Generic fallback
  return NextResponse.json(
    { success: false, error: fallbackMessage },
    { status: 500 },
  );
}
