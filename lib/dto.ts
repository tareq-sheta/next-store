import { CartDoc } from "@/models/cart";
import { CategoryDoc } from "@/models/categories";
import { ProductDoc } from "@/models/products";
import { UserDoc } from "@/models/users";
import { CartDTO, CategoryDTO, OrderDTO, UserDTO } from "@/types";
import { PopulatedOrderDoc, PopulatedOrderItem } from "@/types/orders";
// import {  PopulatedOrderDoc, PopulatedOrderItem } from "@/types/orders";
import {
  AdminProductDoc,
  AdminProductDTO,
  ProductCategory,
  PublicProductDTO,
  SellerProductDTO,
} from "@/types/products";

export function toCartDTO(doc: CartDoc): CartDTO {
  return {
    _id: doc._id.toString(),
    user: doc.user.toString(),
    products: doc.products.map((item) => ({
      product: item.product.toString(),
      quantity: item.quantity,
    })),
    createdAt: doc.createdAt?.toISOString() ?? "",
    updatedAt: doc.updatedAt?.toISOString() ?? "",
  };
}

// Public storefront — minimal, safe fields only.
export function toPublicProductDTO(doc: ProductDoc): PublicProductDTO {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    price: doc.price,
    description: doc.description,
    category: doc.category as ProductCategory,
    image: doc.image,
    stockStatus:
      doc.stock > 5 ? "IN_STOCK" : doc.stock > 0 ? "LOW_STOCK" : "OUT_OF_STOCK", // temperary amount
    createdAt: doc.createdAt?.toISOString() ?? "",
    updatedAt: doc.updatedAt?.toISOString() ?? "",
  };
}

// Seller dashboard — exact stock, since they own this data.
export function toSellerProductDTO(doc: ProductDoc): SellerProductDTO {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    price: doc.price,
    description: doc.description,
    category: doc.category as ProductCategory,
    image: doc.image,
    stock: doc.stock,
    unitsSold: doc.unitsSold,
    createdAt: doc.createdAt?.toISOString() ?? "",
    updatedAt: doc.updatedAt?.toISOString() ?? "",
  };
}

export function toAdminProductDTO(doc: AdminProductDoc): AdminProductDTO {
  // Check your terminal! You will see the `doc` printed here is missing the seller object
  console.log(doc, "doc inside DTO");

  return {
    _id: doc._id?.toString() || "",
    name: doc.name,
    price: doc.price,
    image: doc.image,
    category: doc.category as ProductCategory,
    description: doc.description,
    stock: doc.stock,
    unitsSold: doc.unitsSold,

    // Safely handle dates just in case they are already strings
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : "",

    // THE FIX: Safely check if doc.seller exists before accessing _id, userName, or email
    sellerId: doc.seller?._id?.toString() || "unknown_id",
    sellerName: doc.seller?.userName || "Unknown Seller",
    sellerEmail: doc.seller?.email || "No Email",
  };
}

export function toCategoryDTO(doc: CategoryDoc): CategoryDTO {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    parentId: doc.parentId?.toString(),
    depth: doc.depth,
    createdAt: doc.createdAt?.toISOString() ?? "",
    updatedAt: doc.updatedAt?.toISOString() ?? "",
  };
}

// Was reading item.productId / item.productStatus, which don't exist on
// OrderDoc — every order response silently returned `undefined` for both
// fields. Now matches the real product/status shape.
// export function toOrderDTO(doc: OrderDoc): OrderDTO {
//   return {
//     _id: doc._id.toString(),
//     user: doc.user,
//     products: doc.products.map((item) => ({
//       product: {
//         name: item.product.name,
//         price: item.product.price,
//         image: item.product.image,
//       },
//       quantity: item.quantity,
//       productStatus: item.productStatus,
//     })),

//     orderStatus: doc.orderStatus,
//     createdAt: doc.createdAt?.toISOString() ?? "",
//     updatedAt: doc.updatedAt?.toISOString() ?? "",
//   };
// }
export function toOrderDTO(doc: PopulatedOrderDoc): OrderDTO {
  const computedTotalPrice = doc.products.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0,
  );
  return {
    _id: doc._id.toString(),
    user: doc.user,
    products: doc.products.map((item: PopulatedOrderItem) => ({
      product: {
        _id: item.product._id.toString(),
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
      },
      quantity: item.quantity,
      netPrice: item.product.price * item.quantity,
      productStatus: item.productStatus,
    })),
    totalPrice: computedTotalPrice,
    orderStatus: doc.orderStatus,
    createdAt: doc.createdAt?.toISOString() ?? "",
    updatedAt: doc.updatedAt?.toISOString() ?? "",
  };
}

export function toUserDTO(doc: UserDoc): UserDTO {
  return {
    _id: doc._id.toString(),
    userName: doc.userName,
    email: doc.email,
    role: doc.role,
    image: doc.image,
    provider: doc.provider ?? "credentials",
    addresses: doc.addresses?.map((addr) => ({
      title: addr.title,
      fullAddress: addr.fullAddress,
      phone: addr.phone,
      label: addr.label ?? "Home",
    })),
    createdAt: doc.createdAt?.toISOString() ?? "",
    updatedAt: doc.updatedAt?.toISOString() ?? "",
  };
}
