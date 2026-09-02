/**
 * Unit tests for lib/validations/users.ts
 */

import { describe, it, expect } from "@jest/globals";
import {
  ListUsersQuerySchema,
  AddressSchema,
  RegisterSchema,
} from "@/lib/validations/users";

describe("ListUsersQuerySchema", () => {
  it("applies defaults when the query is empty", () => {
    const result = ListUsersQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
    }
  });

  it("coerces string page/limit to numbers", () => {
    const result = ListUsersQuerySchema.safeParse({ page: "2", limit: "5" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(5);
    }
  });

  it("rejects a limit over the 50-item max page size", () => {
    const result = ListUsersQuerySchema.safeParse({ limit: "51" });
    expect(result.success).toBe(false);
  });

  it("rejects page <= 0", () => {
    const result = ListUsersQuerySchema.safeParse({ page: "0" });
    expect(result.success).toBe(false);
  });
});

describe("AddressSchema", () => {
  it("accepts a fully populated address", () => {
    const result = AddressSchema.safeParse({
      title: "Home",
      fullAddress: "123 Main St",
      phone: "555-1234",
      label: "Home",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an address without the optional label", () => {
    const result = AddressSchema.safeParse({
      title: "Home",
      fullAddress: "123 Main St",
      phone: "555-1234",
    });
    expect(result.success).toBe(true);
  });

  it.each(["title", "fullAddress", "phone"])(
    "rejects when %s is missing",
    (field) => {
      const payload: Record<string, string> = {
        title: "Home",
        fullAddress: "123 Main St",
        phone: "555-1234",
      };
      delete payload[field];
      const result = AddressSchema.safeParse(payload);
      expect(result.success).toBe(false);
    },
  );

  it.each(["title", "fullAddress", "phone"])(
    "rejects when %s is an empty string",
    (field) => {
      const payload: Record<string, string> = {
        title: "Home",
        fullAddress: "123 Main St",
        phone: "555-1234",
        [field]: "",
      };
      const result = AddressSchema.safeParse(payload);
      expect(result.success).toBe(false);
    },
  );
});

describe("RegisterSchema", () => {
  function validPayload(overrides: Record<string, unknown> = {}) {
    return {
      userName: "jdoe",
      email: "JDoe@Example.com",
      password: "password123",
      ...overrides,
    };
  }

  it("accepts a valid credentials signup", () => {
    const result = RegisterSchema.safeParse(validPayload());
    expect(result.success).toBe(true);
  });

  it("lowercases and trims the email", () => {
    const result = RegisterSchema.safeParse(
      validPayload({ email: "  JDoe@Example.com  " }),
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("jdoe@example.com");
    }
  });

  it("defaults role to 'customer' when omitted", () => {
    const result = RegisterSchema.safeParse(validPayload());
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.role).toBe("customer");
  });

  it("accepts an explicit 'seller' role", () => {
    const result = RegisterSchema.safeParse(validPayload({ role: "seller" }));
    expect(result.success).toBe(true);
  });

  it("rejects an 'admin' role at self-registration", () => {
    const result = RegisterSchema.safeParse(validPayload({ role: "admin" }));
    expect(result.success).toBe(false);
  });

  it("rejects userName under 2 characters", () => {
    const result = RegisterSchema.safeParse(validPayload({ userName: "j" }));
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email format", () => {
    const result = RegisterSchema.safeParse(
      validPayload({ email: "not-an-email" }),
    );
    expect(result.success).toBe(false);
  });

  it("rejects a password under 8 characters", () => {
    const result = RegisterSchema.safeParse(
      validPayload({ password: "short" }),
    );
    expect(result.success).toBe(false);
  });

  it("requires a password when provider is omitted (defaults to credentials)", () => {
    const result = RegisterSchema.safeParse({
      userName: "jdoe",
      email: "jdoe@test.com",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("password");
    }
  });

  it("requires a password when provider is explicitly 'credentials'", () => {
    const result = RegisterSchema.safeParse({
      userName: "jdoe",
      email: "jdoe@test.com",
      provider: "credentials",
    });
    expect(result.success).toBe(false);
  });

  it("does NOT require a password for OAuth providers (google)", () => {
    const result = RegisterSchema.safeParse({
      userName: "jdoe",
      email: "jdoe@test.com",
      provider: "google",
    });
    expect(result.success).toBe(true);
  });

  it("does NOT require a password for OAuth providers (github)", () => {
    const result = RegisterSchema.safeParse({
      userName: "jdoe",
      email: "jdoe@test.com",
      provider: "github",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unsupported provider value", () => {
    const result = RegisterSchema.safeParse(
      validPayload({ provider: "facebook" }),
    );
    expect(result.success).toBe(false);
  });

  it("rejects a non-URL image when provided", () => {
    const result = RegisterSchema.safeParse(
      validPayload({ image: "not-a-url" }),
    );
    expect(result.success).toBe(false);
  });

  it("accepts a valid list of addresses", () => {
    const result = RegisterSchema.safeParse(
      validPayload({
        addresses: [
          { title: "Home", fullAddress: "123 Main St", phone: "555-1234" },
        ],
      }),
    );
    expect(result.success).toBe(true);
  });

  it("rejects a malformed address in the addresses array", () => {
    const result = RegisterSchema.safeParse(
      validPayload({ addresses: [{ title: "Home" }] }),
    );
    expect(result.success).toBe(false);
  });
});
