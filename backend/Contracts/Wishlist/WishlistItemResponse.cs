namespace bazario_api.Contracts.Wishlist
{
    public class WishlistItemResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public DateTime? CreatedAt { get; set; }

    }
}
