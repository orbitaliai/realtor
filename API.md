# Public API

---

## Contacts

### `POST /api/contacts`

Submit an interest lead for a property. No authentication required.

**Request body (JSON):**

| Field | Type | Required | Description |
|---|---|---|---|
| `propertyId` | number | Yes | ID of the property |
| `name` | string | Yes | Full name of the contact |
| `email` | string | Yes | Email address |
| `phone` | string | No | Phone number |

**Example:**
```json
{
  "propertyId": 1,
  "name": "Maria García",
  "email": "maria@example.com",
  "phone": "+34 600 000 000"
}
```

**Responses:**

| Status | Body | Meaning |
|---|---|---|
| `201` | `{ "success": true }` | Lead created |
| `400` | `{ "error": "..." }` | Missing / invalid field |
| `404` | `{ "error": "Property not found" }` | Unknown `propertyId` |

---

# Properties API

Public, no-auth REST API for searching properties.

## Endpoint

```
GET /api/properties
```

## Query Parameters

| Parameter | Type | Description |
|---|---|---|
| `q` | string | Full-text search in title and description |
| `type` | string | Property type: `Apartment`, `Penthouse`, `Loft`, `Studio`, `Townhouse` |
| `neighborhood` | string | Neighborhood name (see list below) |
| `bedrooms` | number | Exact number of bedrooms |
| `bathrooms` | number | Exact number of bathrooms |
| `minPrice` | number | Minimum price in EUR |
| `maxPrice` | number | Maximum price in EUR |
| `minSqm` | number | Minimum area in m² |
| `maxSqm` | number | Maximum area in m² |
| `page` | number | Page number, default `1` |
| `limit` | number | Results per page, default `20`, max `100` |

All parameters are optional and can be combined freely.

### Available Neighborhoods

`Eixample`, `Gràcia`, `El Born`, `Barri Gòtic`, `Poblenou`, `Sarrià-Sant Gervasi`, `Sant Antoni`, `La Barceloneta`, `Les Corts`, `El Raval`, `Poble-sec`, `Horta-Guinardó`

## Response

```json
{
  "data": [
    {
      "id": 1,
      "title": "Bright apartment in Eixample",
      "description": "...",
      "neighborhood": "Eixample",
      "address": "Carrer de Balmes, 42",
      "price": 420000,
      "bedrooms": 2,
      "bathrooms": 1,
      "sqm": 80,
      "type": "Apartment",
      "createdAt": "2026-07-04T10:00:00"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20,
  "pages": 3
}
```

## Examples

All properties (first page):
```
GET /api/properties
```

Penthouses in Eixample:
```
GET /api/properties?type=Penthouse&neighborhood=Eixample
```

3-bedroom apartments between €300k and €800k:
```
GET /api/properties?type=Apartment&bedrooms=3&minPrice=300000&maxPrice=800000
```

Properties with "terrace" in the title or description, at least 80 m²:
```
GET /api/properties?q=terrace&minSqm=80
```

Page 2 with 10 results per page:
```
GET /api/properties?page=2&limit=10
```
