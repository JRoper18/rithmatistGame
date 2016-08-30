var expect = require("chai").expect;
import * as coord from "../src/es6-dev/coord.js";
import Point from "../src/es6-dev/point.js";
describe("Coord functions", function() {
	describe("Distance", function() {
		it("Measures distance between two points", function() {
			var distance1 = coord.Distance(new Point(0, 1), new Point(1, 1));
			var distance2 = coord.Distance(new Point(0, 0), new Point(1, 1));
			expect(distance1).to.equal(1);
			expect(distance2).to.equal(Math.sqrt(2));
		});
	});
});
