import { Types } from "mongoose";
import type { UserRole } from "./roles";
import { CustomError } from "@/utils/ErrorHandler";

type Session = { user: { id: string; role: UserRole } };

// A resource is "ownable" if it has exactly one of these fields identifying
// who it belongs to. Products are owned via `seller`; orders and carts via
// `user`. Add a new variant here if a future resource introduces a third
// ownership field name — don't add a third permission-string convention.
type Ownable =
  | { seller: Types.ObjectId | string }
  | { user: Types.ObjectId | string };

function ownerIdOf(resource: Ownable): string {
  return "seller" in resource
    ? resource.seller.toString()
    : resource.user.toString();
}

// The one place ownership is decided. Admins always pass; everyone else
// must be the resource's own seller/user. Used identically for products,
// orders, and user profiles instead of a separate assertOwns* function
// duplicated per resource type, and instead of an "own:x" permission string
// that has to be separately granted to every role that should pass it.
export function isOwnerOrAdmin(session: Session, resource: Ownable): boolean {
  if (session.user.role === "admin") return true;
  return ownerIdOf(resource) === session.user.id;
}

// Throwing variant for routes that want a one-line guard clause instead of
// an if/throw pair at every call site.
export function assertOwnerOrAdmin(
  session: Session,
  resource: Ownable,
  location: string,
): void {
  if (!isOwnerOrAdmin(session, resource)) {
    throw new CustomError("Forbidden", 403, location);
  }
}
