/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast, WelcomePanel } from "../../pages/Notes";

describe("WelcomePanel", () => {
  const onStartMock = vi.fn();

  beforeEach(() => {
    onStartMock.mockClear();
    render(<WelcomePanel onStart={onStartMock} />);
  });

  it("renders heading and subtitle text", () => {
    const heading = screen.getByRole("heading", {
      name: /Your Knowledge, Distilled/i,
    });

    const subtitleText = screen.getByText(/Paste any text/i);

    expect(heading).toBeInTheDocument();
    expect(subtitleText).toBeInTheDocument();
  });

  it("renders all 4 feature cards", () => {
    const card1 = screen.getByTestId("welcome-card1");
    const card2 = screen.getByTestId("welcome-card2");
    const card3 = screen.getByTestId("welcome-card3");
    const card4 = screen.getByTestId("welcome-card4");

    expect(card1).toHaveTextContent("Smart Summaries");
    expect(card1).toHaveTextContent("AI condenses long content");
    expect(card2).toHaveTextContent("Key Point Extraction");
    expect(card2).toHaveTextContent("Never miss the important");
    expect(card3).toHaveTextContent("Export Anywhere");
    expect(card3).toHaveTextContent(
      "Copy to clipboard or download as PDF instantly",
    );
    expect(card4).toHaveTextContent("Pin & Organise");
    expect(card4).toHaveTextContent(
      "Keep your most important notes front and centre",
    );
  });

  it("calls onStart when CTA button clicked", async () => {
    const button = screen.getByRole("button", {
      name: /Create your first note/i,
    });

    await userEvent.click(button);

    expect(onStartMock).toHaveBeenCalledTimes(1);
  });

  it("has aria-label on section", () => {
    expect(
      screen.getByRole("region", {
        name: /Welcome screen/,
      }),
    ).toBeInTheDocument();
  });
});
