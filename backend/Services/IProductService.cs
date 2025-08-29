using bazario_api.Contracts.Products;   
namespace bazario_api.Services
{
    public interface IProductService
    {
        Task<List<ProdcutsResponse>> GetProductsBySubcategoryIdAsync(int subcategoryId);
        Task<ProdcutsResponse?> GetProductByIdAsync(int id);
        Task<List<ProdcutsResponse>> GetAllProductsAsync();
        Task<List<ProdcutsResponse>> SearchProductsAsync(string keyword, int page, int pageSize);
    }
}
