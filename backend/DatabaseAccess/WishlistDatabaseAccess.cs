using bazario_api.Models;
using bazario_api.Data;
using Microsoft.EntityFrameworkCore;

namespace bazario_api.DatabaseAccess
{
    public class WishlistDatabaseAccess : IWishlistDatabaseAccess
    {
        private readonly BazarioDbContext _context;

        public WishlistDatabaseAccess(BazarioDbContext context)
        {
            _context = context;
        }

        public async Task<List<Wishlist>> GetWishlistAsync(int userId)
        {
            return await _context.Wishlists
                .Where(w => w.UserId == userId)
                .Include(w => w.Product) // ✅ optional: load product details
                .ToListAsync();
        }

        public async Task<Wishlist> AddWishlistAsync(Wishlist wishlist)
        {
            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync();
            return wishlist;
        }

        public async Task<bool> DeleteWishlistAsync(int userId, int productId)
        {
            var entity = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);

            if (entity == null) return false;

            _context.Wishlists.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task ClearWishlistAsync(int userId)
        {
            var items = await _context.Wishlists
                .Where(w => w.UserId == userId)
                .ToListAsync();

            _context.Wishlists.RemoveRange(items);
            await _context.SaveChangesAsync();
        }
        public async Task<bool> IsInWishlistAsync(int userId, int productId)
        {
            return await _context.Wishlists
                .AnyAsync(w => w.UserId == userId && w.ProductId == productId);
        }
    }
}
