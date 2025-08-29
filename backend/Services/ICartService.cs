using bazario_api.Contracts.Cart;

namespace bazario_api.Services
{
    public interface ICartService
    {
        Task<List<CartItemResponse>> GetCartItems(int userId);
        Task<CartItemResponse?> AddOrUpdateCartItem(AddToCartRequest item);
        Task<bool> UpdateQuantity(int cartItemId, int quantity);
        Task<bool> RemoveCartItem(int cartItemId);
    }
}
