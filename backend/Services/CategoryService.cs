using bazario_api.DatabaseAccess;
using bazario_api.Contracts.Category;

namespace bazario_api.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryDatabaseAccess _categoryDb;

        public CategoryService(ICategoryDatabaseAccess categoryDb)
        {
            _categoryDb = categoryDb;
        }

        public async Task<IEnumerable<CategoryResponse>> GetAllCategoriesAsync()
        {
            var categories = await _categoryDb.GetAllCategoriesAsync();
            return categories.Select(c => new CategoryResponse
            {
                Id = c.Id,
                Name = c.Name
            });
        }
    }
}
