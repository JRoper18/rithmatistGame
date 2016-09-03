var expect = require("chai").expect;
import * as coord from "../src/es6-dev/coord.js";
import Point from "../src/es6-dev/point.js";
describe("Coord functions", function() {
	describe("Distance", function() {
		it("Measures distance between two points", function() {
			var distance1 = coord.distance(new Point(0, 1), new Point(1, 1));
			var distance2 = coord.distance(new Point(0, 0), new Point(1, 1));
			expect(distance1).to.equal(1);
			expect(distance2).to.equal(Math.sqrt(2));
		});
	});

	describe("Move Point Along Line", function() {
		it("Finds a point a certain unit distance between 2 points", function() {
			var point1 = coord.movePointAlongLine(new Point(0, 0), new Point(0, 1), 0.5);
			var point2 = coord.movePointAlongLine(new Point(0, 0), new Point(0, 2), 0.5);
			expect(point1).to.deep.equal(new Point(0, 0.5));
			expect(point2).to.deep.equal(new Point(0, 0.5));
		});
		it("Finds a point a certain ratio distance between 2 points", function() {
			var point1 = coord.movePointAlongLine(new Point(0, 0), new Point(0, 1), 0.5, true);
			var point2 = coord.movePointAlongLine(new Point(0, 0), new Point(0, 2), 0.5, true);
			expect(point1).to.deep.equal(new Point(0, 0.5));
			expect(point2).to.deep.equal(new Point(0, 1));
		});
	});

	describe("Find Intersection Point", function() {
		it("Finds the point of intersection between two lines", function() {
			var intersection1 = coord.findIntersectionPoint([new Point(1, 0), new Point(1, 2)], [new Point(0, 1), new Point(2, 1)]);
			/* What it looks like
			 |
			---
			 |
				 */
			var intersection2 = coord.findIntersectionPoint([new Point(0, 0), new Point(2, 2)], [new Point(0, 2), new Point(2, 0)]);
			/*
			\ /
			 *
			/ \
			 */
			expect(intersection1).to.deep.equal(new Point(1, 1));
			expect(intersection2).to.deep.equal(new Point(1, 1));
		});
		it("Returns 0,0 when there is no intersection", function() {
			var collinearIntersection = coord.findIntersectionPoint([new Point(0, 0), new Point(0, 1)], [new Point(0, 2), new Point(0, 3)]);
			var parallelIntersection = coord.findIntersectionPoint([new Point(0, 0), new Point(0, 1)], [new Point(1, 0), new Point(1, 1)]);
			var noIntersection = coord.findIntersectionPoint([new Point(0, 0), new Point(0, 1)], [new Point(10, 11), new Point(14, 70)]);
			expect(noIntersection).to.deep.equal(new Point(0, 0));
			expect(collinearIntersection).to.deep.equal(new Point(0, 0));
			expect(parallelIntersection).to.deep.equal(new Point(0, 0));
		});
	});

});
