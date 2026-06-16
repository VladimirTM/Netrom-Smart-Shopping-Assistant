using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.DataAccess;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;
using SmartShoppingAssistantLigaAc.DataAccess.Repositories;
using SmartShoppingAssistantLigaAc.DataAccess.Seeders;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Microsoft.Extensions.AI;
using OpenAI;
using SmartShoppingAssistantLigaAc.BusinessLogic.Agents;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddOpenApi();

var connectionString = builder.Configuration.GetConnectionString("SmartShoppingAssistantContext");

builder.Services.AddDbContext<SmartShoppingAssistantDbContext>(options =>
    options.UseNpgsql(connectionString));

// Auth
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Products / Categories / Promotions
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();

builder.Services.AddScoped<IRepository<Category>, BaseRepository<Category>>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

builder.Services.AddScoped<IPromotionRepository, PromotionRepository>();
builder.Services.AddScoped<IRepository<Promotion>, PromotionRepository>();
builder.Services.AddScoped<IPromotionService, PromotionService>();

// Cart
builder.Services.AddScoped<ICartItemRepository, CartItemRepository>();
builder.Services.AddScoped<ICartItemService, CartItemService>();

// Wishlist — IProductRepository already registered above
builder.Services.AddScoped<IWishlistRepository, WishlistRepository>();
builder.Services.AddScoped<IWishlistService, WishlistService>();

// Banners
builder.Services.AddScoped<IBannerRepository, BannerRepository>();
builder.Services.AddScoped<IRepository<Banner>, BannerRepository>();
builder.Services.AddScoped<IBannerService, BannerService>();

// Analytics
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();

// Activity Log
builder.Services.AddScoped<IActivityLogRepository, ActivityLogRepository>();
builder.Services.AddScoped<IActivityLogService, ActivityLogService>();

// Orders — depends on ICartItemService and IProductRepository (both already registered above)
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderService, OrderService>();

// AI Search
builder.Services.AddScoped<IAiSearchService, AiSearchService>();

// Seeders
builder.Services.AddScoped<CategorySeeder>();
builder.Services.AddScoped<ProductSeeder>();
builder.Services.AddScoped<PromotionSeeder>();
builder.Services.AddScoped<BannerSeeder>();
builder.Services.AddScoped<UserSeeder>();
builder.Services.AddScoped<DatabaseSeeder>();

// OpenAI / Agents
var openAiApiKey = builder.Configuration["OpenAI:ApiKey"]
                   ?? throw new InvalidOperationException("OpenAI:ApiKey is not configured.");
var openAiModel = builder.Configuration["OpenAI:ModelId"] ?? "gpt-4o-mini";

builder.Services.AddSingleton<IChatClient>(
    new OpenAIClient(openAiApiKey)
        .GetChatClient(openAiModel)
        .AsIChatClient()
        .AsBuilder()
        .UseFunctionInvocation()
        .Build());

builder.Services.AddScoped<IPromotionCheckerAgent, PromotionCheckerAgent>();
builder.Services.AddScoped<ISuggestionComposerAgent, SuggestionComposerAgent>();

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"]
             ?? throw new InvalidOperationException("Jwt:Key is not configured.");

if (jwtKey.Length < 32)
    throw new InvalidOperationException("Jwt:Key must be at least 32 characters (256 bits) for HMAC-SHA256.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:5173"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy",
        corsPolicyBuilder =>
        {
            if (builder.Environment.IsDevelopment())
            {
                Console.WriteLine("WARNING: Running with open CORS policy (Development mode). Do not deploy without restricting origins.");
                corsPolicyBuilder.WithOrigins("http://localhost:5173", "http://localhost:5174", "https://localhost:5173")
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            }
            else
            {
                corsPolicyBuilder
                    .WithOrigins(allowedOrigins)
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            }
        });
});

builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("auth", limiterOptions =>
    {
        limiterOptions.PermitLimit = 10;
        limiterOptions.Window = TimeSpan.FromMinutes(1);
        limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiterOptions.QueueLimit = 0;
    });
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
        options.SwaggerEndpoint("/openapi/v1.json", "SmartShoppingAssistant API v1"));
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<SmartShoppingAssistantDbContext>();
    await db.Database.MigrateAsync();

    var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
    await seeder.SeedAsync();
}

app.UseCors("FrontendPolicy");

app.Use(async (ctx, next) =>
{
    ctx.Response.Headers["X-Content-Type-Options"] = "nosniff";
    ctx.Response.Headers["X-Frame-Options"] = "DENY";
    ctx.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    if (!app.Environment.IsDevelopment())
    {
        ctx.Response.Headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
        ctx.Response.Headers["Content-Security-Policy"] = "default-src 'self'";
    }
    await next();
});

app.UseHttpsRedirection();

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
