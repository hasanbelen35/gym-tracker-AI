import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { MemberService } from '../services/member.service';

const memberService = new MemberService();

export class MemberController {

    async getMyTrainerDataController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: "Yetkilendirme başarısız." });
            }

            const trainer = await memberService.getAssignedTrainerForMember(userId);

            if (!trainer) {
                return res.status(404).json({ message: "Atanmış bir eğitmeniniz bulunmuyor." });
            }

            return res.status(200).json({
                message: "success",
                data: trainer
            });

        } catch (error: any) {
            next(error)
        }
    }
}