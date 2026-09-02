/**
 * Data Transfer Object for a category, returned by API endpoints.
 */
export interface CategoryDTO {
  _id: string;
  name: string;
  slug: string;
  parentId?: string;
  depth: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Input required to create a new category via API.
 */
export interface CreateCategoryInput {
  name: string;
  parentId?: string;
}

/**
 * Input required to update an existing category via API.
 */
export interface UpdateCategoryInput {
  name?: string;
  parentId?: string;
}
