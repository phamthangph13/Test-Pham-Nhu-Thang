using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProductManagementAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "hang_hoa",
                columns: table => new
                {
                    ma_hanghoa = table.Column<string>(type: "character varying(9)", maxLength: 9, nullable: false),
                    ten_hanghoa = table.Column<string>(type: "text", nullable: false),
                    so_luong = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_hang_hoa", x => x.ma_hanghoa);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "hang_hoa");
        }
    }
}
