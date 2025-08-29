using bazario_api.Models;

namespace bazario_api.DatabaseAccess
{
    public interface IProductDatabaseAccess
    {
        Task<List<Product>> GetProductsBySubcategoryIdAsync(int subcategoryId);
        Task<Product?> GetProductByIdAsync(int id);
        Task<List<Product>> GetAllProductsAsync();
        Task<List<Product>> SearchProductsAsync(string keyword, int page, int pageSize);
    }
}
