# KLIO Authentication System Documentation

## Overview

This document outlines the step-by-step implementation of Supabase authentication for the KLIO application. The system provides secure user registration and login functionality with comprehensive error handling and validation.

## Architecture

### Core Components

1. **Supabase Configuration** (`src/app/lib/supabase.ts`)
2. **Authentication Service** (`src/app/lib/auth.ts`)
3. **AuthContext** (`src/app/contexts/AuthContext.tsx`)
4. **Database Types** (`src/app/lib/types/database.ts`)
5. **Toast Notifications** (`src/app/contexts/ToastContext.tsx`)

## Implementation Details

### 1. Environment Configuration

The application uses the following environment variables in `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://haytuqpzfuwzugnvnemy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=FJnxhljYHVjhcoGts...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Note:** `NEXT_PUBLIC_` prefix is required for client-side access per Next.js conventions.

### 2. Supabase Client Setup

**File:** `src/app/lib/supabase.ts`

- Initializes Supabase client with proper configuration
- Includes auth settings with PKCE flow for security
- Provides helper functions for database operations
- Implements proper error handling and timeouts

Key features:
- Auto-refresh tokens
- Session persistence
- URL-based session detection
- Performance optimizations with timeouts

### 3. Authentication Service

**File:** `src/app/lib/auth.ts`

A comprehensive service class that handles:

#### Registration (`signUp`)
- Email validation using regex
- Strong password requirements (8+ chars, uppercase, lowercase, number)
- Automatic user profile creation
- Comprehensive error handling

#### Login (`signIn`)
- Email/password authentication
- Profile data retrieval
- Session management

#### Logout (`signOut`)
- Secure session termination
- State cleanup

#### Current User (`getCurrentUser`)
- Session validation
- Profile data fetching

### 4. User Interface Flow

#### Landing Page (`src/app/page.tsx`)
- Smart routing based on authentication state
- Automatic redirection to appropriate screen

#### Onboarding Page (`src/app/onboarding/page.tsx`)
- "Get Started" button → `/register`
- "Log in" button → `/login`
- Clean, animated design with trust indicators

#### Registration Page (`src/app/register/page.tsx`)
- Enhanced form validation
- Real-time error feedback
- Toast notifications for success/error states
- Social login placeholders (Google, Apple)
- Premium UI with animations

### 5. Authentication Context

**File:** `src/app/contexts/AuthContext.tsx`

Provides global authentication state management:

- User state management
- Loading states
- Error handling
- Authentication method wrappers
- Supabase auth state listener

### 6. Database Schema

The system expects the following Supabase tables:

#### `auth.users` (Built-in Supabase table)
- Handles user credentials
- Email verification
- Password management

#### `profiles` (Custom table)
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  onboarding_step TEXT DEFAULT 'interests',
  onboarding_complete BOOLEAN DEFAULT FALSE,
  interests TEXT[] DEFAULT '{}',
  sub_interests TEXT[] DEFAULT '{}',
  dealbreakers TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);
```

## Validation Rules

### Email Validation
- Must be valid email format
- Converted to lowercase
- Trimmed of whitespace

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Error Handling

### Network Errors
- Connection timeouts handled gracefully
- User-friendly error messages
- Retry suggestions

### Authentication Errors
- Invalid credentials
- User already exists
- Email not confirmed
- Rate limiting

### UI Error Display
- Form validation errors
- Toast notifications
- Context-aware error messages

## Security Features

1. **PKCE Flow**: Enhanced OAuth security
2. **Input Sanitization**: Email trimming and validation
3. **SQL Injection Prevention**: Parameterized queries
4. **Rate Limiting**: Built-in Supabase protection
5. **Password Strength**: Enforced complexity rules

## User Experience Features

### Success Flows
- Registration success → Navigate to `/interests`
- Login success → Navigate based on onboarding status
- Toast notifications with celebratory messages

### Error Flows
- Clear, actionable error messages
- Form field highlighting
- Network error recovery guidance

### Loading States
- Button loading indicators
- Context loading states
- Smooth transitions

## Testing Strategy

To test the authentication flow:

1. **Registration Test**
   - Visit `/onboarding`
   - Click "Get Started"
   - Enter valid email and password
   - Verify account creation and redirection

2. **Validation Test**
   - Test invalid email formats
   - Test weak passwords
   - Verify error messages

3. **Network Error Test**
   - Disconnect network
   - Attempt registration
   - Verify graceful error handling

## Future Enhancements

### Planned Features
- Email verification (currently disabled)
- Social authentication (Google, Apple)
- Password reset functionality
- Two-factor authentication
- Session management improvements

### Performance Optimizations
- Request caching
- Optimistic UI updates
- Background token refresh

## Troubleshooting

### Common Issues

1. **Environment Variables**
   - Ensure `NEXT_PUBLIC_` prefix for client-side vars
   - Restart dev server after changes

2. **Database Connection**
   - Verify Supabase project URL and keys
   - Check network connectivity

3. **Profile Creation Fails**
   - Ensure `profiles` table exists
   - Check RLS policies

### Debug Mode
Set `NODE_ENV=development` for detailed error logging.

## Conclusion

The KLIO authentication system provides a robust, secure, and user-friendly registration and login experience. The modular architecture ensures maintainability while the comprehensive error handling guarantees a smooth user experience even under adverse conditions.

The system is production-ready and follows modern web security best practices while maintaining the premium user experience that KLIO users expect.