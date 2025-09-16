'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  DUMMY_REVIEWS,
  simulateDelay,
  getReviewsByBusinessId,
  type Review
} from '../lib/dummyData';

// Use Review type as ReviewWithUser for dummy data
type ReviewWithUser = Review;
interface ReviewFormData {
  business_id: string;
  rating: number;
  title?: string;
  content: string;
  tags: string[];
  images?: File[];
}

export function useReviews(businessId?: string) {
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchReviews = async () => {
      if (!businessId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        await simulateDelay();
        const data = getReviewsByBusinessId(businessId);

        if (mounted) {
          setReviews(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
          console.error('Error fetching reviews:', err);
          // Fallback to empty array
          setReviews([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      mounted = false;
    };
  }, [businessId]);

  const refetch = async () => {
    if (!businessId) return;

    try {
      setLoading(true);
      setError(null);
      await simulateDelay();
      const data = getReviewsByBusinessId(businessId);
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      console.error('Error refetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    reviews,
    loading,
    error,
    refetch
  };
}

export function useRecentReviews(limit?: number) {
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchRecentReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        await simulateDelay();
        // Get recent reviews (sorted by date)
        const data = [...DUMMY_REVIEWS]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, limit || 10);

        if (mounted) {
          setReviews(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch recent reviews');
          console.error('Error fetching recent reviews:', err);
          // Fallback to empty array
          setReviews([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchRecentReviews();

    return () => {
      mounted = false;
    };
  }, [limit]);

  return {
    reviews,
    loading,
    error,
    refetch: async () => {
      await simulateDelay();
      const data = [...DUMMY_REVIEWS]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit || 10);
      setReviews(data);
    }
  };
}

export function useReviewSubmission() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { showToast } = useToast();

  const submitReview = async (reviewData: ReviewFormData): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to submit a review');
      showToast('Please log in to submit a review', 'error');
      return false;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Simulate review creation delay
      await simulateDelay(800);

      // For dummy data, always succeed
      showToast('Review submitted successfully!', 'success');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit review';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('Error submitting review:', err);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (reviewId: string): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to delete a review');
      showToast('Please log in to delete a review', 'error');
      return false;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Simulate deletion delay
      await simulateDelay(500);

      // For dummy data, always succeed
      showToast('Review deleted successfully', 'success');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete review';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('Error deleting review:', err);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const likeReview = async (reviewId: string): Promise<boolean | null> => {
    if (!user) {
      showToast('Please log in to like reviews', 'info');
      return null;
    }

    try {
      // Simulate like delay
      await simulateDelay(200);

      // For dummy data, randomly toggle like status
      const isLiked = Math.random() > 0.5;
      showToast(
        isLiked ? 'Review liked!' : 'Like removed',
        'success'
      );
      return isLiked;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to like review';
      showToast(errorMessage, 'error');
      console.error('Error liking review:', err);
      return null;
    }
  };

  return {
    submitting,
    error,
    submitReview,
    deleteReview,
    likeReview
  };
}