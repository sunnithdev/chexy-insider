"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function ChatBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "👋 Hi! I'm your Chexy financial advisor. Ask me anything about your rewards, transactions, or how to earn more points!",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const { getToken } = useAuth();

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setLoading(true);

        try {
            const token = await getToken();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/ai/analyze-finances`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ query: userMessage }),
                }
            );

            const data = await response.json();

            if (data.response) {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: data.response },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: "Sorry, I couldn't process that. Please try again.",
                    },
                ]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Oops! Something went wrong. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
                size="icon"
            >
                <MessageCircle className="h-6 w-6" />
            </Button>
        );
    }

    return (
        <Card className="fixed bottom-6 right-6 w-96 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle className="text-lg">AI Financial Advisor</CardTitle>
                    <CardDescription>Ask me anything!</CardDescription>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                >
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <ScrollArea className="h-96 pr-4">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === "user"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-900"
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap text-sm">
                                        {message.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] rounded-lg bg-gray-100 px-4 py-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <div className="flex gap-2">
                    <Input
                        placeholder="Ask about your finances..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        size="icon"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
