"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Gift, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

interface Rewards {
    points: number;
    totalEarned: number;
    totalRedeemed: number;
}

interface RewardItem {
    id: string;
    name: string;
    description: string;
    pointsCost: number;
    icon: string;
}

const REWARD_ITEMS: RewardItem[] = [
    {
        id: "rent-discount-50",
        name: "$50 Rent Discount",
        description: "Apply $50 off your next rent payment",
        pointsCost: 200,
        icon: "🏠",
    },
    {
        id: "amazon-25",
        name: "$25 Amazon Gift Card",
        description: "Redeem for Amazon shopping",
        pointsCost: 100,
        icon: "🎁",
    },
    {
        id: "utility-credit-30",
        name: "$30 Utility Credit",
        description: "Credit towards your utility bills",
        pointsCost: 120,
        icon: "⚡",
    },
    {
        id: "amazon-50",
        name: "$50 Amazon Gift Card",
        description: "Redeem for Amazon shopping",
        pointsCost: 200,
        icon: "🎁",
    },
    {
        id: "rent-discount-100",
        name: "$100 Rent Discount",
        description: "Apply $100 off your next rent payment",
        pointsCost: 400,
        icon: "🏠",
    },
    {
        id: "amazon-100",
        name: "$100 Amazon Gift Card",
        description: "Redeem for Amazon shopping",
        pointsCost: 400,
        icon: "🎁",
    },
];

export default function RewardsPage() {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const router = useRouter();
    const [rewards, setRewards] = useState<Rewards>({
        points: 0,
        totalEarned: 0,
        totalRedeemed: 0,
    });
    const [loading, setLoading] = useState(true);
    const [redeeming, setRedeeming] = useState<string | null>(null);

    useEffect(() => {
        fetchRewards();
    }, [isLoaded, user]);

    const fetchRewards = async () => {
        if (!isLoaded || !user?.id) return;

        try {
            const token = await getToken();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rewards`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setRewards(data);
            }
        } catch (error) {
            console.error("Error fetching rewards:", error);
        } finally {
            setLoading(false);
        }
    };

    const triggerConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);
    };

    const handleRedeem = async (item: RewardItem) => {
        if (rewards.points < item.pointsCost) {
            alert("Not enough points!");
            return;
        }

        setRedeeming(item.id);

        // Simulate redemption (you can add backend API call here)
        setTimeout(() => {
            triggerConfetti();
            setRewards((prev) => ({
                ...prev,
                points: prev.points - item.pointsCost,
                totalRedeemed: prev.totalRedeemed + item.pointsCost,
            }));
            setRedeeming(null);
        }, 1000);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm" className="mb-2">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Dashboard
                                </Button>
                            </Link>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                Redeem Rewards
                            </h1>
                            <p className="mt-1 text-gray-600">
                                Exchange your points for amazing rewards
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* Points Balance */}
                <Card className="mb-8 border-2 border-gray-900 bg-gray-900 text-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400">
                                    Available Points
                                </p>
                                <div className="mt-1 flex items-baseline gap-2">
                                    <span className="text-5xl font-bold">
                                        {rewards.points.toLocaleString()}
                                    </span>
                                    <Award className="h-6 w-6 text-gray-400" />
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-400">Total Earned</p>
                                <p className="text-2xl font-bold">
                                    {rewards.totalEarned.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Rewards Grid */}
                <div className="mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-gray-600" />
                    <h2 className="text-xl font-bold text-gray-900">Available Rewards</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {REWARD_ITEMS.map((item) => {
                        const canAfford = rewards.points >= item.pointsCost;
                        const isRedeeming = redeeming === item.id;

                        return (
                            <Card
                                key={item.id}
                                className={`transition-all ${canAfford
                                        ? "border-gray-200 hover:shadow-lg"
                                        : "border-gray-100 opacity-60"
                                    }`}
                            >
                                <CardHeader>
                                    <div className="mb-2 text-4xl">{item.icon}</div>
                                    <CardTitle className="text-lg">{item.name}</CardTitle>
                                    <CardDescription>{item.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4 flex items-center gap-2">
                                        <Award className="h-4 w-4 text-gray-500" />
                                        <span className="text-lg font-bold text-gray-900">
                                            {item.pointsCost.toLocaleString()} points
                                        </span>
                                    </div>
                                    <Button
                                        className="w-full"
                                        disabled={!canAfford || isRedeeming}
                                        onClick={() => handleRedeem(item)}
                                    >
                                        {isRedeeming ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                <span>Redeeming...</span>
                                            </div>
                                        ) : canAfford ? (
                                            "Redeem Now"
                                        ) : (
                                            `Need ${(item.pointsCost - rewards.points).toLocaleString()} more`
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Empty State */}
                {rewards.points === 0 && (
                    <Card className="mt-8">
                        <CardContent className="py-12 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                <Gift className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                No points yet
                            </h3>
                            <p className="mb-4 text-gray-600">
                                Make payments to start earning reward points
                            </p>
                            <Link href="/dashboard">
                                <Button>Go to Dashboard</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
