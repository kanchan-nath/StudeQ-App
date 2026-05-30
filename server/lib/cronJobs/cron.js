import { Cron } from "croner"
import { TimeTable } from "../../models/scheduleEntry.model.js"

const DAY_MAP = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
    thursday: 4, friday: 5, saturday: 6
}

const buildCron = (pattern, days) => {
    switch (pattern) {
        case "daily":
            return "7 18 * * *"
        case "weekly":
            const d = days.map((d) => DAY_MAP[d.toLowerCase()]).join(",")
            return `0 0 * * ${d}`
        case "monthly":
            const day = days.join(",")
            return `0 0 ${day} * *`          // ← was "0 0 ${day} * * " (6 fields + space)
        default:
            throw new Error(`Unknown pattern: ${pattern}`)
    }
}

const recurringTasks = async (pattern, days, endDate, entryId) => {
    const expr = buildCron(pattern, days)

    const job = new Cron(expr, async () => {   // ← async here
        if (endDate && new Date() > new Date(endDate)) {
            job.stop()
            return
        }

        const existedData = await TimeTable.findById(entryId).lean()  // ← findById, not find

        if (!existedData) {                    // ← now actually falsy when missing
            job.stop()
            return
        }

        const {userId,
            title, topic, startTime, endTime,
            plannedDuration, status, actualDuration,
            goalDescription, reminderEnabled, reminderMinutesBefore
        } = existedData                        // ← destructure from doc, not array

        console.log("Start");
        
        await TimeTable.create({userId,
            title, topic, startTime, endTime,
            plannedDuration, status, actualDuration,
            goalDescription, reminderEnabled, reminderMinutesBefore,
            // createdAt excluded — Mongoose sets it fresh
        })

        console.log("End");
        
    })
}

export default recurringTasks