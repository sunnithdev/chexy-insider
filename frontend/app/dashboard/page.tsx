"use client";

import { useEffect, useState } from "react";
import { SignOutButton, useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Award, Calendar, DollarSign, ArrowRight, Sparkles } from "lucide-react";
import { ChatBox } from "@/components/ChatBox";
import Link from "next/link";

interface Transaction {
    id: string;
    type: string;
    amount: number;
    pointsEarned: number;
    createdAt: string;
}

interface Rewards {
    points: number;
    totalEarned: number;
    totalRedeemed: number;
}

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const router = useRouter();
    const [creditScore, setCreditScore] = useState<number | null>(null);
    const [rewards, setRewards] = useState<Rewards>({
        points: 0,
        totalEarned: 0,
        totalRedeemed: 0,
    });
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    // Payment modal state
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [paymentType, setPaymentType] = useState<"rent" | "tax" | "utility">("rent");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchDashboardData = async () => {
        if (!isLoaded || !user?.id) return;

        try {
            const { doc, getDoc } = await import("firebase/firestore");
            const { db } = await import("@/lib/firebase");

            const userScoreDoc = await getDoc(doc(db, "users_scores", user.id));

            if (userScoreDoc.exists()) {
                const data = userScoreDoc.data();
                setCreditScore(data.creditScore);

                if (data.creditScore < 700) {
                    router.push("/blocked");
                    return;
                }
            } else {
                router.push("/enter-score");
                return;
            }

            const token = await getToken();

            const [rewardsRes, transactionsRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/rewards`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            if (rewardsRes.ok) {
                const rewardsData = await rewardsRes.json();
                setRewards(rewardsData);
            }

            if (transactionsRes.ok) {
                const transactionsData = await transactionsRes.json();
                setTransactions(transactionsData.transactions || []);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [isLoaded, user]);

    const openPaymentModal = (type: "rent" | "tax" | "utility") => {
        setPaymentType(type);
        setPaymentModalOpen(true);
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = await getToken();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/transactions`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        type: paymentType,
                        amount: parseFloat(paymentAmount),
                    }),
                }
            );

            if (response.ok) {
                setPaymentModalOpen(false);
                setPaymentAmount("");
                await fetchDashboardData();
            }
        } catch (error) {
            console.error("Payment error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case "rent":
                return "🏠";
            case "tax":
                return "💰";
            case "utility":
                return "⚡";
            default:
                return "💳";
        }
    };

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case "rent":
                return "bg-blue-100 text-blue-800";
            case "tax":
                return "bg-orange-100 text-orange-800";
            case "utility":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
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
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                Welcome back, {user?.firstName || "User"}
                            </h1>
                            <p className="mt-1 text-gray-600">
                                Manage your payments and rewards
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/rewards">
                                <Button variant="outline" className="gap-2">
                                    <Award className="h-4 w-4" />
                                    Rewards
                                </Button>
                            </Link>
                            <SignOutButton>
                                <Button variant="outline">Sign Out</Button>
                            </SignOutButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* Stats Cards */}
                <div className="mb-8 grid gap-6 md:grid-cols-2">
                    {/* Credit Score Card */}
                    <Card className="border border-gray-200">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Credit Score
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-gray-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-gray-900">
                                {creditScore}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                Premium member
                            </p>
                        </CardContent>
                    </Card>

                    {/* Rewards Card */}
                    <Card className="border border-gray-200">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Reward Points
                                </CardTitle>
                                <Award className="h-4 w-4 text-gray-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-gray-900">
                                {rewards.points.toLocaleString()}
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                {rewards.totalEarned.toLocaleString()} total earned
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="mb-8">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-blue-600" />
                            <CardTitle>Make a Payment</CardTitle>
                        </div>
                        <CardDescription>
                            Earn 25% reward points on every payment
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-3">
                        <Button
                            className="group h-12 bg-gray-900 text-base font-medium hover:bg-gray-800"
                            onClick={() => openPaymentModal("rent")}
                        >
                            Pay Rent
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                        <Button
                            className="group h-12 bg-gray-900 text-base font-medium hover:bg-gray-800"
                            onClick={() => openPaymentModal("tax")}
                        >
                            Pay Tax
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                        <Button
                            className="group h-12 bg-gray-900 text-base font-medium hover:bg-gray-800"
                            onClick={() => openPaymentModal("utility")}
                        >
                            Pay Utility
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>
                                    Your latest transactions
                                </CardDescription>
                            </div>
                            <Link href="/transactions">
                                <Button variant="outline" size="sm">
                                    View All
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {transactions.length === 0 ? (
                            <div className="py-12 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                    <DollarSign className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-lg font-semibold text-gray-900">
                                    No transactions yet
                                </p>
                                <p className="mt-1 text-sm text-gray-600">
                                    Make your first payment to start earning rewards
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {transactions.slice(0, 3).map((tx) => (
                                    <div
                                        key={tx.id}
                                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="text-3xl">{getTypeIcon(tx.type)}</div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getTypeColor(
                                                            tx.type
                                                        )}`}
                                                    >
                                                        {tx.type}
                                                    </span>
                                                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                                        completed
                                                    </span>
                                                </div>
                                                <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(tx.createdAt).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                                                <DollarSign className="h-4 w-4" />
                                                {tx.amount.toFixed(2)}
                                            </div>
                                            <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-orange-600">
                                                <Award className="h-3 w-3" />
                                                +{tx.pointsEarned} pts
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Payment Modal */}
            <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            {paymentType === "rent" && "Pay Rent"}
                            {paymentType === "tax" && "Pay Tax"}
                            {paymentType === "utility" && "Pay Utility"}
                        </DialogTitle>
                        <DialogDescription>
                            Earn 25% reward points on this payment
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePayment} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Enter amount"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                required
                                disabled={submitting}
                                className="h-12 text-lg"
                            />
                            <p className="text-sm text-gray-600">
                                You'll earn{" "}
                                <span className="font-semibold text-orange-600">
                                    {Math.floor(parseFloat(paymentAmount || "0") * 0.25)} points
                                </span>
                            </p>
                        </div>
                        <Button
                            type="submit"
                            className="h-12 w-full text-base font-semibold"
                            disabled={submitting}
                        >
                            {submitting ? "Processing..." : "Submit Payment"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* AI Chatbox */}
            <ChatBox />
        </div>
    );
}