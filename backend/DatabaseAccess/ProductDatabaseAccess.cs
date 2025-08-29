using bazario_api.Data;
using bazario_api.Models;
using Microsoft.EntityFrameworkCore;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;

namespace bazario_api.DatabaseAccess
{
    public class ProductDatabaseAccess : IProductDatabaseAccess
    {
        private readonly BazarioDbContext _context;

        public ProductDatabaseAccess(BazarioDbContext context)
        {
            _context = context;
        }
        public async Task<List<Product>> GetProductsBySubcategoryIdAsync(int subcategoryId)
        {
            return await _context.Products
                .Where(p => p.SubcategoryId == subcategoryId)
                .ToListAsync();
        }
        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
        }
        public async Task<List<Product>> GetAllProductsAsync()
        {
            return await _context.Products
                         .OrderBy(p => p.Id)   // ✅ order by Id ascending
                         .ToListAsync();
        }
        public async Task<List<Product>> SearchProductsAsync(string keyword, int page, int pageSize)
        {
            keyword = keyword.ToLower();

            // Basic synonyms (can later move to config/db)
            var synonyms = new Dictionary<string, string[]>
            {
                { "tee", new[] { "t-shirt", "tshirt" } },
                { "jeans", new[] { "denim", "pant" } }
            };

            var synonymKeywords = new List<string> { keyword };
            if (synonyms.ContainsKey(keyword))
                synonymKeywords.AddRange(synonyms[keyword]);

            var query = _context.Products
                .Where(p =>
                synonymKeywords.Any(sk =>
                (p.Name != null && p.Name.ToLower().Contains(sk)) ||
                (p.Description != null && p.Description.ToLower().Contains(sk))
                )
                )
                .Select(p => new
                {
                    Product = p,
                    Score =
                    (p.Name != null && p.Name.ToLower() == keyword ? 100 : 0) +
                    (p.Name != null && p.Name.ToLower().Contains(keyword) ? 50 : 0) +
                    (p.Description != null && p.Description.ToLower().Contains(keyword) ? 30 : 0) +
                    (int)((p.Rating ?? 0) * 10) // safely handle null ratings
                    })
                .OrderByDescending(x => x.Score)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => x.Product);
            return await query.ToListAsync();
        }
    }
}
