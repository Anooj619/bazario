namespace bazario_api.Models;

public partial class User
{
    public User()
    {
        Cartitems = new HashSet<Cartitem>();
        Wishlists = new HashSet<Wishlist>(); 
    }
    public int Id { get; set; }

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Passwordhash { get; set; } = null!;

    public virtual ICollection<Cartitem> Cartitems { get; set; }
    public virtual ICollection<Wishlist> Wishlists { get; set; } // ✅ Add this
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new HashSet<RefreshToken>();
}
