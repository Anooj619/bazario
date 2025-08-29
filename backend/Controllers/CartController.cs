using bazario_api.Contracts.Cart;
using bazario_api.Services;
using Microsoft.AspNetCore.Mvc;

namespace bazario_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        // GET /api/cart?userId=1
        [HttpGet("GetCartItems")]
        public async Task<IActionResult> GetCartItems([FromQuery] int userId)
        {
            var items = await _cartService.GetCartItems(userId);
            return Ok(items);
        }

        // POST /api/cart
        [HttpPost("AddToCart")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest cartItem)
        {
            var result = await _cartService.AddOrUpdateCartItem(cartItem);
            return Ok(result);
        }

        // PUT /api/cart/5
        [HttpPut("UpdateQuantity/{cartItemId}")]
        public async Task<IActionResult> UpdateQuantity(int cartItemId, [FromBody] int quantity)
        {
            if (cartItemId <= 0 || quantity <= 0)
            {
                return BadRequest("Invalid Cart Item ID or quantity.");
            }
                var success = await _cartService.UpdateQuantity(cartItemId, quantity);
            if (!success) return NotFound();
            return Ok();
        }

        // DELETE /api/cart/5
        [HttpDelete("RemoveItem/{id}")]
        public async Task<IActionResult> RemoveItem(int id)
        {
            var success = await _cartService.RemoveCartItem(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
