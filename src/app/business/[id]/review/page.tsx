"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useBusiness } from "../../../hooks/useBusinesses";
import { useReviewSubmission } from "../../../hooks/useReviews";
import { useAuth } from "../../../contexts/AuthContext";

const FadeInUp = dynamic(() => import("../../../components/Animations/FadeInUp"), {
  ssr: false,
});

const PremiumHover = dynamic(() => import("../../../components/Animations/PremiumHover"), {
  ssr: false,
});

const BottomNav = dynamic(() => import("../../../components/Navigation/BottomNav"));

const ImageUpload = dynamic(() => import("../../../components/ReviewForm/ImageUpload"), {
  ssr: false,
});

export default function WriteReviewPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const { business, loading: businessLoading } = useBusiness(undefined, params.id as string);
  const { submitting, submitReview } = useReviewSubmission();

  const [overallRating, setOverallRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
    }
  }, [user, authLoading, router]);

  if (authLoading || businessLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-sage border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-urbanist text-2xl font-600 text-charcoal mb-4">Business not found</h1>
          <Link
            href="/home"
            className="text-sage hover:text-sage/80 font-urbanist font-500"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const businessName = business.name;

  const quickTags = [
    "Trustworthy",
    "On Time", 
    "Friendly",
    "Good Value"
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleStarClick = (rating: number) => {
    setOverallRating(rating);
  };

  const handleSubmitReview = async () => {
    if (!business || !user) return;

    const success = await submitReview({
      business_id: business.id,
      rating: overallRating,
      title: reviewTitle.trim() || undefined,
      content: reviewText.trim(),
      tags: selectedTags,
      images: selectedImages.length > 0 ? selectedImages : undefined
    });

    if (success) {
      // Navigate back to business page
      router.push(`/business/${params.id}`);
    }
  };

  const isFormValid = overallRating > 0 && reviewText.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-sage/30 to-sage/10 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 0.8 }}
          transition={{ duration: 3, delay: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-br from-coral/20 to-coral/5 rounded-full blur-3xl"
        />
      </div>

      {/* Premium Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 backdrop-blur-xl border-b border-sage/10 px-4 py-6 shadow-sm"
      >
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={`/business/${params.id}`} className="text-charcoal/60 hover:text-charcoal transition-colors duration-300 p-2 hover:bg-charcoal/5 rounded-full">
              <ion-icon name="arrow-back-outline" size="small"></ion-icon>
            </Link>
          </motion.div>
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-urbanist text-2xl md:text-4xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-sage to-charcoal"
          >
            Write a Review
          </motion.h1>
          <div className="w-10"></div>
        </div>
      </motion.header>

      <div className="w-full md:w-3/4 mx-auto px-4 md:px-4 py-6 pb-24 md:pb-6 relative z-10">
        {/* Review Form */}
        <FadeInUp delay={0.2}>
          <PremiumHover scale={1.02} shadowIntensity="medium" duration={0.4}>
            <div className="bg-off-white/90 backdrop-blur-lg rounded-none md:rounded-3xl shadow-xl border-0 md:border border-sage/10 p-4 md:p-8 mb-0 md:mb-8 relative overflow-hidden min-h-[calc(100vh-200px)] md:min-h-0 flex flex-col">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-coral/10 to-transparent rounded-full blur-2xl"></div>

              <div className="relative z-10 flex-1 flex flex-col">
                {/* Business Profile Picture */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex justify-center mb-4 md:mb-6"
                >
                  <div className="relative group">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden ring-4 ring-sage/20 group-hover:ring-sage/40 transition-all duration-500">
                      {business.image_url ? (
                        <Image
                          src={business.image_url}
                          alt={`${businessName} photo`}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-sage/20 to-sage/10 flex items-center justify-center">
                          <ion-icon name="business" style={{ fontSize: '32px', color: 'var(--sage)' }} />
                        </div>
                      )}
                      {/* Shimmer overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>
                    </div>

                    {/* Rating badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className="absolute -bottom-2 -right-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full p-2 shadow-lg"
                    >
                      <div className="flex items-center space-x-1">
                        <ion-icon name="star" style={{ color: 'white', fontSize: '12px' }} />
                        <span className="font-urbanist text-xs font-700 text-white">
                          {business.stats?.average_rating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="font-urbanist text-2xl md:text-5xl font-700 text-transparent bg-clip-text bg-gradient-to-r from-charcoal via-sage to-charcoal mb-6 md:mb-8 text-center"
                >
                  Write a Review for {businessName}
                </motion.h2>

                {/* Overall Rating */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="mb-8"
                >
                  <h3 className="font-urbanist text-lg md:text-3xl font-600 text-charcoal mb-3 md:mb-4 flex items-center justify-center md:justify-start">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                      className="w-6 h-6 bg-gradient-to-br from-coral/20 to-coral/10 rounded-full flex items-center justify-center mr-3"
                    >
                      <ion-icon name="star" style={{ color: 'var(--coral)', fontSize: '16px' }} />
                    </motion.div>
                    Overall rating
                  </h3>
                  <div className="flex items-center justify-center space-x-1 md:space-x-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 md:p-2 focus:outline-none transition-all duration-300 rounded-full hover:bg-sage/10"
                      >
                        <ion-icon
                          name={star <= overallRating ? "star" : "star-outline"}
                          style={{
                            color: star <= overallRating ? "var(--sage)" : "#9ca3af",
                            fontSize: "2rem"
                          }}
                        ></ion-icon>
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-center font-urbanist text-[14px] font-400 text-charcoal/60">
                    Tap to select rating
                  </p>
                </motion.div>

                {/* Quick Tags */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="mb-8"
                >
                  <h3 className="font-urbanist text-lg md:text-3xl font-600 text-charcoal mb-3 md:mb-4 flex items-center justify-center md:justify-start">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="w-6 h-6 bg-gradient-to-br from-sage/20 to-sage/10 rounded-full flex items-center justify-center mr-3"
                    >
                      <ion-icon name="pricetags-outline" style={{ color: 'var(--sage)', fontSize: '16px' }} />
                    </motion.div>
                    Choose up to 4 quick tags
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                    {quickTags.map((tag, index) => (
                      <motion.button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + (index * 0.1), duration: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          px-4 md:px-6 py-2 md:py-3 rounded-full border-2 transition-all duration-300 font-urbanist text-[14px] font-600
                          ${selectedTags.includes(tag)
                            ? 'bg-sage border-sage text-white shadow-lg'
                            : 'bg-white/80 backdrop-blur-sm border-sage/20 text-charcoal hover:border-sage hover:bg-sage/10'
                          }
                          focus:outline-none focus:ring-2 focus:ring-sage/50 focus:ring-offset-2
                        `}
                      >
                        {tag}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Review Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.6 }}
                  className="mb-6"
                >
                  <h3 className="font-urbanist text-lg md:text-2xl font-600 text-charcoal mb-3 flex items-center justify-center md:justify-start">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                      className="w-6 h-6 bg-gradient-to-br from-sage/20 to-sage/10 rounded-full flex items-center justify-center mr-3"
                    >
                      <ion-icon name="pencil-outline" style={{ color: 'var(--sage)', fontSize: '16px' }} />
                    </motion.div>
                    Review Title (Optional)
                  </h3>
                  <motion.input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    placeholder="Summarize your experience in a few words..."
                    whileFocus={{ scale: 1.01 }}
                    className="w-full bg-white/80 backdrop-blur-sm border border-sage/20 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 font-urbanist text-[14px] md:text-lg font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all duration-300 shadow-sm"
                  />
                </motion.div>

                {/* Review Text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="mb-8"
                >
                  <h3 className="font-urbanist text-lg md:text-3xl font-600 text-charcoal mb-3 md:mb-4 flex items-center justify-center md:justify-start">
                    <motion.div
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                      className="w-6 h-6 bg-gradient-to-br from-coral/20 to-coral/10 rounded-full flex items-center justify-center mr-3"
                    >
                      <ion-icon name="create-outline" style={{ color: 'var(--coral)', fontSize: '16px' }} />
                    </motion.div>
                    Tell us about your experience
                  </h3>
                  <motion.textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your thoughts and help other locals..."
                    rows={4}
                    whileFocus={{ scale: 1.02 }}
                    className="w-full bg-white/80 backdrop-blur-sm border border-sage/20 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 font-urbanist text-[14px] md:text-xl font-400 text-charcoal placeholder-charcoal/50 focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all duration-300 resize-none shadow-sm flex-1 min-h-[120px] md:min-h-0"
                  />
                </motion.div>

                {/* Image Upload */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85, duration: 0.6 }}
                  className="mb-8"
                >
                  <h3 className="font-urbanist text-lg md:text-3xl font-600 text-charcoal mb-3 md:mb-4 flex items-center justify-center md:justify-start">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                      className="w-6 h-6 bg-gradient-to-br from-sage/20 to-sage/10 rounded-full flex items-center justify-center mr-3"
                    >
                      <ion-icon name="camera-outline" style={{ color: 'var(--sage)', fontSize: '16px' }} />
                    </motion.div>
                    Add Photos (Optional)
                  </h3>
                  <ImageUpload
                    onImagesChange={setSelectedImages}
                    maxImages={5}
                    disabled={submitting}
                  />
                </motion.div>


                {/* Submit Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  whileHover={isFormValid && !submitting ? { scale: 1.02, y: -2 } : {}}
                  whileTap={isFormValid && !submitting ? { scale: 0.98 } : {}}
                  onClick={handleSubmitReview}
                  className={`
                    w-full py-4 md:py-5 px-6 md:px-8 rounded-xl md:rounded-2xl font-urbanist text-base md:text-2xl font-600 transition-all duration-300 relative overflow-hidden
                    ${isFormValid && !submitting
                      ? 'bg-gradient-to-r from-sage to-sage/90 text-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sage/50 focus:ring-offset-2 group'
                      : 'bg-charcoal/20 text-charcoal/40 cursor-not-allowed'
                    }
                  `}
                  disabled={!isFormValid || submitting}
                >
                  {isFormValid && !submitting && (
                    <motion.div
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {submitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Review</span>
                        {isFormValid && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                          >
                            <ion-icon name="arrow-forward-outline" />
                          </motion.div>
                        )}
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </div>
          </PremiumHover>
        </FadeInUp>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}