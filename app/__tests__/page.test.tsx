import { describe, expect, it } from "vitest";
import HomePage from "@/app/(marketing)/page";
import { render } from "@/test/utils/test-utils";

describe("Home Page", () => {
	it("renders the hero section", () => {
		render(<HomePage />);
		expect(document.querySelector("h1")?.textContent).toContain("Ship your SaaS");
	});

	it("renders the features section", () => {
		render(<HomePage />);
		expect(document.getElementById("features")).toBeInTheDocument();
	});

	it("renders the pricing section", () => {
		render(<HomePage />);
		expect(document.getElementById("pricing")).toBeInTheDocument();
	});
});
