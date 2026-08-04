using Application;
using Application.Interfaces;
using BoardGamesTrackerApi.Infrastructure;
using BoardGamesTrackerApi.Middleware;
using Infrastructure;
using Infrastructure.Persistence;
using Domain.Entities;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var isDevelopment = builder.Environment.IsDevelopment();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (isDevelopment)
        options.UseSqlite(builder.Configuration.GetConnectionString("SqliteConnection"));
    else
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddIdentity<User, IdentityRole<Guid>>(options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequiredLength = 6;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireLowercase = false;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<CookieAuthenticationOptions>(IdentityConstants.ApplicationScheme, options =>
{
    options.Events = options.Events ?? new CookieAuthenticationEvents();
    options.Events.OnRedirectToLogin = context =>
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/json; charset=utf-8";
            return context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(new { error = "Не авторизован" }));
        }
        context.Response.Redirect(context.RedirectUri);
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            context.Response.ContentType = "application/json; charset=utf-8";
            return context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(new { error = "Нет доступа" }));
        }
        context.Response.Redirect(context.RedirectUri);
        return Task.CompletedTask;
    };
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.SetIsOriginAllowed(origin =>
                new Uri(origin).Host == "localhost" ||
                new Uri(origin).Host == "127.0.0.1")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

builder.Services.AddApplication();
builder.Services.AddInfrastructure();

builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(e => e.Value.Errors.Count > 0)
                .SelectMany(e => e.Value.Errors.Select(err => err.ErrorMessage))
                .ToList();
            return new Microsoft.AspNetCore.Mvc.BadRequestObjectResult(new { error = string.Join("; ", errors) });
        };
    });

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    if (isDevelopment)
    {
        db.Database.EnsureCreated();
    }
    else
    {
        db.Database.Migrate();
    }
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.Use(async (context, next) =>
{
    var originalBody = context.Response.Body;
    using var buffer = new MemoryStream();
    context.Response.Body = buffer;

    await next();

    context.Response.Body = originalBody;

    var needsRewrite = context.Request.Path.StartsWithSegments("/api") &&
        (context.Response.StatusCode == StatusCodes.Status401Unauthorized ||
         context.Response.StatusCode == StatusCodes.Status403Forbidden) &&
        context.Response.ContentType?.Contains("application/problem+json") == true;

    if (needsRewrite)
    {
        var message = context.Response.StatusCode == StatusCodes.Status401Unauthorized
            ? "Не авторизован"
            : "Нет доступа";
        var payload = System.Text.Encoding.UTF8.GetBytes(
            System.Text.Json.JsonSerializer.Serialize(new { error = message }));
        context.Response.ContentType = "application/json; charset=utf-8";
        context.Response.ContentLength = payload.Length;
        await context.Response.Body.WriteAsync(payload);
    }
    else
    {
        buffer.Position = 0;
        await buffer.CopyToAsync(originalBody);
    }
});

app.MapControllers();

app.Run();
