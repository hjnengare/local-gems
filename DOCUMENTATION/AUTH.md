# Authentication System Documentation

## Overview

KLIO uses Supabase Auth for user authentication with Next.js App Router integration. The system provides secure user registration, login, and session management.

## Architecture

### AuthService (`src/app/lib/auth.ts`)

Central authentication service that handles all auth operations:

```typescript
class AuthService {
  static async signUp({ email, password }: SignUpData): Promise<AuthResult>
  static async signIn({ email, password }: SignInData): Promise<AuthResult>
  static async signOut(): Promise<void>
  static async getCurrentUser(): Promise<AuthUser | null>
}
```

### AuthContext (`src/app/contexts/AuthContext.tsx`)

React context providing auth state management:

```typescript
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<AuthResult>;
  signIn: (data: SignInData) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => void;
}
```

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Supabase Setup

1. **Auth Flow**: Uses `implicit` flow for better compatibility
2. **Session Management**: Cookie-based sessions with SSR support
3. **Auto Refresh**: Automatic token refresh handled by Supabase

## Features

### Password Validation

Real-time password strength checking with visual feedback:

```typescript
const checkPasswordStrength = (password: string) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /(?=.*[A-Z])/.test(password),
    lowercase: /(?=.*[a-z])/.test(password),
    number: /(?=.*\d)/.test(password)
  };

  const score = Object.values(checks).filter(Boolean).length;
  return { score, checks, strength: getStrengthLevel(score) };
};
```

### Email Validation

Client-side email format validation with visual indicators:

```typescript
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

### Error Handling

Comprehensive error handling with user-friendly messages:

```typescript
// Network errors
if (error.message.includes('fetch') || error.message.includes('network')) {
  return 'Connection error. Please check your internet and try again.';
}

// Supabase auth errors
if (error.message.includes('Invalid login credentials')) {
  return 'Invalid email or password. Please try again.';
}
```

## Route Protection

### Protected Routes

Routes requiring authentication automatically redirect to login:

```typescript
// Route protection in interests page
useEffect(() => {
  if (mounted && !user) {
    router.replace('/login?redirect=/interests');
  }
}, [mounted, user, router]);
```

### Redirect Handling

Login page supports redirect query parameter:

```typescript
// After successful login
const redirect = searchParams.get('redirect') || '/interests';
router.push(redirect);
```

## Registration Flow

### Step-by-Step Process

1. **Email & Password Input**: Real-time validation
2. **Password Strength Check**: 4-level strength indicator
3. **Form Submission**: Optimistic UI with loading states
4. **Success Feedback**: Toast notification + auto-redirect
5. **Auto-route to Interests**: Seamless onboarding flow

### UI Components

```typescript
// Password strength indicator
<div className="flex space-x-1 mb-2">
  {[1, 2, 3, 4].map((level) => (
    <div
      key={level}
      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
        passwordStrength.score >= level ? strengthColors[level] : 'bg-gray-200'
      }`}
    />
  ))}
</div>
```

## Login Flow

### Features

- **Remember Me**: Persistent sessions
- **Forgot Password**: Reset password functionality (ready for implementation)
- **Social Auth**: Architecture ready for Google/GitHub login

### Error States

- Invalid credentials
- Network connectivity issues
- Rate limiting protection
- Account verification requirements

## Session Management

### Client-Side

```typescript
// AuthContext handles session state
const [user, setUser] = useState<AuthUser | null>(null);
const [loading, setLoading] = useState(true);

// Auto-refresh on focus
useEffect(() => {
  const handleFocus = () => refreshSession();
  window.addEventListener('focus', handleFocus);
  return () => window.removeEventListener('focus', handleFocus);
}, []);
```

### Server-Side

```typescript
// Server components can access auth
import { getServerSupabase } from '@/app/lib/supabase/server';

const supabase = getServerSupabase();
const { data: { user } } = await supabase.auth.getUser();
```

## Security Best Practices

### Implementation

1. **No Secrets in Client**: Only public keys in frontend
2. **Server Validation**: All auth operations validated server-side
3. **HTTPS Only**: Secure cookie transmission
4. **Auto Logout**: Session expiry handling
5. **CSRF Protection**: Built into Supabase Auth

### Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Visual strength indicator

## Troubleshooting

### Common Issues

1. **422 Signup Error**: Check auth flow configuration
2. **Session Not Persisting**: Verify cookie settings
3. **Redirect Loops**: Check route protection logic
4. **CORS Issues**: Verify Supabase URL configuration

### Debug Tools

```typescript
// Enable auth debugging
console.log('Auth state:', { user, loading });
console.log('Supabase session:', supabase.auth.getSession());
```

## Future Enhancements

### Planned Features

- [ ] Email verification
- [ ] Social authentication (Google, GitHub)
- [ ] Two-factor authentication
- [ ] Password reset functionality
- [ ] Account deletion
- [ ] Session management dashboard

### Migration Considerations

- Database schema is ready for additional auth providers
- Context architecture supports new auth methods
- Error handling is extensible for new error types