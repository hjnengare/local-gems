'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ReviewCard from './ReviewCard';
import type { ReviewWithUser } from '../../lib/types/database';

interface ReviewsListProps {
  reviews: ReviewWithUser[];
  loading?: boolean;
  error?: string | null;
  showBusinessInfo?: boolean;
  onUpdate?: () => void;
  emptyMessage?: string;
}

export default function ReviewsList({
  reviews,
  loading = false,
  error = null,
  showBusinessInfo = false,
  onUpdate,
  emptyMessage = "No reviews yet. Be the first to share your experience!"
}: ReviewsListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl p-6 border border-sage/5"
          >
            <div className="flex items-start space-x-4 animate-pulse">
              <div className="w-12 h-12 bg-sage/20 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-5 bg-sage/20 rounded w-24" />
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-4 h-4 bg-sage/20 rounded" />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-sage/20 rounded w-full" />
                  <div className="h-4 bg-sage/20 rounded w-3/4" />
                  <div className="h-4 bg-sage/20 rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center"
      >
        <div className="flex items-center justify-center mb-3">
          <ion-icon
            name="alert-circle-outline"
            style={{ fontSize: '24px', color: '#ef4444' }}
          />
        </div>
        <h3 className="font-urbanist text-lg font-600 text-red-800 mb-2">
          Unable to load reviews
        </h3>
        <p className="font-urbanist text-sm text-red-600">
          {error}
        </p>
      </motion.div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-sage/10"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2
          }}
          className="w-16 h-16 bg-gradient-to-br from-sage/20 to-sage/10 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <ion-icon
            name="chatbubbles-outline"
            style={{ fontSize: '32px', color: 'var(--sage)' }}
          />
        </motion.div>
        <h3 className="font-urbanist text-xl font-600 text-charcoal mb-2">
          No reviews yet
        </h3>
        <p className="font-urbanist text-base text-charcoal/70">
          {emptyMessage}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <ReviewCard
            review={review}
            onUpdate={onUpdate}
            showBusinessInfo={showBusinessInfo}
          />
        </motion.div>
      ))}

      {reviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reviews.length * 0.1 + 0.2 }}
          className="text-center pt-4"
        >
          <p className="font-urbanist text-sm text-charcoal/60">
            Showing {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </p>
        </motion.div>
      )}
    </div>
  );
}