import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// ─── Mock mongoose model ───────────────────────────────────────
const mockFindById = jest.fn();
const mockCreate = jest.fn();

jest.mock("../../models/scheduleEntry.model.js", () => ({
  TimeTable: { findById: mockFindById, create: mockCreate },
}));

// ─── Mock croner ───────────────────────────────────────────────
let capturedCallback;
jest.mock("croner", () => ({
  Cron: jest.fn().mockImplementation((expr, cb) => {
    capturedCallback = cb;
    return { stop: jest.fn() };
  }),
}));

import recurringTasks from "../../../lib/cronJobs/cron.js";

describe("lib/cronJobs/cron.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capturedCallback = undefined;
  });

  describe("buildCron pattern", () => {
    it("uses correct daily cron expression", async () => {
      const { Cron } = await import("croner");
      await recurringTasks("daily", [], null, "entry-id");
      expect(Cron).toHaveBeenCalledWith("39 18 * * *", expect.any(Function));
    });

    it("uses correct weekly cron expression for monday", async () => {
      const { Cron } = await import("croner");
      jest.clearAllMocks();
      await recurringTasks("weekly", ["monday"], null, "entry-id");
      expect(Cron).toHaveBeenCalledWith("0 0 * * 1", expect.any(Function));
    });

    it("uses correct monthly cron expression", async () => {
      const { Cron } = await import("croner");
      jest.clearAllMocks();
      await recurringTasks("monthly", ["15"], null, "entry-id");
      expect(Cron).toHaveBeenCalledWith("0 0 15 * *", expect.any(Function));
    });

    it("throws for unknown pattern", async () => {
      await expect(recurringTasks("biweekly", [], null, "id")).rejects.toThrow(
        "Unknown pattern: biweekly"
      );
    });
  });

  describe("cron job callback", () => {
    it("creates new entry from existing data", async () => {
      const existingEntry = {
        userId: 1,
        title: "Study Session",
        topic: "Maths",
        startTime: new Date(),
        endTime: new Date(),
        plannedDuration: 60,
        status: "pending",
        actualDuration: null,
        goalDescription: "Finish chapter 3",
        reminderEnabled: false,
        reminderMinutesBefore: 10,
      };
      mockFindById.mockReturnValue({ lean: () => Promise.resolve(existingEntry) });
      mockCreate.mockResolvedValue({});

      await recurringTasks("daily", [], null, "entry-id");

      if (capturedCallback) {
        await capturedCallback();
        expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ title: "Study Session" }));
      }
    });

    it("stops job when entry not found", async () => {
      const { Cron } = await import("croner");
      const stopMock = jest.fn();
      Cron.mockImplementation((expr, cb) => {
        capturedCallback = cb;
        return { stop: stopMock };
      });

      mockFindById.mockReturnValue({ lean: () => Promise.resolve(null) });

      await recurringTasks("daily", [], null, "missing-id");

      if (capturedCallback) {
        await capturedCallback();
        expect(mockCreate).not.toHaveBeenCalled();
      }
    });

    it("stops job when endDate has passed", async () => {
      const pastDate = new Date("2020-01-01");

      await recurringTasks("daily", [], pastDate, "entry-id");

      if (capturedCallback) {
        await capturedCallback();
        expect(mockFindById).not.toHaveBeenCalled();
      }
    });
  });
});
