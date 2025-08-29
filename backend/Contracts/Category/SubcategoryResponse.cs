namespace bazario_api.Contracts.Category
{
    public class SubcategoryResponse
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public int CategoryId { get; set; }
    }
}
