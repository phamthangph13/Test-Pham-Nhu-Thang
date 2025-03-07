using Microsoft.EntityFrameworkCore;
using ProductManagementAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ProductDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlServerOptionsAction => sqlServerOptionsAction.EnableRetryOnFailure()));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Product Management API",
        Version = "v1",
        Description = "API for managing products (hang_hoa)"
    });
});

// Add CORS support
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", 
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Product Management API v1");
        // Set Swagger UI at /swagger path instead of root
        c.RoutePrefix = "swagger";
    });
}

// Enable CORS
// Later in the pipeline
app.UseCors("AllowAll");

app.UseHttpsRedirection();
app.UseStaticFiles(); // Enable serving static files from wwwroot

app.UseAuthorization();

app.MapControllers();

// Serve index.html for the root path
app.MapFallbackToFile("index.html");

// Print the URLs to the console
Console.WriteLine("\n=======================================================");
Console.WriteLine("Application is running at:");
Console.WriteLine("Frontend UI: https://localhost:7126 and http://localhost:5000");
Console.WriteLine("Swagger UI: https://localhost:7126/swagger and http://localhost:5000/swagger");
Console.WriteLine("=======================================================\n");

app.Run();
