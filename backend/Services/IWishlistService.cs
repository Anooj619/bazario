using bazario_api.Contracts.Wishlist;

namespace bazario_api.Services
{
    public interface IWishlistService
    {
        Task<List<WishlistItemResponse>> GetWishlistAsync(int userId);
        Task<WishlistItemResponse> AddWishlistAsync(WishlistItemRequest request);
        Task<bool> DeleteWishlistAsync(int userId, int productId);
        Task ClearWishlistAsync(int userId);
        Task<bool> IsInWishlistAsync(int userId, int productId);

    }
}
