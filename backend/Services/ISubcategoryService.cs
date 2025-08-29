using bazario_api.Contracts.Category;

namespace bazario_api.Services
{
    public interface ISubcategoryService
    {
        Task<IEnumerable<SubcategoryResponse>> GetSubcategoriesByCategoryIdAsync(int categoryId);
    }
}
