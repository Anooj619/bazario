using bazario_api.DatabaseAccess;
using bazario_api.Contracts.Category;

namespace bazario_api.Services
{
    public class SubcategoryService : ISubcategoryService
    {
        private readonly ISubcategoryDatabaseAccess _subcategoryDb;

        public SubcategoryService(ISubcategoryDatabaseAccess subcategoryDb)
        {
            _subcategoryDb = subcategoryDb;
        }
        public async Task<IEnumerable<SubcategoryResponse>> GetSubcategoriesByCategoryIdAsync(int categoryId)
        {
            var subcategories = await _subcategoryDb.GetSubcategoriesByCategoryIdAsync(categoryId);
            return subcategories.Select(s => new SubcategoryResponse
            {
                Id = s.Id,
                Name = s.Name,
                CategoryId = s.CategoryId
            });
        }
    }
}
