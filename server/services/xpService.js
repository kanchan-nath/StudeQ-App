import prisma from "../lib/prisma.js"
import redisClient from "../lib/redisClient.js"
import { ApiError } from "../utils/Async.js"
import logger from "../logger/index.js"

export const XP_TABLE = {
  QUIZ_COMPLETE: 50,
  FLASHCARD_SESSION: 20,
  DOC_UPLOAD: 10,
  CHAT_SESSION: 5,
  DAILY_LOGIN: 5,
  PREMIUM_UNLOCK_XP:100
}

const xpForLevel = (n)=> {
  return Math.pow(n - 1, 2) * 100
}

export const computeStats= (totalXp)=> {
  const level = Math.floor(Math.sqrt(totalXp / 100)) + 1
  const xpCurrentLevel = xpForLevel(level)
  const xpNextLevel = xpForLevel(level + 1)
  const xpPercent = Math.round(
    ((totalXp - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100
  )
  return { xp: totalXp, level, xpNextLevel, xpPercent }
}

const calcStreak = (currentStreak, lastStudyDate) =>{
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  if (lastStudyDate === today) return { streak: currentStreak, updated: false }
  const streak = lastStudyDate === yesterday ? currentStreak + 1 : 1
  return { streak, updated: true }
}

const invalidateUserCache = async (userId)=> {
  try {
    await redisClient.del(`user-cache:${userId}`)
  } catch (err) {
    logger.error("Redis invalidate failed:", err.message)
  }
}

export const grantXP = async (userId, action)=> {
  const amount = XP_TABLE[action]
  if (!amount) throw new ApiError(400, `Unknown XP action: ${action}`)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totalXp: true, streak: true, lastStudyDate: true },
  })
  if (!user) throw new ApiError(404, "User not found")

  const { streak, updated } = calcStreak(user.streak, user.lastStudyDate)
  const today = new Date().toISOString().slice(0, 10)

  const updated_user = await prisma.user.update({
    where: { id: userId },
    data: {
      totalXp: user.totalXp + amount,
      streak,
      ...(updated && { lastStudyDate: today }),
    },
    select: { totalXp: true, streak: true },
  })

  await invalidateUserCache(userId)

  return {
    granted: amount,
    streak: updated_user.streak,
    stats: computeStats(updated_user.totalXp),
  }
}

// idempotent — safe to call every login
export const  grantDailyLoginXP = async (userId) =>{
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totalXp: true, streak: true, lastStudyDate: true },
  })
  if (!user) throw new ApiError(404, "User not found")

  const today = new Date().toISOString().slice(0, 10)
  if (user.lastStudyDate === today) return null // already counted today

  const { streak } = calcStreak(user.streak, user.lastStudyDate)

  const updated_user = await prisma.user.update({
    where: { id: userId },
    data: {
      totalXp: user.totalXp + XP_TABLE.DAILY_LOGIN,
      streak,
      lastStudyDate: today,
    },
    select: { totalXp: true, streak: true },
  })

  await invalidateUserCache(userId)

  return {
    granted: XP_TABLE.DAILY_LOGIN,
    streak: updated_user.streak,
    stats: computeStats(updated_user.totalXp),
  }
}