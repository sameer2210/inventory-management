### inventory management


You are required to develop a simple web application that uses a Node.js backend and a MySQL database. The goal is to create a form in the frontend where users can enter item details and then view those entries in a tabular format. Each input field should be validated in the backend, and database interactions should include a JOIN operation. Additionally, you must apply basic CSS styling to enhance the user interface.

Task Requirements:

1. Frontend:

Create a form with the following fields:
Item Name: Text input (required)
Item Type: Dropdown with options like "Electronics," "Furniture," "Clothing," etc. (required)
Purchase Date: Date input (required)
Stock Available: Checkbox to indicate whether the item is in stock
Include a Submit button to send data to the backend.
Note: In One Purchase we should able to add many Items
Display the submitted data in a table showing all fields and there you should be able Update Or Delete

Apply some CSS styling to the form and table to enhance readability and user experience.

2. Backend (Node.js & Express):

Set up an API endpoint to handle form submissions and store data in a MySQL database.

Implement backend validation to ensure all required fields are provided.

On form submission, store the data in a MySQL database, utilizing a JOIN operation for the Item Type field.

Create two tables: items (to store item information) and item_types (to store item type categories).

Use a JOIN operation to retrieve data from both tables when displaying the items.

3. Database (MySQL):

Create two tables:

item_types: Contains item type categories, with columns id (primary key) and type_name.

items: Stores item data, with columns id, name, purchase_date, stock_available, and item_type_id (foreign key referencing item_types.id).
When retrieving data for display, use a JOIN operation to fetch item details along with their corresponding item types and The Availability of Stocks and a detail table that should be displayed

4. Validation and Error Handling:

Validate all required fields in the backend, ensuring that missing or invalid data does not proceed to database insertion.

Handle errors gracefully, returning appropriate error messages to the frontend.

# Backend (Node.js + Express + MySQL)

## 1) Configure environment

Update `.env` in this folder:

PORT=8000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=products

## 2) Create database/tables

Run `sql/schema.sql` in MySQL:

mysql -u root -p < sql/schema.sql

## 3) Install and start

npm install
npm run dev

## API endpoints

- `GET /health`
- `GET /api/item-types`
- `GET /api/items` (uses JOIN between `items` and `item_types`)
- `POST /api/items` (single item)
- `POST /api/items` with `{ "items": [...] }` (bulk insert: one purchase with many items)
- `PUT /api/items/:id`
- `DELETE /api/items/:id`

## POST body (single item)

{
"name": "Laptop",
"itemType": "Electronics",
"purchaseDate": "2026-05-19",
"stockAvailable": true
}
