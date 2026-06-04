using Microsoft.EntityFrameworkCore;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services;
using SmartShoppingAssistantLigaAc.BusinessLogic.Services.Interfaces;
using SmartShoppingAssistantLigaAc.DataAccess;
using SmartShoppingAssistantLigaAc.DataAccess.Entities;
using SmartShoppingAssistantLigaAc.DataAccess.Repositories;
using SmartShoppingAssistantLigaAc.DataAccess.Seeders;
using System.Text.Json.Serialization;
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

builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();

builder.Services.AddScoped<IRepository<Category>, BaseRepository<Category>>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

builder.Services.AddScoped<IPromotionRepository, PromotionRepository>();
builder.Services.AddScoped<IRepository<Promotion>, PromotionRepository>();
builder.Services.AddScoped<IPromotionService, PromotionService>();

builder.Services.AddScoped<ICartItemRepository, CartItemRepository>();
builder.Services.AddScoped<ICartItemService, CartItemService>();

builder.Services.AddScoped<CategorySeeder>();
builder.Services.AddScoped<ProductSeeder>();
builder.Services.AddScoped<PromotionSeeder>();
builder.Services.AddScoped<DatabaseSeeder>();

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

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAnyOrigin",
        corsPolicyBuilder =>
        {
            corsPolicyBuilder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
        options.SwaggerEndpoint("/openapi/v1.json", "SmartShoppingAssistant API v1"));
}

using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
    await seeder.SeedAsync();
}

app.UseCors("AllowAnyOrigin");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
