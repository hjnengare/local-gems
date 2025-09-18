import { supabase } from './supabase';
import type { AuthUser, SignUpData, SignInData, AuthError } from './types/database';

export class AuthService {
  static async signUp({ email, password }: SignUpData): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    try {
      // Basic validation
      if (!email?.trim() || !password?.trim()) {
        return {
          user: null,
          error: { message: 'Email and password are required' }
        };
      }

      if (!this.isValidEmail(email)) {
        return {
          user: null,
          error: { message: 'Please enter a valid email address' }
        };
      }

      if (password.length < 8) {
        return {
          user: null,
          error: { message: 'Password must be at least 8 characters long' }
        };
      }

      if (!this.isStrongPassword(password)) {
        return {
          user: null,
          error: { message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' }
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation for now
        }
      });

      if (error) {
        console.error('Supabase signup error:', error);
        return {
          user: null,
          error: this.handleSupabaseError(error)
        };
      }

      if (!data.user) {
        return {
          user: null,
          error: { message: 'Registration failed. Please try again.' }
        };
      }

      // Create user profile
      try {
        await this.createUserProfile(data.user.id);
      } catch (profileError) {
        console.warn('Failed to create user profile:', profileError);
        // Don't fail registration if profile creation fails
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          created_at: data.user.created_at,
          updated_at: data.user.updated_at || data.user.created_at
        },
        error: null
      };
    } catch (error: unknown) {
      return {
        user: null,
        error: {
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          details: error
        }
      };
    }
  }

  static async signIn({ email, password }: SignInData): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    try {
      if (!email?.trim() || !password?.trim()) {
        return {
          user: null,
          error: { message: 'Email and password are required' }
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });

      if (error) {
        return {
          user: null,
          error: this.handleSupabaseError(error)
        };
      }

      if (!data.user) {
        return {
          user: null,
          error: { message: 'Login failed. Please try again.' }
        };
      }

      // Get user profile
      const profile = await this.getUserProfile(data.user.id);

      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          created_at: data.user.created_at,
          updated_at: data.user.updated_at || data.user.created_at,
          profile: profile
        },
        error: null
      };
    } catch (error: unknown) {
      return {
        user: null,
        error: {
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          details: error
        }
      };
    }
  }

  static async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { error: this.handleSupabaseError(error) };
      }

      return { error: null };
    } catch (error: unknown) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          details: error
        }
      };
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return null;

      const profile = await this.getUserProfile(user.id);

      return {
        id: user.id,
        email: user.email!,
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at,
        profile: profile
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  private static async createUserProfile(userId: string) {
    // Profile creation is handled by the database trigger when user signs up
    // Just verify the profile exists and update onboarding_step if needed
    const { error } = await supabase
      .from('profiles')
      .upsert([
        {
          user_id: userId,
          onboarding_step: 'interests'
        }
      ], { onConflict: 'user_id' });

    if (error) throw error;
  }

  private static async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, onboarding_step, interests_count, last_interests_updated, created_at, updated_at')
        .eq('user_id', userId)
        .single();

      if (error || !data) return undefined;

      return {
        id: data.user_id,
        onboarding_step: data.onboarding_step,
        onboarding_complete: data.onboarding_step === 'complete',
        interests_count: data.interests_count || 0,
        last_interests_updated: data.last_interests_updated,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return undefined;
    }
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static isStrongPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongPasswordRegex.test(password);
  }

  private static handleSupabaseError(error: { message: string; error_code?: string }): AuthError {
    // Handle specific error messages from Supabase
    const message = error.message.toLowerCase();

    if (message.includes('user already registered') || message.includes('email already exists') || message.includes('already been registered')) {
      return { message: '❌ This email address is already taken. Try logging in instead.', code: 'user_exists' };
    }

    if (message.includes('invalid login credentials') || message.includes('invalid email or password')) {
      return { message: '❌ Invalid email or password. Please check your credentials.', code: 'invalid_credentials' };
    }

    if (message.includes('email not confirmed')) {
      return { message: '📧 Please check your email and click the confirmation link to verify your account.', code: 'email_not_confirmed' };
    }

    if (message.includes('too many requests') || message.includes('rate limit')) {
      return { message: '⏰ Too many attempts. Please wait a moment and try again.', code: 'rate_limit' };
    }

    if (message.includes('signup is disabled') || message.includes('signups not allowed')) {
      return { message: '🚫 New registrations are temporarily unavailable. Please try again later.', code: 'signup_disabled' };
    }

    if (message.includes('password') && (message.includes('weak') || message.includes('requirements'))) {
      return { message: '🔐 Password doesn\'t meet security requirements. Use 8+ characters with uppercase, lowercase, and numbers.', code: 'weak_password' };
    }

    if (message.includes('email') && (message.includes('invalid') || message.includes('format'))) {
      return { message: '📧 Please enter a valid email address (e.g., user@example.com).', code: 'invalid_email' };
    }

    if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
      return { message: '🌐 Connection issue. Please check your internet and try again.', code: 'network_error' };
    }

    if (message.includes('422') || message.includes('unprocessable')) {
      return { message: '❌ Registration failed. Please check that your email and password are valid.', code: 'invalid_data' };
    }

    // Default fallback with more user-friendly message
    return {
      message: error.message || '❌ Something went wrong. Please try again in a moment.',
      code: error.error_code || 'unknown_error'
    };
  }
}