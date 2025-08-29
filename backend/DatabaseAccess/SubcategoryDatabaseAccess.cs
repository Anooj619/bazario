using bazario_api.Data;
using bazario_api.Models;
using Microsoft.EntityFrameworkCore;

namespace bazario_api.DatabaseAccess
{
    public class SubcategoryDatabaseAccess : ISubcategoryDatabaseAccess
    {
        private readonly BazarioDbContext _context;

        public SubcategoryDatabaseAccess(BazarioDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Subcategory>> GetSubcategoriesByCategoryIdAsync(int categoryId)
        {
            return await _context.Subcategories
                .Where(s => s.CategoryId == categoryId)
                .ToListAsync();
        }
    }
}
