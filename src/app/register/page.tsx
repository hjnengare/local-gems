"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { motion } from "framer-motion";
import FadeInUp from "../components/Animations/FadeInUp";
import PremiumHover from "../components/Animations/PremiumHover";

// Detect reduced motion preference
const prefersReduced = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reusable form field component
interface FormFieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  inputMode?: string;
  error?: string;
  success?: string;
  icon?: string;
  disabled?: boolean;
  ariaDescribedBy?: string;
}

const FormField = ({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  autoComplete,
  inputMode,
  error,
  success,
  icon,
  disabled,
  ariaDescribedBy
}: FormFieldProps) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-500 text-charcoal dark:text-gray-100">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-describedby={ariaDescribedBy}
        aria-invalid={!!error}
        className={`w-full h-11 rounded-xl border bg-white dark:bg-gray-800 px-4 ${
          icon ? 'pr-10' : 'pr-4'
        } focus:outline-none focus:ring-4 text-charcoal dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
            : success
            ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20'
            : 'border-gray-300 dark:border-gray-600 focus:border-sage focus:ring-sage/20'
        }`}
      />
      {icon && (
        <ion-icon
          name={icon}
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        />
      )}
    </div>
    <div className="h-5 mt-1">
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1" role="alert">
          <ion-icon name="alert-circle" style={{ fontSize: '12px' }} />
          {error}
        </p>
      )}
      {success && !error && (
        <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1" role="status">
          <ion-icon name="checkmark-circle" style={{ fontSize: '12px' }} />
          {success}
        </p>
      )}
    </div>
  </div>
);

// Password field with show/hide toggle
interface PasswordFieldProps extends Omit<FormFieldProps, 'type' | 'icon'> {
  showPassword: boolean;
  onTogglePassword: () => void;
  strengthScore: number;
  strengthFeedback: string;
  strengthColor: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
  };
}

const PasswordField = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  autoComplete,
  error,
  disabled,
  ariaDescribedBy,
  showPassword,
  onTogglePassword,
  strengthScore,
  strengthFeedback,
  strengthColor,
  checks
}: PasswordFieldProps) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-500 text-charcoal dark:text-gray-100">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-describedby={ariaDescribedBy}
        aria-invalid={!!error}
        className={`w-full h-11 rounded-xl border bg-white dark:bg-gray-800 px-4 pr-10 focus:outline-none focus:ring-4 text-charcoal dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
            : 'border-gray-300 dark:border-gray-600 focus:border-sage focus:ring-sage/20'
        }`}
      />
      <button
        type="button"
        onClick={onTogglePassword}
        aria-label={showPassword ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-charcoal dark:hover:text-gray-300 transition-colors"
      >
        <ion-icon name={showPassword ? "eye-off-outline" : "eye-outline"} />
      </button>
    </div>

    {/* Password strength indicator - single line */}
    {value.length > 0 && (
      <div className="h-5 mt-1 flex items-center gap-2">
        <div className="flex-1 flex gap-1" role="progressbar" aria-valuenow={strengthScore} aria-valuemin={0} aria-valuemax={4}>
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                level <= strengthScore
                  ? level === 1
                    ? 'bg-red-400'
                    : level === 2
                    ? 'bg-orange-400'
                    : level === 3
                    ? 'bg-yellow-400'
                    : 'bg-green-400'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
        {strengthFeedback && (
          <span className={`text-xs font-500 ${strengthColor}`}>
            {strengthFeedback}
          </span>
        )}
      </div>
    )}

    {error && (
      <div className="h-5 mt-1">
        <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1" role="alert">
          <ion-icon name="alert-circle" style={{ fontSize: '12px' }} />
          {error}
        </p>
      </div>
    )}
  </div>
);

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [consent, setConsent] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false
    }
  });

  const { register, isLoading, error: authError } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const containerRef = useRef(null);

  // Offline detection
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) return "🔐 Password must be at least 8 characters long";
    if (!/(?=.*[a-z])/.test(password)) return "🔐 Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "🔐 Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "🔐 Password must contain at least one number";
    return null;
  };

  const checkPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /(?=.*[A-Z])/.test(password),
      lowercase: /(?=.*[a-z])/.test(password),
      number: /(?=.*\d)/.test(password)
    };

    // Additional security checks
    const emailName = email.split('@')[0].toLowerCase();
    const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123'];
    const hasCommonWord = commonPasswords.some(common => password.toLowerCase().includes(common));
    const usesEmailName = emailName.length > 2 && password.toLowerCase().includes(emailName);

    let score = Object.values(checks).filter(Boolean).length;
    let feedback = "";
    let color = "";

    // Penalize common patterns
    if (hasCommonWord) {
      score = Math.max(0, score - 1);
      feedback = "Avoid common passwords";
      color = "text-red-500";
    } else if (usesEmailName) {
      score = Math.max(0, score - 1);
      feedback = "Don't use your email name";
      color = "text-orange-500";
    } else if (password.length === 0) {
      feedback = "";
      color = "";
    } else if (score === 1) {
      feedback = "Weak - Add more requirements";
      color = "text-red-500";
    } else if (score === 2) {
      feedback = "Fair - Getting better";
      color = "text-orange-500";
    } else if (score === 3) {
      feedback = "Good - Almost there";
      color = "text-yellow-500";
    } else if (score === 4) {
      feedback = "Strong - Perfect! 🎉";
      color = "text-green-500";
    }

    return { score, feedback, checks, color };
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError("");

    if (value.length > 0 && !validateEmail(value)) {
      setEmailError("📧 Please enter a valid email address");
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const strength = checkPasswordStrength(value);
    setPasswordStrength(strength);
  };

  // Get helper text for inputs
  const getEmailHelper = () => {
    if (emailError) return "";
    if (email && validateEmail(email)) return "Looks good!";
    return "";
  };

  const getPasswordHelper = () => {
    if (passwordStrength.score === 0) return "";
    if (passwordStrength.score < 3) return "Add a number and uppercase letter";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (submitting || isLoading) return;

    setError("");
    setSubmitting(true);

    try {
      // Enhanced validation
      if (!email?.trim() || !password?.trim()) {
        setError("Please fill in all fields");
        showToast("Please fill in all fields", 'error', 3000);
        return;
      }

      if (!validateEmail(email.trim())) {
        setError("Please enter a valid email address");
        showToast("Please enter a valid email address", 'error', 3000);
        return;
      }

      // Check consent
      if (!consent) {
        setError("Please accept the Terms and Privacy Policy");
        showToast("Please accept the Terms and Privacy Policy", 'error', 3000);
        return;
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        showToast(passwordError, 'error', 4000);
        return;
      }

      // Check password strength
      const strength = checkPasswordStrength(password);
      if (strength.score < 3) {
        setError("Please create a stronger password");
        showToast("Please create a stronger password", 'error', 3000);
        return;
      }

      // Check offline status
      if (!isOnline) {
        setError("You're offline. Please check your connection and try again.");
        showToast("You're offline. Please check your connection and try again.", 'error', 4000);
        return;
      }

      // Attempt registration
      const success = await register(email.trim().toLowerCase(), password);

      if (success) {
        // Clear form
        setEmail("");
        setPassword("");
        setPasswordStrength({
          score: 0,
          feedback: "",
          checks: {
            length: false,
            uppercase: false,
            lowercase: false,
            number: false
          }
        });

        // Show success toast with celebration
        showToast("🎉 Welcome to KLIO! Your account has been created successfully!", 'success', 4000);

        // Navigate to interests page after short delay
        setTimeout(() => {
          showToast("Let's personalize your experience! 🌟", 'info', 2000);
          router.replace("/interests?from=register");
        }, 1500);
      } else {
        // Handle registration failure
        if (authError) {
          if (authError.includes('fetch') || authError.includes('network')) {
            setError('Connection error. Please check your internet connection and try again.');
            showToast('Connection error. Please check your internet connection and try again.', 'error', 4000);
          } else if (authError.includes('already registered') || authError.includes('already exists')) {
            setError('This email is already registered. Try logging in instead.');
            showToast('This email is already registered. Try logging in instead.', 'error', 4000);
          } else {
            setError(authError);
            showToast(authError, 'error', 4000);
          }
        } else {
          setError("Registration failed. Please try again.");
          showToast("Registration failed. Please try again.", 'error', 4000);
        }
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      showToast(errorMessage, 'error', 4000);
    } finally {
      setSubmitting(false);
    }
  };

  // Animation variants
  const cardAnimation = prefersReduced
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 16 };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 dark:from-gray-900 dark:via-gray-900/98 dark:to-gray-900/95 flex flex-col px-4 py-4 sm:py-6 relative overflow-hidden">

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: prefersReduced ? 0.1 : 0.4 }}
        className="absolute top-4 left-4 z-20"
      >
        <Link href="/onboarding" className="text-charcoal/60 dark:text-gray-400 hover:text-charcoal dark:hover:text-gray-200 transition-colors duration-200 p-2 hover:bg-charcoal/5 dark:hover:bg-gray-700/50 rounded-full block">
          <ion-icon name="arrow-back-outline" size="small"></ion-icon>
        </Link>
      </motion.div>

      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center py-6">

        {/* Tighter header block */}
        <div className="text-center mb-6">
          <motion.div
            initial={cardAnimation}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReduced ? 0.1 : 0.6 }}
          >
            <h1 className="font-urbanist text-2xl md:text-3xl font-700 text-charcoal dark:text-gray-100 mb-2">
              Create your account
            </h1>
            <p className="font-urbanist text-sm text-charcoal/70 dark:text-gray-400 leading-relaxed">
              Join KLIO and discover places real locals love
            </p>
          </motion.div>
        </div>

        {/* Form Card */}
        <motion.div
          initial={cardAnimation}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReduced ? 0.1 : 0.6, delay: prefersReduced ? 0 : 0.2 }}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-xl rounded-2xl p-6 space-y-6"
        >

          {/* Fixed height error area */}
          <div className="min-h-[44px]">
            {error && (
              <div role="alert" aria-live="assertive" className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}
            {!isOnline && !error && (
              <div role="status" className="rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 text-sm text-orange-700 dark:text-orange-400">
                You're offline. We'll try again when you're back online.
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-busy={submitting || isLoading}>
            <fieldset disabled={submitting || isLoading} className="space-y-4">

              {/* Email field */}
              <FormField
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                autoComplete="email"
                inputMode="email"
                error={emailError}
                success={getEmailHelper()}
                icon="mail-outline"
                disabled={submitting || isLoading}
              />

              {/* Password field */}
              <PasswordField
                id="password"
                name="new-password"
                label="Password"
                placeholder="Create a strong password"
                value={password}
                onChange={handlePasswordChange}
                autoComplete="new-password"
                error=""
                disabled={submitting || isLoading}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                strengthScore={passwordStrength.score}
                strengthFeedback={passwordStrength.feedback}
                strengthColor={passwordStrength.color}
                checks={passwordStrength.checks}
                ariaDescribedBy="password-strength"
              />

              {/* Compact divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">or continue with</span>
                </div>
              </div>

              {/* Social login buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="h-11 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="text-sm font-600 text-charcoal dark:text-gray-200">Google</span>
                </button>
                <button
                  type="button"
                  className="h-11 rounded-xl border border-gray-900 dark:border-gray-600 bg-black dark:bg-gray-700 hover:bg-black/90 dark:hover:bg-gray-600 flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <span className="text-sm font-600 text-white">Apple</span>
                </button>
              </div>

              {/* Terms consent */}
              <div className="pt-2">
                <label className="flex items-start gap-3 text-xs text-charcoal/70 dark:text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-sage focus:ring-sage/30 focus:ring-offset-0"
                  />
                  <span className="flex-1 leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="underline text-sage hover:text-coral transition-colors">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline text-sage hover:text-coral transition-colors">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Primary CTA */}
              <button
                type="submit"
                disabled={submitting || isLoading || !consent || passwordStrength.score < 3}
                className={`w-full h-12 rounded-2xl font-600 shadow-lg focus:outline-none focus:ring-4 transition-all duration-200 ${
                  submitting || isLoading || !consent || passwordStrength.score < 3
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-sage hover:bg-sage/90 dark:bg-sage dark:hover:bg-sage/90 text-white focus:ring-sage/25 dark:focus:ring-sage/25'
                }`}
                aria-label={submitting || isLoading ? "Creating account..." : "Create account"}
              >
                {submitting || isLoading ? "Creating..." : "Create account"}
              </button>

              {/* Next step hint */}
              <p className="text-xs text-charcoal/60 dark:text-gray-400 text-center">
                Next: pick your interests
              </p>

            </fieldset>
          </form>
        </motion.div>

        {/* Enhanced footer */}
        <div className="text-center mt-4">
          <div className="text-sm text-charcoal/70 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-sage hover:text-coral transition-colors font-600 underline decoration-dotted"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Compact trust indicators */}
        <div className="flex justify-center items-center space-x-6 text-charcoal/60 dark:text-gray-400 text-center pt-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: prefersReduced ? 0.1 : 0.4, delay: prefersReduced ? 0 : 0.6 }}
            className="flex flex-col items-center space-y-1"
          >
            <div className="w-8 h-8 bg-sage/10 dark:bg-sage/20 rounded-full flex items-center justify-center">
              <ion-icon name="shield-checkmark-outline" style={{ color: "#749176" }} size="small" />
            </div>
            <span className="text-xs font-500">Secure</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: prefersReduced ? 0.1 : 0.4, delay: prefersReduced ? 0 : 0.8 }}
            className="flex flex-col items-center space-y-1"
          >
            <div className="w-8 h-8 bg-coral/10 dark:bg-coral/20 rounded-full flex items-center justify-center">
              <ion-icon name="people-outline" style={{ color: "#d67469" }} size="small" />
            </div>
            <span className="text-xs font-500">Community</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: prefersReduced ? 0.1 : 0.4, delay: prefersReduced ? 0 : 1.0 }}
            className="flex flex-col items-center space-y-1"
          >
            <div className="w-8 h-8 bg-charcoal/10 dark:bg-gray-600/20 rounded-full flex items-center justify-center">
              <ion-icon name="star-outline" style={{ color: "#211e1d" }} size="small" />
            </div>
            <span className="text-xs font-500">Quality</span>
          </motion.div>
        </div>

        {/* Trust microcopy */}
        <p className="text-xs text-charcoal/50 dark:text-gray-500 text-center mt-3 px-4">
          We'll never share your email. You can delete your account anytime.
        </p>

      </div>
    </div>
  );
}