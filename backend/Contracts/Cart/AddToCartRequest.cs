namespace bazario_api.Contracts.Cart
{
    public class AddToCartRequest
    {
        public int Userid { get; set; }
        public int Productid { get; set; }
        public int Quantity { get; set; }
    }
}
