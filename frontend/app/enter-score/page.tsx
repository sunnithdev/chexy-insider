"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EnterScorePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [score, setScore] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Enter Your Credit Score</CardTitle>
          <CardDescription>
            Please enter your credit score to continue. Your score should be
            between 300 and 900.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="score">Credit Score</Label>
              <Input
                id="score"
                type="number"
                min="300"
                max="900"
                placeholder="Enter score (300-900)"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
                disabled={isSubmitting}
              />
              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

