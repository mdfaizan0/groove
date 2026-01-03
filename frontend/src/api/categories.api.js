import apiClient from "./client";

export async function fetchCategories() {
    const { data } = await apiClient.get("/categories");
    if (data.success) return data.categories;
    return [];
}