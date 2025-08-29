﻿namespace bazario_api.Contracts.User
{
    public class LoginRequestDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public LoginRequestDTO(string email, string password)
        {
            Email = email;
            Password = password;
        }
    }
}
