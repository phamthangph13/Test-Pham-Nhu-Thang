using System.Text;
using System.Text.Json;
using ProductManagementMVC.Models;

namespace ProductManagementMVC.Services
{
    public class ProductService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiBaseUrl;
        private readonly ILogger<ProductService> _logger;

        public ProductService(IConfiguration configuration, HttpClient httpClient, ILogger<ProductService> logger)
        {
            _httpClient = httpClient;
            _apiBaseUrl = configuration["ApiSettings:BaseUrl"] ?? "http://localhost:5000/api/products";
            _logger = logger;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync(_apiBaseUrl);
                response.EnsureSuccessStatusCode();
                
                var content = await response.Content.ReadAsStringAsync();
                var products = JsonSerializer.Deserialize<IEnumerable<Product>>(content, 
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                
                return products ?? new List<Product>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching products from API");
                // Return empty list instead of throwing
                return new List<Product>();
            }
        }

        public async Task<Product?> GetProductAsync(string id)
        {
            var response = await _httpClient.GetAsync($"{_apiBaseUrl}/{id}");
            
            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                return null;
                
            response.EnsureSuccessStatusCode();
            
            var content = await response.Content.ReadAsStringAsync();
            var product = JsonSerializer.Deserialize<Product>(content, 
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            
            return product;
        }

        public async Task<IEnumerable<Product>> SearchProductsByIdsAsync(string id1, string id2)
        {
            var response = await _httpClient.GetAsync($"{_apiBaseUrl}/search/{id1}/{id2}");
            
            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                return new List<Product>();
                
            response.EnsureSuccessStatusCode();
            
            var content = await response.Content.ReadAsStringAsync();
            var products = JsonSerializer.Deserialize<IEnumerable<Product>>(content, 
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            
            return products ?? new List<Product>();
        }

        public async Task<Product?> CreateProductAsync(Product product)
        {
            var content = new StringContent(
                JsonSerializer.Serialize(product), 
                Encoding.UTF8, 
                "application/json");
                
            var response = await _httpClient.PostAsync(_apiBaseUrl, content);
            response.EnsureSuccessStatusCode();
            
            var responseContent = await response.Content.ReadAsStringAsync();
            var createdProduct = JsonSerializer.Deserialize<Product>(responseContent, 
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            
            return createdProduct;
        }

        public async Task<bool> UpdateProductAsync(string id, Product product)
        {
            var content = new StringContent(
                JsonSerializer.Serialize(product), 
                Encoding.UTF8, 
                "application/json");
                
            var response = await _httpClient.PutAsync($"{_apiBaseUrl}/{id}", content);
            
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> DeleteProductAsync(string id)
        {
            var response = await _httpClient.DeleteAsync($"{_apiBaseUrl}/{id}");
            
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> UpdateProductNotesAsync(string id, string notes)
        {
            var content = new StringContent(
                JsonSerializer.Serialize(notes), 
                Encoding.UTF8, 
                "application/json");
                
            var response = await _httpClient.PutAsync($"{_apiBaseUrl}/UpdateNotes/{id}", content);
            
            return response.IsSuccessStatusCode;
        }
    }
}