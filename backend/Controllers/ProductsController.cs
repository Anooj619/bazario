using Microsoft.AspNetCore.Mvc;
using bazario_api.Services;
using bazario_api.Contracts.Products;

namespace bazario_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }
        [HttpGet("GetProductsBySubcategoryId")]
        public async Task<ActionResult<IEnumerable<ProdcutsResponse>>> GetProductsBySubcategoryId([FromQuery] int subcategoryId)
        {
            var products = await _productService.GetProductsBySubcategoryIdAsync(subcategoryId);
            return Ok(products);
        }
        [HttpGet("GetProductById/{id}")]
        public async Task<ActionResult<ProdcutsResponse>> GetProductById(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound(); // 404 if product doesn't exist
            }

            return Ok(product);
        }
        [HttpGet("GetProducts")]
        public async Task<ActionResult<IEnumerable<ProdcutsResponse>>> GetAllProducts()
        {
            try
            {
                var products = await _productService.GetAllProductsAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while fetching products.");
            }
        }
        [HttpGet("SearchProducts")]
        public async Task<ActionResult<IEnumerable<ProdcutsResponse>>> SearchProducts(
            [FromQuery] string keyword,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return BadRequest("Keyword is required");

            var products = await _productService.SearchProductsAsync(keyword, page, pageSize);
            return Ok(products);
        }
    }
}
