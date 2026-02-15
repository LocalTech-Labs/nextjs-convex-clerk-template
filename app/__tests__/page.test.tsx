import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import { render } from "@/test/utils/test-utils";

describe("Home Page", () => {
	it("renders the main heading", () => {
		render(<Home />);
		// Add your specific assertions based on your home page content
		// This is a placeholder test
		expect(document.querySelector("main")).toBeInTheDocument();
	});
});
