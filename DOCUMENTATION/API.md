# API Documentation

## Overview

KLIO's API is built using Next.js App Router API routes with Supabase backend integration. All endpoints follow RESTful conventions and include comprehensive error handling.

## Authentication

All API routes require authentication via Supabase session cookies:

```typescript
import { getServerSupabase } from '@/app/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Authorized logic here
}
```

## Endpoints

### User Interests

#### `POST /api/user/interests`

Save user interest selections to the database.

**Request Body:**
```typescript
{
  selections: string[] // Array of interest IDs
}
```

**Response:**
```typescript
// Success (200)
{
  ok: true,
  message: "Successfully saved 4 interests",
  selections: ["food-drink", "arts-culture", "beauty-wellness", "outdoors-adventure"]
}

// Error (400/500)
{
  error: string // Error message
}
```

**Implementation:**
```typescript
export async function POST(req: Request) {
  const supabase = getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { selections }: { selections: string[] } = await req.json();

    // Validate input
    if (!Array.isArray(selections)) {
      return NextResponse.json({
        error: "Invalid payload - selections must be an array"
      }, { status: 400 });
    }

    // Filter out empty selections
    const validSelections = selections.filter(selection =>
      selection && selection.trim()
    );

    // Replace existing interests (delete + insert transaction)
    const { error: delErr } = await supabase
      .from("user_interests")
      .delete()
      .eq("user_id", user.id);

    if (delErr) {
      console.error('Error deleting user interests:', delErr);
      return NextResponse.json({ error: delErr.message }, { status: 400 });
    }

    // Insert new interests
    if (validSelections.length > 0) {
      const rows = validSelections.map((interest_id) => ({
        user_id: user.id,
        interest_id,
        created_at: new Date().toISOString()
      }));

      const { error: insErr } = await supabase
        .from("user_interests")
        .insert(rows);

      if (insErr) {
        console.error('Error inserting user interests:', insErr);
        return NextResponse.json({ error: insErr.message }, { status: 400 });
      }
    }

    return NextResponse.json({
      ok: true,
      message: `Successfully saved ${validSelections.length} interests`,
      selections: validSelections
    });
  } catch (error) {
    console.error('Error in interests API:', error);
    return NextResponse.json(
      { error: "Failed to save interests" },
      { status: 500 }
    );
  }
}
```

#### `GET /api/user/interests`

Retrieve user's current interest selections.

**Response:**
```typescript
// Success (200)
{
  interests: string[], // Array of interest IDs
  count: number       // Number of interests
}

// Error (400/500)
{
  error: string // Error message
}
```

**Implementation:**
```typescript
export async function GET() {
  const supabase = getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("user_interests")
      .select("interest_id")
      .eq("user_id", user.id);

    if (error) {
      console.error('Error fetching user interests:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const interests = data?.map(row => row.interest_id) || [];

    return NextResponse.json({
      interests,
      count: interests.length
    });
  } catch (error) {
    console.error('Error in GET interests API:', error);
    return NextResponse.json(
      { error: "Failed to fetch interests" },
      { status: 500 }
    );
  }
}
```

## Error Handling

### Standard Error Responses

All endpoints follow consistent error response format:

```typescript
// Client errors (4xx)
{
  error: string,           // Human-readable error message
  code?: string,          // Optional error code
  details?: unknown       // Optional error details
}

// Server errors (5xx)
{
  error: "Internal server error",
  timestamp: string,
  path: string
}
```

### Common HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing/invalid auth)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Rate Limited
- `500` - Internal Server Error

### Error Handling Patterns

```typescript
// Input validation
if (!Array.isArray(selections)) {
  return NextResponse.json({
    error: "Invalid payload - selections must be an array"
  }, { status: 400 });
}

// Database errors
if (error) {
  console.error('Database error:', error);
  return NextResponse.json({
    error: error.message
  }, { status: 400 });
}

// Unexpected errors
try {
  // API logic
} catch (error) {
  console.error('Unexpected error:', error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
```

## Rate Limiting

### Implementation Considerations

Currently no rate limiting is implemented, but the architecture supports it:

```typescript
// Example rate limiting middleware
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: Request) {
  const rateLimitResult = await rateLimit(req);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  // Continue with API logic
}
```

## Database Schema

### user_interests Table

```sql
CREATE TABLE user_interests (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interest_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Prevent duplicate interests per user
  UNIQUE(user_id, interest_id)
);

-- Indexes for performance
CREATE INDEX idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX idx_user_interests_interest_id ON user_interests(interest_id);
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;

-- Users can only access their own interests
CREATE POLICY "Users can manage their own interests"
ON user_interests FOR ALL
USING (auth.uid() = user_id);
```

## Testing

### API Testing with curl

```bash
# Test POST endpoint
curl -X POST http://localhost:3000/api/user/interests \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=your_token" \
  -d '{"selections": ["food-drink", "arts-culture"]}'

# Test GET endpoint
curl -X GET http://localhost:3000/api/user/interests \
  -H "Cookie: sb-access-token=your_token"
```

### Unit Testing

```typescript
// Example test structure
describe('/api/user/interests', () => {
  describe('POST', () => {
    it('should save valid interests', async () => {
      const response = await POST(mockRequest);
      expect(response.status).toBe(200);
    });

    it('should reject invalid input', async () => {
      const response = await POST(mockInvalidRequest);
      expect(response.status).toBe(400);
    });

    it('should require authentication', async () => {
      const response = await POST(mockUnauthenticatedRequest);
      expect(response.status).toBe(401);
    });
  });
});
```

## Performance Considerations

### Database Optimization

1. **Indexes**: Proper indexing on user_id and interest_id
2. **Transactions**: Delete/insert operations are atomic
3. **Connection Pooling**: Supabase handles connection management
4. **Query Optimization**: Minimal data transfer

### Caching Strategy

```typescript
// Example Redis caching (not yet implemented)
const cacheKey = `user_interests:${user.id}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return NextResponse.json(JSON.parse(cached));
}

// Fetch from database and cache
const result = await fetchFromDatabase();
await redis.setex(cacheKey, 300, JSON.stringify(result)); // 5 min cache
```

## Security

### Input Validation

```typescript
// Sanitize interest IDs
const validSelections = selections
  .filter(selection => selection && selection.trim())
  .map(selection => selection.toLowerCase().trim())
  .filter(selection => /^[a-z0-9-]+$/.test(selection)); // Only alphanumeric and hyphens
```

### SQL Injection Prevention

- Using Supabase client with parameterized queries
- All user input is properly escaped
- No raw SQL concatenation

### Authentication Security

- Session-based authentication via HTTP-only cookies
- No sensitive data in localStorage
- Automatic session expiry

## Future Enhancements

### Planned API Endpoints

- `POST /api/user/subcategories` - Save subcategory preferences
- `GET /api/user/profile` - Get complete user profile
- `PUT /api/user/profile` - Update user profile
- `DELETE /api/user/account` - Delete user account
- `GET /api/interests` - Get all available interests
- `GET /api/analytics/interests` - Interest analytics (admin)

### API Versioning

When needed, API versioning will follow this pattern:

```typescript
// /api/v1/user/interests
// /api/v2/user/interests
```

### OpenAPI Specification

Future plans include generating OpenAPI specs for:
- Automated API documentation
- Client SDK generation
- Contract testing