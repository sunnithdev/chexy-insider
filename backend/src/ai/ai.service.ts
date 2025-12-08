import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
    private openai: OpenAI;

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async analyzeFinances(userData: {
        creditScore: number;
        rewards: { points: number; totalEarned: number; totalRedeemed: number };
        transactions: any[];
        query: string;
    }): Promise<string> {
        const { creditScore, rewards, transactions, query } = userData;

        // Build context for the AI
        const systemPrompt = `You are a helpful financial advisor for Chexy Insider, a platform that helps users pay rent, taxes, and utilities while earning rewards.

IMPORTANT RULES:
- Chexy ONLY handles: Rent payments, Tax payments, and Utility payments
- Users earn 25% of their payment amount as reward points (e.g., $1000 rent = 250 points)
- DO NOT suggest using credit cards for dining, groceries, gas, or general shopping
- DO NOT give generic credit card advice
- ONLY discuss Chexy payments (rent, tax, utility) and Chexy rewards
- Be friendly, concise, and actionable
- Use emojis occasionally to make responses engaging

If asked about earning more points, suggest:
1. Making larger rent/tax/utility payments through Chexy
2. Paying bills consistently through the platform
3. Consolidating all eligible payments (rent + utilities + taxes) on Chexy

If asked about rewards, reference the available Chexy reward items.`;

        const userContext = `
User's Financial Data:
- Credit Score: ${creditScore}
- Current Reward Points: ${rewards.points}
- Total Points Earned: ${rewards.totalEarned}
- Total Points Redeemed: ${rewards.totalRedeemed}
- Recent Transactions: ${transactions.length > 0 ? JSON.stringify(transactions.slice(0, 5), null, 2) : 'No transactions yet'}

User Question: "${query}"

Provide a helpful, personalized response based on their data.`;

        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userContext },
                ],
                temperature: 0.7,
                max_tokens: 500,
            });

            return completion.choices[0].message.content || 'Sorry, I could not generate a response.';
        } catch (error) {
            console.error('OpenAI API error:', error);
            throw new Error('Failed to analyze finances. Please try again.');
        }
    }
}
