import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ClerkGuard } from '../auth/clerk.guard';
import { db } from '../firebase.config';

@Controller('rewards')
@UseGuards(ClerkGuard)
export class RewardsController {
    @Get()
    async getRewards(@Req() req: any) {
        const userId = req.user.sub;

        const snapshot = await db.collection('rewards').doc(userId).get();

        if (!snapshot.exists) {
            return {
                points: 0,
                totalEarned: 0,
                totalRedeemed: 0
            };
        }

        return snapshot.data();
    }
}
