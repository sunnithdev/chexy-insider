"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function BlockedPage() {
    const router = useRouter();

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md border-red-200">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-2xl text-red-900">
                        Access Restricted
                    </CardTitle>
                    <CardDescription className="text-base">
                        Your credit score does not meet the minimum requirement to access
                        Chexy Insider features.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg bg-red-50 p-4">
                        <h3 className="mb-2 font-semibold text-red-900">
                            Minimum Requirement
                        </h3>
                        <p className="text-sm text-red-700">
                            A credit score of <strong>700 or higher</strong> is required to
                            access the dashboard and rewards features.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900">
                            How to Improve Your Credit Score:
                        </h3>
                        <ul className="space-y-1 text-sm text-gray-600">
                            <li>• Pay bills on time consistently</li>
                            <li>• Reduce credit card balances</li>
                            <li>• Avoid opening too many new accounts</li>
                            <li>• Check your credit report for errors</li>
                        </ul>
                    </div>

                    <div className="pt-4">
                        <Button
                            onClick={() => router.push("/enter-score")}
                            className="w-full"
                            variant="outline"
                        >
                            Re-enter Credit Score
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
