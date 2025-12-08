"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Calendar, DollarSign, Award } from "lucide-react";

interface Transaction {
    id: string;
    type: string;
    amount: number;
    pointsEarned: number;
    status: string;
    createdAt: string;
}

export default function TransactionsPage() {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!isLoaded || !user?.id) return;

            try {
                const token = await getToken();
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/transactions`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setTransactions(data.transactions || []);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [isLoaded, user, getToken]);

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

    if (!isLoaded || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-lg">Loading transactions...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="mx-auto max-w-4xl space-y-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/dashboard")}
                            className="mb-4 -ml-2"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Transaction History
                        </h1>
                        <p className="text-gray-600">
                            View all your payment transactions
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Transactions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {transactions.length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Spent
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                $
                                {transactions
                                    .reduce((sum, tx) => sum + tx.amount, 0)
                                    .toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Points Earned
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                {transactions.reduce(
                                    (sum, tx) => sum + tx.pointsEarned,
                                    0
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Transactions List */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Transactions</CardTitle>
                        <CardDescription>
                            Complete history of your payments and rewards
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {transactions.length > 0 ? (
                            <div className="space-y-3">
                                {transactions.map((tx) => (
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
                                                        {tx.status}
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
                                <div className="mb-4 text-6xl">📭</div>
                                <p className="text-lg font-medium text-gray-700">
                                    No transactions yet
                                </p>
                                <p className="mt-2 text-sm text-gray-500">
                                    Make your first payment to start earning rewards
                                </p>
                                <Button
                                    onClick={() => router.push("/dashboard")}
                                    className="mt-6"
                                >
                                    Go to Dashboard
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
