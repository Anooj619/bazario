using bazario_api.Contracts.Wishlist;
using bazario_api.Services;
using Microsoft.AspNetCore.Mvc;

namespace bazario_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WishlistController : ControllerBase
    {
        private readonly IWishlistService _wishlistService;

        public WishlistController(IWishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }

        // ✅ Get all wishlist items for a user
        [HttpGet("GetWishlist")]
        public async Task<IActionResult> GetWishlist([FromQuery] int userId)
        {
            var items = await _wishlistService.GetWishlistAsync(userId);
            return Ok(items);
        }

        // ✅ Add item to wishlist
        [HttpPost("AddtoWishlist")]
        public async Task<IActionResult> AddWishlist([FromBody] WishlistItemRequest request)
        {
            var result = await _wishlistService.AddWishlistAsync(request);
            return Ok(result);
        }

        // ✅ Delete one item from wishlist
        [HttpDelete("Delete/{productId}")]
        public async Task<IActionResult> DeleteWishlist(int productId, [FromQuery] int userId)
        {
            var success = await _wishlistService.DeleteWishlistAsync(userId, productId);
            //if (!success) return NotFound();

            return NoContent(); // 204
        }

        // ✅ Clear all wishlist items for a user
        [HttpDelete("Clear/{userId}")]
        public async Task<IActionResult> ClearWishlist(int userId)
        {
            await _wishlistService.ClearWishlistAsync(userId);
            return NoContent(); // 204
        }
        // ✅ Check if a product is in wishlist
        [HttpGet("IsInWishlist")]
        public async Task<IActionResult> IsInWishlist([FromQuery] int userId, [FromQuery] int productId)
        {
            var isInWishlist = await _wishlistService.IsInWishlistAsync(userId, productId);
            return Ok(new WishlistCheckResponse { IsInWishlist = isInWishlist });
        }
    }
}
