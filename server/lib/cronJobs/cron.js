import cron from "node-cron"

const DAY_MAP = {
    sunady:0,
    monday:1,
    tuesday:2,
    wednesday:3,
    thursday:4,
    friday:5,
    saturday:6
}
const recurringTasks = async(pattern, days)=>{
    cron.schedule("*/5 * * * * *",()=>{
        console.log("Hi, Kanchan!");
        
    })
}

export default recurringTasks
