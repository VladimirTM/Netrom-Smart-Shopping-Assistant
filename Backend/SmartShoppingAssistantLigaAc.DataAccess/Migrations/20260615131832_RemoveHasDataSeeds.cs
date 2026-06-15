using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SmartShoppingAssistantLigaAc.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class RemoveHasDataSeeds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.Sql(
                "DELETE FROM \"OrderAppliedPromotions\" WHERE \"PromotionId\" IN (1, 2, 3, 4, 5, 6);");

            migrationBuilder.DeleteData(
                table: "Promotions",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Promotions",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Promotions",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Promotions",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Promotions",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Promotions",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Description", "ImageUrl", "Name", "Price", "StockQuantity" },
                values: new object[,]
                {
                    { 1, null, null, "Banana", 3.99m, 100 },
                    { 2, null, null, "Apple", 5.99m, 100 },
                    { 3, null, null, "Orange", 4.49m, 100 },
                    { 4, null, null, "Carrot", 2.99m, 100 },
                    { 5, null, null, "Tomato", 6.99m, 100 },
                    { 6, null, null, "Spinach", 8.49m, 100 },
                    { 7, null, null, "Milk", 7.99m, 100 },
                    { 8, null, null, "Cheese", 24.99m, 100 },
                    { 9, null, null, "Yogurt", 5.49m, 100 },
                    { 10, null, null, "Orange Juice", 12.99m, 100 },
                    { 11, null, null, "Still Water", 3.49m, 100 },
                    { 12, null, null, "Cola", 8.99m, 100 },
                    { 13, null, null, "Chips", 9.99m, 100 },
                    { 14, null, null, "Chocolate Bar", 14.99m, 100 },
                    { 15, null, null, "Crackers", 7.49m, 100 }
                });

            migrationBuilder.InsertData(
                table: "Promotions",
                columns: new[] { "Id", "CategoryId", "IsActive", "Name", "ProductId", "Reward", "RewardValue", "Threshold", "Type" },
                values: new object[,]
                {
                    { 2, 1, true, "Fruit Basket Discount", null, 1, 10, 5m, 0 },
                    { 3, 3, true, "Dairy Combo Deal", null, 0, 1, 2m, 0 },
                    { 4, null, true, "Big Cart Discount", null, 1, 5, 100m, 1 },
                    { 5, 4, true, "Beverage Bundle", null, 1, 15, 3m, 0 },
                    { 6, 5, true, "Snack Attack", null, 0, 1, 4m, 0 },
                    { 1, null, true, "Banana Bundle Deal", 1, 0, 1, 3m, 0 }
                });
        }
    }
}
