namespace bazario_api.Models;

public partial class Cartitem
{
    public int Id { get; set; }

    public int Userid { get; set; }

    public int Productid { get; set; }

    public int Quantity { get; set; }

    public DateTime? Createdat { get; set; }

    public virtual Product? Product { get; set; }

    public virtual User? User { get; set; }
}
