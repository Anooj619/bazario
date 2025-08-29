using bazario_api.Models;

namespace bazario_api.DatabaseAccess
{
    public interface ICategoryDatabaseAccess
    {
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
    }
}


