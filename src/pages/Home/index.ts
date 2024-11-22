import { fetchProducts, fetchProductsByCategories, searchProducts } from '../../services/productServices';
import { fetchCategories } from '../../services/categoryServices';
import { renderProducts } from '../../components/ProductList';
import { renderCategories } from '../../components/CategoryFilter';
import { Product } from '../../models/Product';
import { Category } from '../../models/Category';
import { SortOptions } from '../../enums/SortOptions';

const productListElement = document.getElementById('product-list') as HTMLElement;
const searchBarElement = document.getElementById('search-box') as HTMLInputElement;
const categoryFilterElement = document.getElementById('category-filter') as HTMLSelectElement;
const productSortElement = document.getElementById('product-sort') as HTMLSelectElement;

let allProducts: Product[] = [];

// Inicializar
export async function initializeHomePage(): Promise<void> {
  try {
    allProducts = await fetchProducts();
    const categories: Category[] = await fetchCategories();

    renderProducts(allProducts, productListElement);
    renderCategories(categories, categoryFilterElement);
  } catch (error) {
    console.error(error);
  }
}
  

// Buscar productos
searchBarElement.addEventListener('input', (e) => {
  const searchQuery = (e.target as HTMLInputElement).value;
  const filteredProducts = searchProducts(allProducts, searchQuery);
  renderProducts(filteredProducts, productListElement);
});

// Filtrar por categoría
categoryFilterElement.addEventListener('change', async (e) => {
  const category = (e.target as HTMLSelectElement).value;
  const filteredProducts = await fetchProductsByCategories(category);
  renderProducts(filteredProducts, productListElement);
});

// Ordenar por precio
productSortElement.addEventListener('change', (e) => {
  const sortOption = (e.target as HTMLSelectElement).value as SortOptions;
  
  let sortedProducts: Product[];

  switch (sortOption) {
    case SortOptions.PriceAsc:
      sortedProducts = [...allProducts].sort((a, b) => a.price - b.price);
      break;
    case SortOptions.PriceDesc:
      sortedProducts = [...allProducts].sort((a, b) => b.price - a.price);
      break;
    default:
      sortedProducts = [...allProducts];
      break;
  }

  renderProducts(sortedProducts, productListElement);
});