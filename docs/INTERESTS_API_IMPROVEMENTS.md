# Interests API & UI Improvements

## Overview
This document outlines the improvements made to the interests page and API endpoint to fix animation issues and enhance data integrity.

## Changes Made

### 1. Frontend Animation Fixes (`/interests/page.tsx`)

#### Problem
- Interest tiles had no click animation feedback despite having `animate-bubbly` defined
- Missing `animate-shake` keyframes for max selection feedback
- Transform conflicts between Tailwind's `scale-*` and CSS keyframe animations

#### Solution
- **Added missing shake keyframes** to CSS styles:
  ```css
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-4px); }
    40% { transform: translateX(4px); }
    60% { transform: translateX(-3px); }
    80% { transform: translateX(3px); }
  }
  .animate-shake { animation: shake 0.6s ease; }
  ```

- **Added animation state tracking**:
  ```typescript
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());

  const triggerBounce = useCallback((id: string, ms = 700) => {
    setAnimatingIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setTimeout(() => {
      setAnimatingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, ms);
  }, []);
  ```

- **Applied animations to inner wrapper** to avoid transform conflicts:
  ```tsx
  <button className="... scale-105 ...">
    <div className={`... ${animatingIds.has(interest.id) ? 'animate-bubbly' : ''}`}>
      {/* Content */}
    </div>
  </button>
  ```

#### Result
- Every interest tile now has satisfying bounce animation on click
- Proper shake feedback when maximum selections reached
- No transform conflicts between Tailwind and CSS animations

### 2. Backend API Robustness (`/api/user/interests/route.ts`)

#### Problems Identified
1. **No duplicate handling** - could cause PK violations
2. **No transaction atomicity** - delete/insert as separate operations
3. **Missing validation** - no check if interest IDs exist
4. **Potential race conditions** - non-atomic operations

#### Solutions Implemented

##### A. Input Validation & Deduplication
```typescript
// Clean and dedupe selections
const cleaned = Array.from(
  new Set(
    (selections ?? [])
      .filter((s: string) => s && s.trim())
      .map((s: string) => s.trim())
  )
);
```

##### B. Interest ID Validation
```typescript
// Validate that all interest IDs exist in the interests table
if (cleaned.length > 0) {
  const { data: known, error: knownErr } = await supabase
    .from('interests')
    .select('id')
    .in('id', cleaned);

  if (knownErr) {
    return NextResponse.json({ error: knownErr.message }, { status: 400 });
  }

  if ((known?.length ?? 0) !== cleaned.length) {
    return NextResponse.json({ error: 'One or more interest IDs are invalid' }, { status: 400 });
  }
}
```

##### C. Atomic Transaction via RPC
```typescript
// Use atomic replace function for true transactional behavior
const { error } = await supabase.rpc('replace_user_interests', {
  p_user_id: user.id,
  p_interest_ids: validSelections
});
```

## Required Database Setup

### 1. Atomic Replace Function
Create this PostgreSQL function in Supabase:

```sql
create or replace function replace_user_interests(p_user_id uuid, p_interest_ids text[])
returns void language plpgsql as $$
begin
  delete from public.user_interests where user_id = p_user_id;
  insert into public.user_interests (user_id, interest_id)
  select p_user_id, unnest(p_interest_ids);
end;
$$;
```

### 2. Required RLS Policies
Ensure these Row Level Security policies exist:

```sql
alter table public.user_interests enable row level security;

create policy "read own interests"
  on public.user_interests for select
  using (auth.uid() = user_id);

create policy "insert own interests"
  on public.user_interests for insert
  with check (auth.uid() = user_id);

create policy "delete own interests"
  on public.user_interests for delete
  using (auth.uid() = user_id);
```

### 3. Required Tables
Ensure these tables exist with proper structure:

```sql
-- Master interests table
create table public.interests (
  id text primary key,
  name text not null,
  created_at timestamptz default now()
);

-- User selections
create table public.user_interests (
  user_id uuid references auth.users(id) on delete cascade,
  interest_id text references public.interests(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, interest_id)
);

-- Seed data matching frontend IDs
insert into public.interests (id, name) values
  ('food-drink', 'Food & Drink'),
  ('beauty-wellness', 'Beauty & Wellness'),
  ('home-services', 'Home & Services'),
  ('outdoors-adventure', 'Outdoors & Adventure'),
  ('nightlife-entertainment', 'Nightlife & Entertainment'),
  ('arts-culture', 'Arts & Culture'),
  ('family-pets', 'Family & Pets'),
  ('shopping-lifestyle', 'Shopping & Lifestyle');
```

### 4. Performance Index
```sql
create index if not exists user_interests_user_id_idx
  on public.user_interests(user_id);
```

## Benefits

### Frontend
- ✅ **Enhanced UX**: Immediate visual feedback on all interactions
- ✅ **Smooth Animations**: No transform conflicts or missing effects
- ✅ **Accessibility**: Maintains focus states and ARIA attributes

### Backend
- ✅ **Data Integrity**: Prevents duplicate entries and invalid references
- ✅ **Atomicity**: True transactions prevent partial state corruption
- ✅ **Input Validation**: Early rejection of malformed requests
- ✅ **Error Handling**: Clear error messages for debugging

### System
- ✅ **Reliability**: Reduced race conditions and edge cases
- ✅ **Performance**: Single RPC call instead of multiple operations
- ✅ **Maintainability**: Cleaner code with proper separation of concerns

## Testing Recommendations

1. **Test duplicate submissions** - verify deduplication works
2. **Test invalid interest IDs** - should return 400 with clear message
3. **Test concurrent requests** - atomic function should handle race conditions
4. **Test animation timing** - verify no visual glitches or conflicts
5. **Test max selections** - confirm shake animation triggers properly

## Migration Notes

If upgrading from the previous implementation:
1. Create the PostgreSQL function first
2. Verify RLS policies are in place
3. Ensure interests table has matching IDs
4. Test thoroughly in staging before production deployment

---

*Last updated: 2025-01-18*
*Contributors: Claude Code Assistant*