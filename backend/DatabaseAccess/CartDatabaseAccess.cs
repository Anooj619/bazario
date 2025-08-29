using bazario_api.Data;
using bazario_api.Models;
using Microsoft.EntityFrameworkCore;

namespace bazario_api.DatabaseAccess
{
    public class CartDatabaseAccess: ICartDatabaseAccess
    {
        private readonly BazarioDbContext _context;

        public CartDatabaseAccess(BazarioDbContext context)
        {
            _context = context;
        }

        public async Task<List<Cartitem>> GetCartItems(int userId)
        {
            return await _context.Cartitems
                .Include(c => c.Product)
                .Where(c => c.Userid == userId)
                .ToListAsync();
        }

        public async Task<Cartitem?> GetCartItem(int cartItemId)
        {
            return await _context.Cartitems.FindAsync(cartItemId);
        }

        public async Task<Cartitem?> GetExistingItem(int userId, int productId)
        {
            return await _context.Cartitems.FirstOrDefaultAsync(
                c => c.Userid == userId && c.Productid == productId);
        }

        public async Task AddCartItem(Cartitem item)
        {
            await _context.Cartitems.AddAsync(item);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCartItem(Cartitem item)
        {
            _context.Cartitems.Update(item);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCartItem(Cartitem item)
        {
            _context.Cartitems.Remove(item);
            await _context.SaveChangesAsync();
        }
        public async Task<List<(Cartitem Cart, Product Product)>> GetCartItemsWithProducts(int userId)
        {
            var result = await _context.Cartitems
                .Where(c => c.Userid == userId)
                .Join(
                    _context.Products,
                    c => c.Productid,
                    p => p.Id,
                    (c, p) => new { Cart = c, Product = p }
                )
                .ToListAsync();

            return result.Select(x => (x.Cart, x.Product)).ToList();
        }
    }
}
