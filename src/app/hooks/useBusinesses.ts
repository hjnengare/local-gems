'use client';

import { useState, useEffect } from 'react';
import {
  DUMMY_BUSINESSES,
  simulateDelay,
  getBusinessById,
  searchBusinesses,
  type Business
} from '../lib/dummyData';

// Use Business type as BusinessWithStats for dummy data
type BusinessWithStats = Business;
interface BusinessSearchFilters {
  category?: string;
  subcategory?: string;
  query?: string;
}

export function useBusinesses(filters?: BusinessSearchFilters) {
  const [businesses, setBusinesses] = useState<BusinessWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate loading delay
        await simulateDelay();

        let data = DUMMY_BUSINESSES;

        // Apply filters
        if (filters?.category) {
          data = data.filter(b => b.category === filters.category);
        }
        if (filters?.subcategory) {
          data = data.filter(b => b.subcategory === filters.subcategory);
        }
        if (filters?.query) {
          data = searchBusinesses(filters.query);
        }

        if (mounted) {
          setBusinesses(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch businesses');
          console.error('Error fetching businesses:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBusinesses();

    return () => {
      mounted = false;
    };
  }, [filters]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);

      await simulateDelay();
      let data = DUMMY_BUSINESSES;

      // Apply filters
      if (filters?.category) {
        data = data.filter(b => b.category === filters.category);
      }
      if (filters?.subcategory) {
        data = data.filter(b => b.subcategory === filters.subcategory);
      }
      if (filters?.query) {
        data = searchBusinesses(filters.query);
      }

      setBusinesses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch businesses');
      console.error('Error refetching businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    businesses,
    loading,
    error,
    refetch
  };
}

export function useTrendingBusinesses(limit?: number) {
  const [businesses, setBusinesses] = useState<BusinessWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchTrendingBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);

        await simulateDelay();

        // Get trending businesses (sorted by reviews/rating)
        const sortedBusinesses = [...DUMMY_BUSINESSES]
          .sort((a, b) => (b.stats?.total_reviews || 0) - (a.stats?.total_reviews || 0))
          .slice(0, limit || 10);

        const data = sortedBusinesses;

        if (mounted) {
          setBusinesses(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch trending businesses');
          console.error('Error fetching trending businesses:', err);
          // Fallback to empty array instead of crashing the app
          setBusinesses([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTrendingBusinesses();

    return () => {
      mounted = false;
    };
  }, [limit]);

  return {
    businesses,
    loading,
    error,
    refetch: async () => {
      await simulateDelay();
      const sortedBusinesses = [...DUMMY_BUSINESSES]
        .sort((a, b) => (b.stats?.total_reviews || 0) - (a.stats?.total_reviews || 0))
        .slice(0, limit || 10);
      setBusinesses(sortedBusinesses);
    }
  };
}

export function useNearbyBusinesses(
  latitude?: number,
  longitude?: number,
  radiusKm?: number,
  limit?: number
) {
  const [businesses, setBusinesses] = useState<BusinessWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchNearbyBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);

        await simulateDelay();

        // For dummy data, just return all businesses (ignore location)
        const data = DUMMY_BUSINESSES.slice(0, limit || 10);

        if (mounted) {
          setBusinesses(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch nearby businesses');
          console.error('Error fetching nearby businesses:', err);
          // Fallback to empty array instead of crashing the app
          setBusinesses([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchNearbyBusinesses();

    return () => {
      mounted = false;
    };
  }, [latitude, longitude, radiusKm, limit]);

  return {
    businesses,
    loading,
    error,
    refetch: async () => {
      await simulateDelay();
      const data = DUMMY_BUSINESSES.slice(0, limit || 10);
      setBusinesses(data);
    }
  };
}

export function useBusiness(id?: string, slug?: string) {
  const [business, setBusiness] = useState<BusinessWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchBusiness = async () => {
      if (!id && !slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        await simulateDelay();

        let data: BusinessWithStats | null = null;

        if (id) {
          data = getBusinessById(id) || null;
        } else if (slug) {
          // For dummy data, ignore slug lookup (not implemented)
          data = null;
        }

        if (mounted) {
          setBusiness(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch business');
          console.error('Error fetching business:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBusiness();

    return () => {
      mounted = false;
    };
  }, [id, slug]);

  const refetch = async () => {
    if (!id && !slug) return;

    try {
      setLoading(true);
      setError(null);

      await simulateDelay();

      let data: BusinessWithStats | null = null;

      if (id) {
        data = getBusinessById(id) || null;
      } else if (slug) {
        // For dummy data, ignore slug lookup (not implemented)
        data = null;
      }

      setBusiness(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch business');
      console.error('Error refetching business:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    business,
    loading,
    error,
    refetch
  };
}