var expect = require("chai").expect;
import * as coord from "../src/es6-dev/coord.js";
import Circle from "../src/es6-dev/circle.js";
import Point from '../src/es6-dev/point.js';
describe("The Circle Class", function() {
	describe("constructor", function() {
		const circle1 = new Circle([
			new Point(0, 0),
			new Point(0, 1),
			new Point(1, 1),
			new Point(1, 0)
		], 0, "test");
		const circle2 = new Circle([
			new Point(0, 0),
			new Point(0, 1),
			new Point(1, 1),
			new Point(0.5, 0.5),
			new Point(1, 0)
		], 0, "test");
		it("Removes unneeded points by gift wrapping", function() {
			expect(circle2).to.deep.equal(circle1);
		});
		it("Finds the proper center of the given points", function() {
			expect(circle1.position).to.deep.equal(new Point(0.5, 0.5, 0));
			expect(circle2.position).to.deep.equal(new Point(0.5, 0.5, 0));
		});
		it("Gets the radius by averaging the points", function() {
			expect(circle1.radius).to.equal(Math.SQRT1_2);
			expect(circle2.radius).to.equal(Math.SQRT1_2);
		});
		it("Deducts health based on the circle's accuracy", function() {
			const badCircle = new Circle([
				new Point(0, 0),
				new Point(0, 1),
				new Point(1, 2), //Bad
				new Point(0, 0)
			], 0, "test");
		});
	});
});
