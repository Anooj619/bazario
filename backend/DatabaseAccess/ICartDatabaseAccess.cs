using bazario_api.Models;
using System.Threading.Tasks;

namespace bazario_api.DatabaseAccess
{
    public interface ICartDatabaseAccess
    {
        Task<List<Cartitem>> GetCartItems(int userId);
        Task<Cartitem?> GetCartItem(int cartItemId);
        Task<Cartitem?> GetExistingItem(int userId, int productId);
        Task AddCartItem(Cartitem item);
        Task UpdateCartItem(Cartitem item);
        Task DeleteCartItem(Cartitem item);
        Task<List<(Cartitem Cart, Product Product)>> GetCartItemsWithProducts(int userId);
    }
}
