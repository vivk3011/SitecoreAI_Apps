# Product CRUD Application

A Next.js 16 app for managing products with full Create, Read, Update, and Delete (CRUD) functionality. This app can be accessed in SitecoreAI apps section after registering in Sitecore App Studio and installing in SitecoreAI.

The application includes:
- A client-side product management UI.
- REST-style API routes under `/api/products`.
- File-based persistence in `products.json`.
- Frontend and backend validation for product payloads.

## Features
- List all products.
- Sort products alphabetically by name in the UI.
- Add a new product.
- Edit an existing product.
- Delete a product with a confirmation dialog.
- Show loading states during fetch/mutation.
- Show success and error messages for operations.

## Tech Stack
- Next.js `16.2.9` (App Router)
- React `19.2.4`
- TypeScript
- Tailwind CSS v4
- Node.js runtime for API routes

## Local Development

### Prerequisites
- Node.js 20+
- npm

### Install
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
### Open Browser
Open `http://localhost:3000`

### Access in SitecoreAI portal
- Open SitecoreAI portal dashboard. 
- Click on apps icon button.
- Select Product Management app.

## Product Data Model
Each product uses this schema:

```ts
interface Product {
	id: string;
	name: string;
	sku: string;
	imageUrl: string;
	price: number;
	description: string;
	category: string;
}
```

## Validation Rules

The following rules are enforced on both frontend form submission and backend API payload validation:
- `id` is required.
- `name` is required.
- `sku` is required.
- `imageUrl` is required and must be a valid URL.
- `description` is required.
- `category` is required.
- `price` must be a positive number.

Additional backend checks:
- `POST /api/products` rejects duplicate `id` values with `409`.
- `PUT /api/products/:id` requires payload `id` to match URL `id`.

## API Endpoints
Base route: `/api/products`

### GET /api/products
- Returns all products.
- Response: `200` with `Product[]`.

### POST /api/products
- Creates a new product.
- Request body: full `Product` object.
- Success response: `201` with created `Product`.
- Error responses:
	- `400` validation failed
	- `409` duplicate id
	- `500` server/file error

### GET /api/products/:id
- Returns one product by id.
- Success response: `200` with `Product`.
- Error responses:
	- `404` product not found
	- `500` server/file error

### PUT /api/products/:id
- Replaces an existing product by id.
- Request body: full `Product` object.
- Success response: `200` with updated `Product`.
- Error responses:
	- `400` validation failed
	- `400` URL/payload id mismatch
	- `404` product not found
	- `500` server/file error

### DELETE /api/products/:id
- Deletes a product by id.
- Success response: `200` with a confirmation message and deleted product.
- Error responses:
	- `404` product not found
	- `500` server/file error

## Data Storage
- Products are stored in `products.json` at the project root.
- API handlers read/write this file using Node `fs.promises`.
- Data is not persisted in a database.

## UI Behavior Notes
- Products are loaded on page load from `GET /api/products`.
- Product cards are displayed in a responsive grid.
- Add and Edit use the same form component.
- In Edit mode, product `id` is read-only.
- Delete action opens a confirmation dialog before API deletion.
- Buttons are disabled during active mutations to prevent duplicate requests.

## Project Scripts
- `npm run dev`: Start development server.
- `npm run build`: Create production build.
- `npm run start`: Start production server.
- `npm run lint`: Run ESLint.