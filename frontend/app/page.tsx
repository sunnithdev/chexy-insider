"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkUserScore = async () => {
      if (!isLoaded || !userId) return;

      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");

        const userScoreDoc = await getDoc(doc(db, "users_scores", userId));

        if (userScoreDoc.exists()) {
          const data = userScoreDoc.data();
          const creditScore = data.creditScore;

          if (creditScore < 700) {
            router.push("/blocked");
          } else {
            router.push("/dashboard");
          }
        } else {
          router.push("/enter-score");
        }
      } catch (error) {
        router.push("/enter-score");
      }
    };

    checkUserScore();
  }, [isLoaded, userId, router]);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <main className="flex max-w-4xl flex-col items-center gap-8 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Chexy Insider
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Where Credit Meets Opportunity
          </p>
        </div>

        <p className="max-w-2xl text-lg leading-relaxed text-gray-700">
          Turn your rent and bill payments into rewards. Build your trust score
          and unlock exclusive benefits with every payment you make.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/sign-up">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-2 text-3xl">💳</div>
            <h3 className="mb-2 font-semibold text-gray-900">Earn Rewards</h3>
            <p className="text-sm text-gray-600">
              Get points on every rent, tax, and utility payment
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-2 text-3xl">📊</div>
            <h3 className="mb-2 font-semibold text-gray-900">Build Trust</h3>
            <p className="text-sm text-gray-600">
              Improve your trust score with consistent payments
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-2 text-3xl">🎁</div>
            <h3 className="mb-2 font-semibold text-gray-900">
              Redeem Benefits
            </h3>
            <p className="text-sm text-gray-600">
              Exchange points for rent discounts and gift cards
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
