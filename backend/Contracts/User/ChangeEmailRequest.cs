namespace bazario_api.Contracts.User
{
    public class ChangeEmailRequest
    {
        public string NewEmail { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
