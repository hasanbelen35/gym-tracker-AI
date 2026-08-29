import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { MemberService } from '../services/member.service';

const memberService = new MemberService();

export class MemberController {

    async getMyTrainerDataController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: "Authorization failed!" });
            }

            const trainer = await memberService.getAssignedTrainerForMember(userId);

            if (!trainer) {
                return res.status(404).json({ message: "Atanmış bir eğitmeniniz bulunmuyor." });
            }

            return res.status(200).json({
                success: true,
                data: trainer
            });

        } catch (error: any) {
            next(error)
        }
    }

    // UPDATE MEMBER PROFILE CONTROLLER
    async updateProfileController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: "Authorization failed!" });
            }

            const { age, height, weight, gender, medicalNotes, avatarUrl } = req.body;

            const updatedProfile = await memberService.updateMemberProfile(userId, {
                age: age !== undefined && age !== "" ? Number(age) : undefined,
                height: height !== undefined && height !== "" ? Number(height) : undefined,
                weight: weight !== undefined && weight !== "" ? Number(weight) : undefined,
                gender,
                medicalNotes,
                avatarUrl,
            });

            return res.status(200).json({
                success: true,
                message: "Profile updated succesfully!",
                data: updatedProfile
            });

        } catch (error: any) {
            next(error);
        }
    }
    
    // get current member's data controller
    async getCurrentMemberController(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: "Authorization failed!" });
            }

            const member = await memberService.getCurrentMember(userId);

            return res.status(200).json({
                success: true,
                data: member
            });

        } catch (error: any) {
            next(error);
        }
    }

}