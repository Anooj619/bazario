using Microsoft.AspNetCore.Mvc;
using bazario_api.Services;
using bazario_api.Contracts.Category;

namespace bazario_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubcategoryController : ControllerBase
    {
        private readonly ISubcategoryService _subCategoryService;
        public SubcategoryController(ISubcategoryService subCategoryService)
        {
            _subCategoryService = subCategoryService;
        }
        [HttpGet("GetSubcategoriesByCategoryId")]
        public async Task<ActionResult<IEnumerable<SubcategoryResponse>>> GetSubcategoriesByCategoryId([FromQuery] int categoryId)
        {
            var subcategories = await _subCategoryService.GetSubcategoriesByCategoryIdAsync(categoryId);
            return Ok(subcategories);
        }
    }
}
