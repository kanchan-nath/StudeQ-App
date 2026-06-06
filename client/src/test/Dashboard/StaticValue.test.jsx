import { describe, it, expect } from "vitest"
import { NAV_ITEMS, QUICK_ACTIONS } from "../../pages/Dashboard"

// describe("Quick Action", () => {
//     it("has 6 length",()=>{
//         expect(QUICK_ACTIONS).toHaveLength(6)
//     })

//     it("level check",()=>{
//         QUICK_ACTIONS.forEach((action)=>{
//             expect(typeof action.label).toBe("string")
//         })
//     })

//     it("icon check",()=>{
//         QUICK_ACTIONS.forEach((action)=>{
//             expect(action.icon).toBeDefined()
//         })
//     })

//     it("to check",()=>{
//         QUICK_ACTIONS.forEach((action)=>{
//             expect(action.to).toMatch(/^\//)
//         })
//     })
// })


// describe("Nav Item", () => {
//     it("id should be unique", () => {
//         NAV_ITEMS.forEach((currentItem, currentIndex) => {
//             NAV_ITEMS.forEach((compareItem, compareIndex) => {
//                 if(currentIndex !==compareIndex){
//                     expect(currentItem.id).not.toBe(compareItem.id)
//                 }
//             })
//         })
//     })

//     it("icon should not be undefined",()=>{
//         NAV_ITEMS.forEach((currentItem)=>{
//             expect(currentItem.icon).toBeDefined()
//         })
//     })

//     it("lable should be string",()=>{
//         NAV_ITEMS.forEach((item)=>{
//             expect(typeof item.label).toBe("string")
//         })
//     })

//     it("regex check",()=>{
//         NAV_ITEMS.forEach((item)=>{
//             expect(item.to).toMatch(/^\//)
//         })
//     })
// })