"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Sparkles, TrendingUp } from "lucide-react";

export default function EnterScorePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [score, setScore] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const scoreNum = parseInt(score, 10);

    if (!score || isNaN(scoreNum)) {
      setError("Please enter a valid credit score");
      return;
    }

    if (scoreNum < 300 || scoreNum > 900) {
      setError("Credit score must be between 300 and 900");
      return;
    }

    if (!user?.id) {
      setError("User not authenticated");
      return;
    }

    setIsSubmitting(true);

    try {
      const { doc, setDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      const savePromise = setDoc(doc(db, "users_scores", user.id), {
        userId: user.id,
        creditScore: scoreNum,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 10000)
      );

      await Promise.race([savePromise, timeoutPromise]);

      if (scoreNum < 700) {
        router.push("/blocked");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to save: ${err.message}`);
      } else {
        setError("Failed to save credit score. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-12">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
          <Shield className="h-4 w-4" />
          <span>Premium membership verification</span>
        </div>

        {/* Headline */}
        <h1 className="mb-4 text-center text-5xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl">
          verify your
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
            eligibility.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mb-12 max-w-lg text-center text-xl text-gray-600">
          Chexy Insider is an exclusive platform for premium members. Enter your credit score to verify access.
        </p>

        {/* Score Input */}
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <div className="space-y-3">
            <label htmlFor="score" className="text-sm font-medium text-gray-700">
              Your Credit Score
            </label>
            <Input
              id="score"
              type="number"
              min="300"
              max="900"
              placeholder="Enter your score"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
              disabled={isSubmitting}
              className="h-14 text-center text-2xl font-bold"
            />
            <p className="text-center text-sm text-gray-500">
              Score range: 300 - 900
            </p>
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-center">
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="h-14 w-full text-lg font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify Eligibility"
            )}
          </Button>
        </form>

        {/* Benefits */}
        <div className="mt-16 w-full max-w-md space-y-4">
          <p className="text-center text-sm font-medium text-gray-500">
            Premium members enjoy:
          </p>
          <div className="grid gap-4">
            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">25% Rewards</h3>
                <p className="text-sm text-gray-600">
                  Earn points on every payment
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                <Sparkles className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Exclusive Access</h3>
                <p className="text-sm text-gray-600">
                  Premium rewards and benefits
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
