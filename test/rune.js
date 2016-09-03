var expect = require("chai").expect;
import Rune from "../src/es6-dev/rune.js";
import Point from "../src/es6-dev/point.js";
import RenderedElement from "../src/es6-dev/renderedElement.js";
describe("Rune Class", function() {
	describe("Render", function() {
		it("Returns a renderedElement object with the proper rendering information", function() {
			const testRune = new Rune([new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(9, 9)])
			expect(testRune.render()).to.deep.equal(new RenderedElement(
				"<path stroke=\"black\" fill=\"none\" stroke-width = \"1\" d=\"M0 0L0 1L1 1L9 9\"></path>", "Rune"));
			expect(testRune.render("DASH")).to.deep.equal(new RenderedElement(
				"<path stroke=\"black\" stroke-dasharray= \"5,5\" fill=\"none\" stroke-width = \"1\" d=\"M0 0L0 1L1 1L9 9\"></path>", "Rune"));
			expect(testRune.render("FADE")).to.deep.equal(new RenderedElement(
				"<path stroke=\"grey\" fill=\"none\" stroke-width = \"1\" d=\"M0 0L0 1L1 1L9 9\"></path>", "Rune"));
		});
	});
});
