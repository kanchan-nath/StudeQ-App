import { createEvent } from "ics"
import path from "path"
import fs from "fs"

const icsFileGenerator = (eventObj, folder) => {
    const toIcsDate = (date) => {
        const d = new Date(date)
        return [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes()]
    }

    const event = {
        start: toIcsDate(eventObj.startTime),
        end: toIcsDate(eventObj.endTime),
        title: eventObj.title,
        description: eventObj.goalDescription,
    }

    return new Promise((resolve, reject) => {
        createEvent(event, (error, value) => {   // was: createEvent(eventObj, ...)
            if (error) {
                console.error("Error:", error.message);
                return reject(error)
            }

            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
            }

            const outputPath = path.join(folder, 'time-table-event.ics');
            fs.writeFileSync(outputPath, value);
            resolve(outputPath)   // now caller gets the path
        })
    })
}

export default icsFileGenerator