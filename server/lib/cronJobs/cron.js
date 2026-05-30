import {Cron} from "croner"

const DAY_MAP = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
}

const buildCron = (pattern, days) => {
    switch (pattern) {
        case "daily":
            return "0 0 * * *"
        break

        case "weekly":
            const d = days.map((d) => DAY_MAP[d.toLowerCase()]).join(",")
            // console.log(d);
            
            return `0 0 * * ${d}`
        break

        case "monthly":
            const day = days.join(",")
            return `0 0 ${day} * * `
        break
    }
}
const recurringTasks = async (pattern, days) => {
    const expr = buildCron(pattern, days)

    new Cron(expr, () => {
        console.log("Hi, Kanchan!");

    })
}

recurringTasks("weekly", ["monday", "saturday"])

export default recurringTasks
