namespace bazario_api.Contracts.Products
{
    public class ProdcutsResponse
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        public decimal Price { get; set; }

        public decimal? Rating { get; set; }

        public string? ImageUrl { get; set; }

        public int SubcategoryId { get; set; }
    }
}
