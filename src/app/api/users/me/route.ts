/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get authenticated user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: User profile data
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *   patch:
 *     summary: Update authenticated user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User full name
 *               email:
 *                 type: string
 *                 description: User email address
 *               phone_number:
 *                 type: string
 *                 description: User phone number
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Updated user profile data
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */


import { SupabaseClient } from "@supabase/supabase-js";
import { getAuthUser } from "@/lib/auth";
import { NextRequest } from "next/server"
import { successResponse, errorResponse } from '@/lib/response';
import { UserRepository } from "@/repositories/user.repository";
import { updateProfileSchema } from "@/validation/auth.schema";

export async function GET(req: NextRequest)
{
    try{
        const user = getAuthUser(req);
        if(!user) return errorResponse('Unauthorized', 401);

        const userData = await UserRepository.findById(user.userId);
        
        if (!userData) return errorResponse('User not found', 404);

        return successResponse(userData);
    }
    catch (error: any){
        return errorResponse(error.message, 500);
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const user = getAuthUser(req);
        if (!user) return errorResponse('Unauthorized', 401);

        const body = await req.json();

        // Validate input
        const validation = updateProfileSchema.safeParse(body);
        if (!validation.success) {
            return errorResponse('Invalid input', 400);
        }

        const updatedUser = await UserRepository.updateProfile(user.userId, validation.data);
        
        if (!updatedUser) return errorResponse('User not found', 404);

        return successResponse(updatedUser);
    } catch (error: any) {
        return errorResponse(error.message, 500);
    }
}