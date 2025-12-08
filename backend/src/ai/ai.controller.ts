import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ClerkGuard } from '../auth/clerk.guard';
import { AiService } from './ai.service';
import { db } from '../firebase.config';

@Controller('ai')
@UseGuards(ClerkGuard)
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Post('analyze-finances')
    async analyzeFinances(@Req() req: any, @Body() body: { query: string }) {
        const userId = req.user.sub;
        const { query } = body;

        if (!query || query.trim().length === 0) {
            return { error: 'Query is required' };
        }

        try {
            // Fetch user's financial data
            const [userScoreDoc, rewardsDoc, transactionsSnapshot] = await Promise.all([
                db.collection('users_scores').doc(userId).get(),
                db.collection('rewards').doc(userId).get(),
                db.collection('transactions').where('userId', '==', userId).get(),
            ]);

            const creditScore = userScoreDoc.exists ? userScoreDoc.data()?.creditScore : 0;
            const rewardsData = rewardsDoc.exists ? rewardsDoc.data() : null;
            const rewards = rewardsData
                ? {
                    points: rewardsData.points || 0,
                    totalEarned: rewardsData.totalEarned || 0,
                    totalRedeemed: rewardsData.totalRedeemed || 0,
                }
                : { points: 0, totalEarned: 0, totalRedeemed: 0 };
            const transactions = transactionsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Call AI service
            const response = await this.aiService.analyzeFinances({
                creditScore,
                rewards,
                transactions,
                query,
            });

            return { response };
        } catch (error) {
            console.error('Error analyzing finances:', error);
            return { error: 'Failed to analyze finances. Please try again.' };
        }
    }
}
