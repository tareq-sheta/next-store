export interface CategoryDTO {
  _id: string;
  name: string;
  slug: string;
  parentId?: string;
  depth: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  parentId?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  parentId?: string;
}
