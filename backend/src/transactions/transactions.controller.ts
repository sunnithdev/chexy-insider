import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ClerkGuard } from '../auth/clerk.guard';
import { db } from '../firebase.config';

@Controller('transactions')
@UseGuards(ClerkGuard)
export class TransactionsController {
    @Get()
    async getTransactions(@Req() req: any) {
        const userId = req.user.sub;

        const snapshot = await db.collection('transactions').where('userId', '==', userId).get();

        const transactions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { transactions };
    }

    @Post()
    async createTransaction(@Req() req: any, @Body() body: { type: string, amount: number }) {
        const userId = req.user.sub;
        const { amount, type } = body;

        if (!type || !['rent', 'tax', 'utility'].includes(type)) {
            throw new BadRequestException('Invalid Payment Type');
        }

        if (!amount || amount <= 0) {
            throw new BadRequestException('Invalid Payment Amount');
        }

        const pointsEarned = Math.floor(amount * 0.25);

        const transactionRef = await db.collection('transactions').add({
            userId,
            type,
            amount,
            pointsEarned,
            status: 'completed',
            createdAt: new Date().toISOString(),
        });

        const rewardsRef = db.collection('rewards').doc(userId);

        const rewardsDoc = await rewardsRef.get();

        if (rewardsDoc.exists) {
            const currentData = rewardsDoc.data();

            if (currentData) {
                await rewardsRef.update({
                    points: (currentData.points || 0) + pointsEarned,
                    totalEarned: (currentData.totalEarned || 0) + pointsEarned,
                    updatedAt: new Date().toISOString(),
                });
            }
        } else {
            await rewardsRef.set({
                points: pointsEarned,
                totalEarned: pointsEarned,
                totalRedeemed: 0,
                updatedAt: new Date().toISOString(),
            });
        }

        const updatedPoints = await rewardsRef.get();
        const newBalance = updatedPoints.data()?.points || 0;



        return {
            transaction: {
                id: transactionRef.id,
                userId,
                type,
                amount,
                pointsEarned,
                status: 'completed',
                createdAt: new Date().toISOString(),
            },
            newBalance,
        };
    }
}
