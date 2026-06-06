import { describe, it, expect } from "vitest"
import { NAV_ITEMS, QUICK_ACTIONS, FEATURE_CARDS } from "../../pages/Dashboard"

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

// describe("FEATURE_CARDS", () => {
//   it("contains 6 cards", () => {
//     expect(FEATURE_CARDS).toHaveLength(6);
//   });

//   it("every card has a title", () => {
//     FEATURE_CARDS.forEach((card) => {
//       expect(card.title).toBeDefined();
//       expect(typeof card.title).toBe("string");
//     });
//   });

//   it("every card has a description", () => {
//     FEATURE_CARDS.forEach((card) => {
//       expect(card.desc).toBeDefined();
//       expect(typeof card.desc).toBe("string");
//     });
//   });

//   it("every card has a CTA", () => {
//     FEATURE_CARDS.forEach((card) => {
//       expect(card.cta).toBeDefined();
//       expect(typeof card.cta).toBe("string");
//     });
//   });

//   it("every card has a route", () => {
//     FEATURE_CARDS.forEach((card) => {
//       expect(card.to).toBeDefined();
//       expect(card.to).toMatch(/^\//);
//     });
//   });

//   it("every card has a colorClass", () => {
//     FEATURE_CARDS.forEach((card) => {
//       expect(card.colorClass).toBeDefined();
//       expect(typeof card.colorClass).toBe("string");
//     });
//   });

//   it("every card has an icon", () => {
//     FEATURE_CARDS.forEach((card) => {
//       expect(card.icon).toBeDefined();
//     });
//   });

//   it("all titles are unique", () => {
//     const titles = FEATURE_CARDS.map((card) => card.title);

//     expect(new Set(titles).size).toBe(titles.length);
//   });

//   it("all routes are unique", () => {
//     const routes = FEATURE_CARDS.map((card) => card.to);

//     expect(new Set(routes).size).toBe(routes.length);
//   });
// });

