using System.Security.Claims;
using Entites.DTOs.Auth;
using Entites.DTOs.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

namespace APIWebApp.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    private void SetRefreshTokenCookie(string refreshToken)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true, 
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }

    /// <summary>
    /// Đăng ký tài khoản mới.
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);
            SetRefreshTokenCookie(result.RefreshToken);
            return Ok(ApiResponse<TokenResponse>.SuccessResponse(result, "Đăng ký thành công."));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Đăng nhập (trả về Access Token & Refresh Token).
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = HttpContext.Request.Headers.UserAgent.ToString();

            var result = await _authService.LoginAsync(request, ipAddress, userAgent);
            SetRefreshTokenCookie(result.RefreshToken);
            return Ok(ApiResponse<TokenResponse>.SuccessResponse(result, "Đăng nhập thành công."));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Cấp lại Access Token mới dựa trên Refresh Token.
    /// </summary>
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        try
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized(ApiResponse.ErrorResponse("Không tìm thấy Refresh Token trong cookie."));

            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = HttpContext.Request.Headers.UserAgent.ToString();

            var result = await _authService.RefreshTokenAsync(refreshToken, ipAddress, userAgent);
            SetRefreshTokenCookie(result.RefreshToken);
            return Ok(ApiResponse<TokenResponse>.SuccessResponse(result, "Token đã được làm mới."));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Đăng xuất (vô hiệu hóa Refresh Token hiện tại).
    /// </summary>
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken))
            return BadRequest(ApiResponse.ErrorResponse("Không tìm thấy Refresh Token."));

        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _authService.LogoutAsync(userId, refreshToken);
        Response.Cookies.Delete("refreshToken", new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.None });
        return Ok(ApiResponse.SuccessResponse("Đăng xuất thành công."));
    }
}
