using bazario_api.Models;

namespace bazario_api.DatabaseAccess
{
    public interface IWishlistDatabaseAccess
    {
        Task<List<Wishlist>> GetWishlistAsync(int userId);
        Task<Wishlist> AddWishlistAsync(Wishlist wishlist);
        Task<bool> DeleteWishlistAsync(int userId, int productId);
        Task ClearWishlistAsync(int userId);
        Task<bool> IsInWishlistAsync(int userId, int productId);
    }
}
