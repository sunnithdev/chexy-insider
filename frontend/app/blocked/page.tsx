"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function BlockedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-12">
                {/* Icon */}
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                    <Shield className="h-10 w-10 text-gray-400" />
                </div>

                {/* Headline */}
                <h1 className="mb-4 text-center text-5xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl">
                    almost there.
                </h1>

                {/* Subheadline */}
                <p className="mb-8 max-w-lg text-center text-xl text-gray-600">
                    Chexy Insider is an exclusive platform for premium members with exceptional credit profiles.
                </p>

                {/* Requirement Card */}
                <div className="mb-12 w-full max-w-md rounded-2xl border-2 border-gray-200 bg-gray-50 p-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Membership Requirement
                        </h2>
                        <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                            Premium
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-gray-900">700+</span>
                        <span className="text-lg text-gray-600">credit score</span>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                        Our platform is designed for members with credit scores of 700 or higher to ensure the best rewards and benefits.
                    </p>
                </div>

                {/* Build Your Score Section */}
                <div className="w-full max-w-md space-y-6">
                    <h3 className="text-center text-lg font-semibold text-gray-900">
                        Build your credit score
                    </h3>

                    <div className="space-y-3">
                        <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                1
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Pay bills on time</h4>
                                <p className="text-sm text-gray-600">
                                    Consistent, timely payments are the biggest factor
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">
                                2
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Lower credit utilization</h4>
                                <p className="text-sm text-gray-600">
                                    Keep balances below 30% of your credit limit
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
                                3
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Monitor your credit</h4>
                                <p className="text-sm text-gray-600">
                                    Check for errors and track your progress regularly
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="mt-12 flex w-full max-w-md flex-col gap-3">
                    <Button
                        onClick={() => router.push("/enter-score")}
                        className="group h-12 text-base font-semibold"
                    >
                        Re-verify My Score
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Link href="/" className="w-full">
                        <Button
                            variant="outline"
                            className="h-12 w-full text-base font-semibold"
                        >
                            Back to Home
                        </Button>
                    </Link>
                </div>

                {/* Footer Note */}
                <p className="mt-12 text-center text-sm text-gray-500">
                    Questions? Contact us at{" "}
                    <a href="mailto:support@chexyinsider.com" className="font-medium text-blue-600 hover:underline">
                        support@chexyinsider.com
                    </a>
                </p>
            </div>
        </div>
    );
}
