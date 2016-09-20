let expect = require("chai").expect;
import * as coord from "../src/es6-dev/coord.js";
import Point from "../src/es6-dev/point.js";
describe("Coord functions", function() {
	describe("Distance", function() {
		it("Measures distance between two points", function() {
			let distance1 = coord.distance(new Point(0, 1), new Point(1, 1));
			let distance2 = coord.distance(new Point(0, 0), new Point(1, 1));
			expect(distance1).to.equal(1);
			expect(distance2).to.equal(Math.sqrt(2));
		});
	});

	describe("Move Point Along Line", function() {
		it("Finds a point a certain unit distance between 2 points", function() {
			let point1 = coord.movePointAlongLine(new Point(0, 0), new Point(0, 1), 0.5);
			let point2 = coord.movePointAlongLine(new Point(0, 0), new Point(0, 2), 0.5);
			expect(point1).to.deep.equal(new Point(0, 0.5));
			expect(point2).to.deep.equal(new Point(0, 0.5));
		});
		it("Finds a point a certain ratio distance between 2 points", function() {
			let point1 = coord.movePointAlongLine(new Point(0, 0), new Point(0, 1), 0.5, true);
			let point2 = coord.movePointAlongLine(new Point(0, 0), new Point(0, 2), 0.5, true);
			expect(point1).to.deep.equal(new Point(0, 0.5));
			expect(point2).to.deep.equal(new Point(0, 1));
		});
	});

	describe("Find Intersection Point", function() {
		it("Finds the point of intersection between two lines", function() {
			let intersection1 = coord.findIntersectionPoint([new Point(1, 0), new Point(1, 2)], [new Point(0, 1), new Point(2, 1)]);
			/* What it looks like
			 |
			---
			 |
				 */
			let intersection2 = coord.findIntersectionPoint([new Point(0, 0), new Point(2, 2)], [new Point(0, 2), new Point(2, 0)]);
			/*
			\ /
			 *
			/ \
			 */
			expect(intersection1).to.deep.equal(new Point(1, 1));
			expect(intersection2).to.deep.equal(new Point(1, 1));
		});
		it("Returns 0,0 when there is no intersection", function() {
			let collinearIntersection = coord.findIntersectionPoint([new Point(0, 0), new Point(0, 1)], [new Point(0, 2), new Point(0, 3)]);
			let parallelIntersection = coord.findIntersectionPoint([new Point(0, 0), new Point(0, 1)], [new Point(1, 0), new Point(1, 1)]);
			let noIntersection = coord.findIntersectionPoint([new Point(0, 0), new Point(0, 1)], [new Point(10, 11), new Point(14, 70)]);
			expect(noIntersection).to.deep.equal(new Point(0, 0));
			expect(collinearIntersection).to.deep.equal(new Point(0, 0));
			expect(parallelIntersection).to.deep.equal(new Point(0, 0));
		});
	});
	describe("Resample Points", function() {
		it("Changes a path of points to 'n' number of evenly spaced points", function() {
			const num = 10; //Used for resampling;

			let straightline = [new Point(0, 0), new Point(0, num)];
			for (let i = 0; i < num.length; i++) {
				expect(coord.resample(straightline, num)[i]).to.deep.equal(new Point(0, i));
			}

			//L-bend
			let lcurve = [new Point(0, 0), new Point(0, num), new Point(num, num)];
			for (let i = 0; i < num.length; i++) {}

			//Check length;
			expect(coord.resample(straightline, num).length).to.equal(num);
			expect(coord.resample(lcurve, num).length).to.equal(num);
		});
	});
	describe("Cloud Distance", function() {
		it("Matches 2 pointclouds and returns the distance between all matched points", function() {
			const pcloud1 = [new Point(0, 0), new Point(0, 100), new Point(100, 100), new Point(100, 0)];
			const pcloud2 = [new Point(0, 0), new Point(0, 100), new Point(100, 100), new Point(100, 0)];
			expect(coord.cloudDistance(pcloud1, pcloud2)).to.equal(0);
			for (let i = 0; i < 20; i++) {
				const pcloud3 = [new Point(i, 0), new Point(0, 100), new Point(100, 100), new Point(100, 0)];
				expect(coord.cloudDistance(pcloud1, pcloud3)).to.equal(i);
			}
		});
	});


});
