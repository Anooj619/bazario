using bazario_api.Contracts.Wishlist;
using bazario_api.DatabaseAccess;
using bazario_api.Models;

namespace bazario_api.Services
{
    public class WishlistService : IWishlistService
    {
        private readonly IWishlistDatabaseAccess _wishlistDal;

        public WishlistService(IWishlistDatabaseAccess wishlistDal)
        {
            _wishlistDal = wishlistDal;
        }

        public async Task<List<WishlistItemResponse>> GetWishlistAsync(int userId)
        {
            var entities = await _wishlistDal.GetWishlistAsync(userId);

            return entities.Select(w => new WishlistItemResponse
            {
                Id = w.Id,
                UserId = w.UserId,
                ProductId = w.ProductId,
                CreatedAt = w.CreatedAt
            }).ToList();
        }

        public async Task<WishlistItemResponse> AddWishlistAsync(WishlistItemRequest request)
        {
            var entity = new Wishlist
            {
                UserId = request.UserId,
                ProductId = request.ProductId                
            };

            var saved = await _wishlistDal.AddWishlistAsync(entity);

            return new WishlistItemResponse
            {
                Id = saved.Id,
                UserId = saved.UserId,
                ProductId = saved.ProductId,
                CreatedAt = saved.CreatedAt
            };
        }

        public async Task<bool> DeleteWishlistAsync(int userId, int productId)
        {
            return await _wishlistDal.DeleteWishlistAsync(userId, productId);
        }

        public async Task ClearWishlistAsync(int userId)
        {
            await _wishlistDal.ClearWishlistAsync(userId);
        }
        public async Task<bool> IsInWishlistAsync(int userId, int productId)
        {
            return await _wishlistDal.IsInWishlistAsync(userId, productId);
        }
    }
}
