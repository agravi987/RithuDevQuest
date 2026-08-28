import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarkdownText } from "@/components/lesson/markdown";

describe("MarkdownText", () => {
  it("renders bold spans as <strong>", () => {
    const { container } = render(<MarkdownText text="A **bold** word." />);
    const strong = container.querySelector("strong");
    expect(strong).not.toBeNull();
    expect(strong?.textContent).toBe("bold");
    expect(screen.getByText(/A/)).toBeInTheDocument();
  });

  it("renders inline code spans as <code>", () => {
    const { container } = render(<MarkdownText text="Run `ls -la` now." />);
    const code = container.querySelector("code");
    expect(code).not.toBeNull();
    expect(code?.textContent).toBe("ls -la");
  });

  it("splits paragraphs on blank lines", () => {
    const { container } = render(
      <MarkdownText text={"First paragraph.\n\nSecond paragraph."} />,
    );
    expect(container.querySelectorAll("p")).toHaveLength(2);
  });

  it("passes plain text through unchanged", () => {
    render(<MarkdownText text="Just some prose." />);
    expect(screen.getByText("Just some prose.")).toBeInTheDocument();
  });

  it("renders an empty string without crashing", () => {
    render(<MarkdownText text="" />);
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });
});