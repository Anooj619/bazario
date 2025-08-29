using bazario_api.Models;
using Microsoft.EntityFrameworkCore;
using bazario_api.Data;

namespace bazario_api.DatabaseAccess
{
    public class CategoryDatabaseAccess : ICategoryDatabaseAccess
    {
        private readonly BazarioDbContext _context;

        public CategoryDatabaseAccess(BazarioDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }
    }
}
