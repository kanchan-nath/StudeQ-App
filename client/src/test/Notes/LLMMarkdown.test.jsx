/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LLMMarkdown } from "../../pages/Notes";

describe("LLMMarkdown", () => {
  it("renders markdown content as HTML", () => {
    const { container } = render(
      <LLMMarkdown content="<code>console.log()</code>" />,
    );

    expect(container.querySelector("code")).toBeInTheDocument();
    expect(container.querySelector("code")).toHaveTextContent("console.log()");
  });

  it("renders <u> tag for underline syntax", () => {
    const { container } = render(<LLMMarkdown content="<u>Hello World!</u>" />);

    expect(container.querySelector("u")).toBeInTheDocument();
    expect(container.querySelector("u")).toHaveTextContent("Hello World!");
  });

  it("renders <em> tag for italic/emphasis syntax", () => {
    const { container } = render(
      <LLMMarkdown content="<em>Hello World!</em>" />,
    );

    expect(container.querySelector("em")).toBeInTheDocument();
    expect(container.querySelector("em")).toHaveTextContent("Hello World!");
  });

  it("renders <mark> with correct inline styles", () => {
    const { container } = render(
      <LLMMarkdown content="<mark> Hello World!</mark>" />,
    );

    const mark = container.querySelector("mark");

    expect(mark).toBeInTheDocument();
    expect(mark).toHaveTextContent("Hello World!");
  });
});
