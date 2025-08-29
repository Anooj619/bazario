using bazario_api.Contracts.User;
using bazario_api.DatabaseAccess;
using bazario_api.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace bazario_api.Services
{
    public class AuthService
    {
        private readonly UserDatabaseAccess _userDb;
        private readonly IConfiguration _configuration;

        public AuthService(UserDatabaseAccess userDb, IConfiguration configuration)
        {
            _userDb = userDb;
            _configuration = configuration;
        }

        public async Task<(string AccessToken, string RefreshToken)?> LoginAsync(LoginRequestDTO loginRequest)
        {
            var user = await _userDb.GetUserByEmailAsync(loginRequest.Email);
            if (user == null) return null;

            if (!VerifyPassword(loginRequest.Password, user.Passwordhash))
                return null;

            var accessToken = GenerateJwtToken(user, 15);
            var refreshToken = GenerateRefreshToken();

            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                UserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow,
                Revoked = false
            };

            await _userDb.AddRefreshTokenAsync(refreshTokenEntity);

            return (accessToken, refreshToken);
        }

        public static string HashPassword(string password)
        {
            byte[] salt = RandomNumberGenerator.GetBytes(128 / 8);

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            return $"{Convert.ToBase64String(salt)}.{hashed}";
        }

        private static bool VerifyPassword(string password, string storedHash)
        {
            var parts = storedHash.Split('.');
            if (parts.Length != 2) return false;

            var salt = Convert.FromBase64String(parts[0]);
            var hash = parts[1];

            string hashedInput = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            return hash == hashedInput;
        }

        private string GenerateJwtToken(User user, int minutesValid)
        {
            var keyString = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key missing");
            var issuer = _configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("JWT Issuer missing");
            var audience = _configuration["Jwt:Audience"] ?? throw new InvalidOperationException("JWT Audience missing");

            var keyBytes = Encoding.UTF8.GetBytes(keyString);
            if (keyBytes.Length < 32) throw new InvalidOperationException("JWT key must be >= 256 bits");

            var signingKey = new SymmetricSecurityKey(keyBytes);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(minutesValid),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = creds
            };

            return new JwtSecurityTokenHandler().WriteToken(
                new JwtSecurityTokenHandler().CreateToken(tokenDescriptor));
        }

        private string GenerateRefreshToken()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        }

        public async Task<string?> GenerateNewAccessTokenAsync(string refreshToken)
        {
            var tokenEntity = await _userDb.GetRefreshTokenAsync(refreshToken);
            if (tokenEntity == null || tokenEntity.Revoked || tokenEntity.ExpiresAt < DateTime.UtcNow)
                return null;

            var user = await _userDb.GetUserByIdAsync(tokenEntity.UserId);
            if (user == null) return null;

            return GenerateJwtToken(user, 15);
        }

        public async Task RevokeRefreshTokenAsync(string refreshToken)
        {
            var tokenEntity = await _userDb.GetRefreshTokenAsync(refreshToken);
            if (tokenEntity != null)
            {
                tokenEntity.Revoked = true;
                await _userDb.UpdateRefreshTokenAsync(tokenEntity);
            }
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _userDb.GetUserByEmailAsync(email);
        }
        public async Task<(bool Success, string Message)> RegisterAsync(RegisterRequestDTO request)
        {
            var existingUser = await _userDb.GetUserByEmailAsync(request.Email);
            if (existingUser != null)
                return (false, "Email already exists");

            var hashedPassword = HashPassword(request.Password);

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                Passwordhash = hashedPassword
            };

            await _userDb.AddUserAsync(user);

            return (true, "User created");
        }
        public async Task<(bool Success, string Message)> ChangePasswordAsync(int userId, ChangePasswordRequest request)
        {
            var user = await _userDb.GetUserByIdAsync(userId);
            if (user == null) return (false, "User not found");

            if (!VerifyPassword(request.OldPassword, user.Passwordhash))
                return (false, "Old password is incorrect");

            user.Passwordhash = HashPassword(request.NewPassword);
            await _userDb.UpdateUserAsync(user);

            return (true, "Password updated");
        }
        public async Task<(bool Success, string Message)> ChangeEmailAsync(int userId, ChangeEmailRequest request)
        {
            var user = await _userDb.GetUserByIdAsync(userId);
            if (user == null) return (false, "User not found");

            if (!VerifyPassword(request.Password, user.Passwordhash))
                return (false, "Invalid password");

            var existingUser = await _userDb.GetUserByEmailAsync(request.NewEmail);
            if (existingUser != null)
                return (false, "Email already in use");

            user.Email = request.NewEmail;
            await _userDb.UpdateUserAsync(user);

            return (true, "Email updated");
        }
    }
}
