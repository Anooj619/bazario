    using bazario_api.Contracts.Cart;
    using bazario_api.DatabaseAccess;
    using bazario_api.Models;

    namespace bazario_api.Services
    {
        public class CartService: ICartService
        {
            private readonly ICartDatabaseAccess _cartDatabaseAccess;

            public CartService(ICartDatabaseAccess cartDatabaseAccess)
            {
                _cartDatabaseAccess = cartDatabaseAccess;
            }

        public async Task<List<CartItemResponse>> GetCartItems(int userId)
        {
            var cartItems = await _cartDatabaseAccess.GetCartItemsWithProducts(userId);

            return cartItems.Select(cp => new CartItemResponse
            {
                Id = cp.Cart.Id,
                ProductId = cp.Product.Id,
                ProductName = cp.Product.Name,
                ProductImageUrl = cp.Product.ImageUrl,
                ProductPrice = cp.Product.Price,
                Quantity = cp.Cart.Quantity
            }).ToList();
        }

        public async Task<CartItemResponse?> AddOrUpdateCartItem(AddToCartRequest request)
            {
                var existing = await _cartDatabaseAccess.GetExistingItem(request.Userid, request.Productid);

                if (existing != null)
                {
                    existing.Quantity += request.Quantity;
                    await _cartDatabaseAccess.UpdateCartItem(existing);
                    return new CartItemResponse
                    {
                        Id = existing.Id,
                        ProductId = existing.Productid,                  
                        Quantity = existing.Quantity                    
                    };
                }

                var newItem = new Cartitem
                {
                    Userid = request.Userid,
                    Productid = request.Productid,
                    Quantity = request.Quantity
                };

                await _cartDatabaseAccess.AddCartItem(newItem);

                return new CartItemResponse
                {
                    Id = newItem.Id,
                    ProductId = newItem.Productid,
                    Quantity = newItem.Quantity
                };
            }

            public async Task<bool> UpdateQuantity(int cartItemId, int quantity)
            {
                if (quantity <= 0)
                {
                    throw new ArgumentException("Quantity must be greater than zero.", nameof(quantity));
                }
                var item = await _cartDatabaseAccess.GetCartItem(cartItemId);
                if (item == null) return false;

                item.Quantity = quantity;
                await _cartDatabaseAccess.UpdateCartItem(item);
                return true;
            }

            public async Task<bool> RemoveCartItem(int cartItemId)
            {
                var item = await _cartDatabaseAccess.GetCartItem(cartItemId);
                if (item == null) return false;

                await _cartDatabaseAccess.DeleteCartItem(item);
                return true;
            }
        }
    }
