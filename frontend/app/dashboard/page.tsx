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
import { TrendingUp, Award, Activity, Calendar, DollarSign } from "lucide-react";
import { ChatBox } from "@/components/ChatBox";

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
    }, [isLoaded, user, router, getToken]);

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = await getToken();
            const amount = parseFloat(paymentAmount);

            if (isNaN(amount) || amount <= 0) {
                alert("Please enter a valid amount");
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    type: paymentType,
                    amount,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Payment successful! You earned ${data.transaction.pointsEarned} points!`);
                setPaymentModalOpen(false);
                setPaymentAmount("");
                await fetchDashboardData();
            } else {
                const error = await response.json();
                alert(`Payment failed: ${error.message}`);
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("Payment failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case "rent":
                return "bg-blue-100 text-blue-800";
            case "tax":
                return "bg-purple-100 text-purple-800";
            case "utility":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case "rent":
                return "🏠";
            case "tax":
                return "📋";
            case "utility":
                return "⚡";
            default:
                return "💳";
        }
    };

    const openPaymentModal = (type: "rent" | "tax" | "utility") => {
        setPaymentType(type);
        setPaymentModalOpen(true);
    };

    if (!isLoaded || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="mx-auto max-w-6xl space-y-6 py-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome, {user?.firstName || "User"}
                        </h1>
                        <p className="text-gray-600">Chexy Insider Dashboard</p>
                    </div>
                    <SignOutButton>
                        <Button variant="outline">Sign Out</Button>
                    </SignOutButton>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                                Credit Score
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-blue-600">
                                {creditScore}
                            </div>
                            <p className="mt-2 text-sm text-gray-600">Excellent standing</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Award className="h-5 w-5 text-purple-600" />
                                Reward Points
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-purple-600">
                                {rewards.points}
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                                Make payments to earn
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Activity className="h-5 w-5 text-green-600" />
                                Trust Score
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-green-600">--</div>
                            <p className="mt-2 text-sm text-gray-600">
                                Build with transactions
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Make a payment to start earning rewards
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-3">
                        <Button className="w-full" onClick={() => openPaymentModal("rent")}>
                            Pay Rent
                        </Button>
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => openPaymentModal("tax")}
                        >
                            Pay Tax
                        </Button>
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => openPaymentModal("utility")}
                        >
                            Pay Utility
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Transactions</CardTitle>
                                <CardDescription>Last 3 transactions</CardDescription>
                            </div>
                            {transactions.length > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push("/transactions")}
                                >
                                    View All
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {transactions.length > 0 ? (
                            <div className="space-y-3">
                                {transactions.slice(0, 3).map((tx) => (
                                    <div
                                        key={tx.id}
                                        className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="text-3xl">
                                                {getTypeIcon(tx.type)}
                                            </div>
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
                                                    {new Date(
                                                        tx.createdAt
                                                    ).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                                                <DollarSign className="h-4 w-4" />
                                                {tx.amount.toFixed(2)}
                                            </div>
                                            <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-purple-600">
                                                <Award className="h-3 w-3" />+
                                                {tx.pointsEarned} pts
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <p className="text-gray-500">No transactions yet</p>
                                <p className="mt-2 text-sm text-gray-400">
                                    Make your first payment to get started
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Payment Modal */}
            <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Make a Payment</DialogTitle>
                        <DialogDescription>
                            Enter the amount for your {paymentType} payment
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="amount">Amount ($)</Label>
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
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                You'll earn {Math.floor(parseFloat(paymentAmount || "0") * 0.25)} points
                            </p>
                        </div>
                        <Button type="submit" className="w-full" disabled={submitting}>
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