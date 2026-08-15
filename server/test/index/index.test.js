import { jest } from "@jest/globals"
import {
    createSocketAuthMiddleware,
    // getAvailablePort,
    // bootServer,
    // createShutdownHandler,
    // createConnectionHandler,
} from "../../../server/index.js"

describe("createSocketAuthMiddleware", () => {
    let next

    beforeEach(() => {
        next = jest.fn()
    })

    const makeSocket = (cookieStr) => ({
        handshake: { headers: { cookie: cookieStr } },
        data: {},
    })

    it("calls next() with no error on valid token", () => {
        const cookieParse = jest.fn().mockReturnValue({ accessToken: "valid-token" })
        const jwtVerify = jest.fn().mockReturnValue({ userId: "user_123" })
        const middleware = createSocketAuthMiddleware({ cookieParse, jwtVerify, accessTokenSecret: "secret" })
        const socket = makeSocket("accessToken=valid-token")

        middleware(socket, next)

        expect(jwtVerify).toHaveBeenCalledWith("valid-token", "secret")
        expect(socket.data.userId).toBe("user_123")
        expect(next).toHaveBeenCalledWith()
    })

    it("rejects when no cookie header present", () => {
        const cookieParse = jest.fn().mockReturnValue({})
        const jwtVerify = jest.fn()
        const middleware = createSocketAuthMiddleware({ cookieParse, jwtVerify })
        const socket = makeSocket(undefined)

        middleware(socket, next)

        expect(jwtVerify).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledWith(expect.any(Error))
        expect(next.mock.calls[0][0].message).toMatch(/no token/)
    })

    it("rejects when token missing from parsed cookie", () => {
        const cookieParse = jest.fn().mockReturnValue({})
        const jwtVerify = jest.fn()
        const middleware = createSocketAuthMiddleware({ cookieParse, jwtVerify })
        const socket = makeSocket("foo=bar")

        middleware(socket, next)

        expect(next).toHaveBeenCalledWith(expect.any(Error))
    })

    it("rejects when decoded token has no userId", () => {
        const cookieParse = jest.fn().mockReturnValue({ accessToken: "tok" })
        const jwtVerify = jest.fn().mockReturnValue({ someOtherField: true })
        const middleware = createSocketAuthMiddleware({ cookieParse, jwtVerify })
        const socket = makeSocket("accessToken=tok")

        middleware(socket, next)

        expect(next).toHaveBeenCalledWith(expect.any(Error))
        expect(next.mock.calls[0][0].message).toMatch(/invalid token payload/)
    })

    it("rejects and wraps error message when jwt.verify throws", () => {
        const cookieParse = jest.fn().mockReturnValue({ accessToken: "bad-token" })
        const jwtVerify = jest.fn().mockImplementation(() => {
            throw new Error("jwt expired")
        })
        const middleware = createSocketAuthMiddleware({ cookieParse, jwtVerify })
        const socket = makeSocket("accessToken=bad-token")

        middleware(socket, next)

        expect(next).toHaveBeenCalledWith(expect.any(Error))
        expect(next.mock.calls[0][0].message).toBe("Unauthorized: jwt expired")
    })

    it("rejects when decodedToken is null", () => {
        const cookieParse = jest.fn().mockReturnValue({ accessToken: "tok" })
        const jwtVerify = jest.fn().mockReturnValue(null)
        const middleware = createSocketAuthMiddleware({ cookieParse, jwtVerify })
        const socket = makeSocket("accessToken=tok")

        middleware(socket, next)

        expect(next.mock.calls[0][0].message).toMatch(/invalid token payload/)
    })
})