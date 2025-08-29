using System;
using System.Collections.Generic;

namespace bazario_api.Models;

public partial class Product
{
    public Product()
    {
        Cartitems = new HashSet<Cartitem>();
        Wishlists = new HashSet<Wishlist>();
    }
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public decimal? Rating { get; set; }

    public string? ImageUrl { get; set; }

    public int SubcategoryId { get; set; }

    public virtual Subcategory Subcategory { get; set; } = null!;
    public virtual ICollection<Cartitem> Cartitems { get; set; }
    public virtual ICollection<Wishlist> Wishlists { get; set; }
}
