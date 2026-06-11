import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../../pages/Dashboard";

describe("Dashboard quick action links", () => {
  beforeEach(() => {
    localStorage.setItem("token", "fake-token");
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // it('renders all 6 quick action links', () => {
  //     const quickAction = screen.getAllByRole('link', {
  //         name: /create quiz/i,
  //     })[0];

  //     render(<MemoryRouter><Dashboard /></MemoryRouter>)

  //     expect(screen.getByRole('link', { name: /upload material/i })).toBeInTheDocument()
  //     expect(quickAction).toBeInTheDocument();
  //     expect(screen.getByRole('link', { name: /chat with ai/i })).toBeInTheDocument()
  //     expect(screen.getByRole('link', { name: /study room/i })).toBeInTheDocument()
  //     expect(screen.getByRole('link', { name: /image analysis/i })).toBeInTheDocument()
  //     expect(screen.getByRole('link', { name: /pdf analysis/i })).toBeInTheDocument()
  // })

  it("upload material link points to /notes", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: /upload material/i });
    expect(link).toHaveAttribute("href", "/notes");
  });
});
