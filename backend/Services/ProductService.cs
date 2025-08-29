using bazario_api.Contracts.Products;
using bazario_api.DatabaseAccess;
using bazario_api.Models;

namespace bazario_api.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductDatabaseAccess _productDatabaseAccess;
        private readonly ICategoryDatabaseAccess _categoryDatabaseAccess;
        public ProductService(IProductDatabaseAccess productDatabaseAccess, ICategoryDatabaseAccess categoryDatabaseAccess)
        {
            _productDatabaseAccess = productDatabaseAccess;
            _categoryDatabaseAccess = categoryDatabaseAccess;
        }
        public async Task<List<ProdcutsResponse>> GetProductsBySubcategoryIdAsync(int subcategoryId)
        {
            var products = await _productDatabaseAccess.GetProductsBySubcategoryIdAsync(subcategoryId);
            return products.Select(p => new ProdcutsResponse
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Rating = p.Rating,
                ImageUrl = p.ImageUrl,
                SubcategoryId = p.SubcategoryId
            }).ToList();
        }
        public async Task<ProdcutsResponse?> GetProductByIdAsync(int id)
        {
            var product = await _productDatabaseAccess.GetProductByIdAsync(id);

            if (product == null)
                return null;

            return new ProdcutsResponse
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Rating = product.Rating,
                ImageUrl = product.ImageUrl,
                SubcategoryId = product.SubcategoryId
            };
        }
        public async Task<List<ProdcutsResponse>> GetAllProductsAsync()
        {
            var products = await _productDatabaseAccess.GetAllProductsAsync();
            return products.Select(p => new ProdcutsResponse
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Rating = p.Rating,
                ImageUrl = p.ImageUrl,
                SubcategoryId = p.SubcategoryId
            }).ToList();
        }
        public async Task<List<ProdcutsResponse>> SearchProductsAsync(string keyword, int page, int pageSize)
        {
            var products = await _productDatabaseAccess.SearchProductsAsync(keyword, page, pageSize);
            return MapToResponse(products);
        }

        // 🔹 Helper mapping methods
        private List<ProdcutsResponse> MapToResponse(List<Models.Product> products)
        {
            return products.Select(MapToResponse).ToList();
        }

        private ProdcutsResponse MapToResponse(Models.Product p)
        {
            return new ProdcutsResponse
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Rating = p.Rating,
                ImageUrl = p.ImageUrl,
                SubcategoryId = p.SubcategoryId
            };
        }
    }
}
