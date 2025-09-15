// Development mock for Supabase when connection fails
export const createSupabaseMock = () => {
  const mockUser = {
    id: 'mock-user-id',
    email: 'test@example.com',
    aud: 'authenticated',
    role: 'authenticated'
  };

  const mockSession = {
    access_token: 'mock-token',
    refresh_token: 'mock-refresh',
    expires_in: 3600,
    expires_at: Date.now() + 3600000,
    token_type: 'bearer',
    user: mockUser
  };

  return {
    auth: {
      signUp: async () => ({
        data: {
          user: mockUser,
          session: mockSession
        },
        error: null
      }),
      signInWithPassword: async () => ({
        data: {
          user: mockUser,
          session: mockSession
        },
        error: null
      }),
      signOut: async () => ({
        error: null
      }),
      getSession: async () => ({
        data: { session: null },
        error: null
      }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      }),
      resetPasswordForEmail: async () => ({
        error: null
      })
    },
    from: () => ({
      insert: () => ({
        select: () => ({
          single: () => ({
            abortSignal: () => Promise.resolve({
              data: {
                id: 'mock-user-id',
                onboarding_step: 'interests',
                onboarding_complete: false,
                interests: [],
                sub_interests: [],
                dealbreakers: [],
                created_at: new Date().toISOString()
              },
              error: null
            })
          })
        })
      }),
      select: () => ({
        eq: () => ({
          single: () => ({
            abortSignal: () => Promise.resolve({
              data: {
                id: 'mock-user-id',
                onboarding_step: 'interests',
                onboarding_complete: false,
                interests: [],
                sub_interests: [],
                dealbreakers: [],
                created_at: new Date().toISOString()
              },
              error: null
            })
          })
        }),
        order: () => ({
          limit: () => ({
            abortSignal: () => Promise.resolve({
              data: [],
              error: null
            })
          })
        })
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => ({
              abortSignal: () => Promise.resolve({
                data: {
                  id: 'mock-user-id',
                  onboarding_step: 'interests',
                  onboarding_complete: false,
                  interests: [],
                  sub_interests: [],
                  dealbreakers: [],
                  created_at: new Date().toISOString()
                },
                error: null
              })
            })
          })
        })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null })
      })
    })
  };
};

export const isDevelopmentMode = process.env.NODE_ENV === 'development';