import { describe, it, expect } from 'vitest'
import { NAV_ITEMS } from '../../pages/Dashboard'

describe('NAV_ITEMS', () => {

    it('has 9 items', () => {
        expect(NAV_ITEMS).toHaveLength(9)
    })

    it('every item has id, icon, label, to', () => {
        NAV_ITEMS.forEach(item => {
            expect(item.id).toBeDefined()
            expect(item.icon).toBeDefined()
            expect(typeof item.label).toBe('string')
            expect(item.to).toMatch(/^\//)
        })
    })

    it('all ids are unique', () => {
        const ids = NAV_ITEMS.map(i => i.id)
        const unique = new Set(ids)
        expect(unique.size).toBe(ids.length)
    })

    it('first item is home', () => {
        expect(NAV_ITEMS[0].id).toBe('home')
        expect(NAV_ITEMS[0].to).toBe('/')
    })

})