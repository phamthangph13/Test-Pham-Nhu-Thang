using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProductManagementAPI.Models
{
    [Table("hang_hoa")]
    public class Product
    {
        [Key]
        [Column("ma_hanghoa")]
        [StringLength(9)]
        public required string ProductId { get; set; }

        [Column("ten_hanghoa")]
        [Required]
        public required string ProductName { get; set; }

        [Column("so_luong")]
        public int Quantity { get; set; }
        
        [Column("ghi_chu")]
        public string? Notes { get; set; }
    }
}