namespace bazario_api.Contracts.User
{
    public class LoginResponse
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public LoginResponse(int userId, string email, string token, string userName)
        {
            UserId = userId;
            Username = userName;
            Email = email;
            Token = token;
        }
    }
}
