using bazario_api.Models;

namespace bazario_api.DatabaseAccess
{
    public interface ISubcategoryDatabaseAccess
    {
        Task<IEnumerable<Subcategory>> GetSubcategoriesByCategoryIdAsync(int categoryId);
    }
}
