'use client';

import { useState, useEffect } from 'react';
import { Business } from '../components/BusinessCard/BusinessCard';

interface UseBusinessesOptions {
  category?: string;
  limit?: number;
  badge?: string;
  verified?: boolean;
}

export function useBusinesses(options: UseBusinessesOptions = {}) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.category) params.set('category', options.category);
      if (options.limit) params.set('limit', options.limit.toString());
      if (options.badge) params.set('badge', options.badge);
      if (options.verified !== undefined) params.set('verified', options.verified.toString());

      const url = `/api/businesses?${params.toString()}`;
      console.log('[useBusinesses] Fetching from:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch businesses: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[useBusinesses] Response data:', data);

      setBusinesses(data.data || []);
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch businesses');
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [options.category, options.limit, options.badge, options.verified]);

  return {
    businesses,
    loading,
    error,
    refetch: fetchBusinesses
  };
}

export function useTrendingBusinesses(limit?: number) {
  return useBusinesses({
    badge: 'Trending',
    limit: limit || 10
  });
}

export function useNearbyBusinesses(
  latitude?: number,
  longitude?: number,
  radiusKm?: number,
  limit?: number
) {
  // For now, just return all businesses (location filtering can be added later)
  return useBusinesses({
    limit: limit || 10
  });
}

export function useBusiness(id?: string) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchBusiness = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/businesses?limit=1`);
        if (!response.ok) {
          throw new Error('Failed to fetch business');
        }

        const data = await response.json();
        const businesses = data.data || [];
        const foundBusiness = businesses.find((b: Business) => b.id === id);

        setBusiness(foundBusiness || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch business');
        console.error('Error fetching business:', err);
        setBusiness(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  return {
    business,
    loading,
    error,
    refetch: () => {
      // Re-trigger the effect by updating a dependency
    }
  };
}