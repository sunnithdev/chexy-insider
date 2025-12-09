"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Gift, Shield } from "lucide-react";

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

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold tracking-tight">
            chexy insider<span className="text-blue-600">.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="group font-medium">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <Sparkles className="h-4 w-4" />
            <span>Exclusive rewards for premium members</span>
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 max-w-4xl text-6xl font-bold leading-tight tracking-tight text-gray-900 sm:text-7xl lg:text-8xl">
            where credit
            <br />
            meets
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
              opportunity.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mb-12 max-w-2xl text-xl leading-relaxed text-gray-600 sm:text-2xl">
            An exclusive platform for premium members. Turn your rent, tax, and utility payments into valuable rewards.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="group h-14 px-8 text-lg font-semibold"
              >
                Start earning now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg font-semibold"
              >
                I have an account
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid w-full max-w-3xl grid-cols-3 gap-8 border-t border-gray-100 pt-12">
            <div>
              <div className="text-4xl font-bold text-gray-900">25%</div>
              <div className="mt-1 text-sm text-gray-600">Points earned</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900">$1000+</div>
              <div className="mt-1 text-sm text-gray-600">Premium rewards</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900">500+</div>
              <div className="mt-1 text-sm text-gray-600">Elite members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-5xl font-bold tracking-tight text-gray-900">
              why chexy?
            </h2>
            <p className="text-xl text-gray-600">
              Premium benefits for qualified members
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="group rounded-3xl bg-white p-8 transition-all hover:shadow-xl">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                <TrendingUp className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                Earn on every payment
              </h3>
              <p className="text-lg leading-relaxed text-gray-600">
                Earn 25% of your payment amount as premium reward points. Pay $1000
                rent, earn 250 points instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group rounded-3xl bg-white p-8 transition-all hover:shadow-xl">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
                <Shield className="h-7 w-7 text-orange-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                Build your trust score
              </h3>
              <p className="text-lg leading-relaxed text-gray-600">
                Consistent payments improve your trust score, unlocking even better
                rewards and exclusive member benefits.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group rounded-3xl bg-white p-8 transition-all hover:shadow-xl">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
                <Gift className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                Redeem amazing rewards
              </h3>
              <p className="text-lg leading-relaxed text-gray-600">
                Exchange points for premium rent discounts, Amazon gift cards, and
                utility credits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-5xl font-bold tracking-tight text-gray-900">
              how it works
            </h2>
            <p className="text-xl text-gray-600">Simple. Rewarding. Automatic.</p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Make a payment
              </h3>
              <p className="text-gray-600">
                Pay your rent, taxes, or utilities through Chexy
              </p>
            </div>

            <div className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-600 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Earn points
              </h3>
              <p className="text-gray-600">
                Get 25% of your payment amount as reward points
              </p>
            </div>

            <div className="text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Redeem rewards
              </h3>
              <p className="text-gray-600">
                Exchange points for discounts and gift cards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-orange-600 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-6 text-5xl font-bold tracking-tight text-white">
            ready to start earning?
          </h2>
          <p className="mb-10 text-xl text-blue-100">
            Join our exclusive community of premium members already earning rewards
          </p>
          <Link href="/sign-up">
            <Button
              size="lg"
              className="group h-14 bg-white px-8 text-lg font-semibold text-blue-600 hover:bg-gray-100"
            >
              Get started for free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mb-4 text-2xl font-bold tracking-tight">
            chexy insider<span className="text-blue-600">.</span>
          </div>
          <p className="text-sm text-gray-600">
            © 2025 Chexy Insider. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
