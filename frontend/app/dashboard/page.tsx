"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TrendingUp, Award, Activity } from "lucide-react";

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [creditScore, setCreditScore] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserScore = async () => {
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
                    }
                } else {
                    router.push("/enter-score");
                }
            } catch (error) {
                console.error("Error fetching user score:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserScore();
    }, [isLoaded, user, router]);

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
                    <Button variant="outline" onClick={() => router.push("/")}>
                        Home
                    </Button>
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
                            <p className="mt-2 text-sm text-gray-600">
                                Excellent standing
                            </p>
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
                            <div className="text-4xl font-bold text-purple-600">0</div>
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
                        <Button className="w-full" disabled>
                            Pay Rent
                        </Button>
                        <Button className="w-full" variant="outline" disabled>
                            Pay Tax
                        </Button>
                        <Button className="w-full" variant="outline" disabled>
                            Pay Utility
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>
                            Your payment history
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-gray-500">No transactions yet</p>
                            <p className="mt-2 text-sm text-gray-400">
                                Make your first payment to get started
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
