import Point from './point.js';

/**
 * The $P Point-Cloud Recognizer (JavaScript version)
 *
 * 	Radu-Daniel Vatavu, Ph.d.
 *	University Stefan cel Mare of Suceava
 *	Suceava 720229, Romania
 *	vatavu@eed.usv.ro
 *
 *	Lisa Anthony, Ph.d.
 *      UMBC
 *      Information Systems Department
 *      1000 Hilltop Circle
 *      Baltimore, MD 21250
 *      lanthony@umbc.edu
 *
 *	Jacob O. Wobbrock, Ph.d.
 * 	The Information School
 *	University of Washington
 *	Seattle, WA 98195-2840
 *	wobbrock@uw.edu
 *
 * The academic publication for the $P recognizer, and what should be
 * used to cite it, is:
 *
 *	Vatavu, R.-D., Anthony, L. and Wobbrock, J.o. (2012).
 *	  Gestures as point clouds: A $P recognizer for user interface
 *	  prototypes. Proceedings of the ACM Int'l Conference on
 *	  Multimodal Interfaces (ICMI '12). Santa Monica, California
 *	  (October 22-26, 2012). New York: ACM Press, pp. 273-280.
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (c) 2012, Radu-Daniel Vatavu, Lisa Anthony, and
 * Jacob O. Wobbrock. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University Stefan cel Mare of Suceava,
 *	University of Washington, nor UMBC, nor the names of its contributors
 *	may be used to endorse or promote products derived from this software
 *	without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Radu-Daniel Vatavu OR Lisa Anthony
 * OR Jacob O. Wobbrock BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT
 * OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 **/
function findIntersectionPoint(line1, line2) { //http://stackoverflow.com/a/565282/6283767
	const p = line1[0];
	const q = line2[0];
	const r = line1[1].subtract(line1[0]);
	const s = line2[1].subtract(line2[0]);
	const t = q.subtract(p).crossProduct(s) / (r.crossProduct(s));
	const u = q.subtract(p).crossProduct(r) / (r.crossProduct(s));
	if (line1[0] === line2[0] || line1[1] === line2[0] || line1[0] === line2[1] || line1[1] === line2[1]) { //They're touching each other on the edge
		return new Point(0, 0);
	} else if (r.crossProduct(s) === 0 && (q.subtract(p).crossProduct(r) === 0)) { //Collinear
		return new Point(0, 0);
	} else if (r.crossProduct(s) === 0 && (q.subtract(p).crossProduct(r) !== 0)) { //Parallel lines
		return new Point(0, 0);
	} else if (r.crossProduct(s) !== 0 && ((0 <= t && t <= 1) && (0 <= u && u <= 1))) {
		const newP = p.add(r.scale(t));
		return newP;
	} else {
		return new Point(0, 0);
	}
}

function movePointAlongLine(pt1, pt2, distanceToMove, percent) {
	let dx = pt2.x - pt1.x;
	let dy = pt2.y - pt1.y;
	let tempDistance = distance(pt1, pt2);
	let unitX = dx / tempDistance;
	let unitY = dy / tempDistance;
	let unitDistance = (percent) ? distanceToMove * tempDistance : distanceToMove;
	let newX = (unitX * unitDistance) + pt1.x;
	let newY = (unitY * unitDistance) + pt1.y;
	return new Point(newX, newY);

}

function greedyCloudMatch(points, P) {
	var e = 0.50;
	var step = Math.floor(Math.pow(points.length, 1 - e));
	var min = +Infinity;
	for (var i = 0; i < points.length; i += step) {
		var d1 = cloudDistance(points, P.points, i);
		var d2 = cloudDistance(P.points, points, i);
		min = Math.min(min, Math.min(d1, d2)); // min3
	}
	return min;
}

function cloudDistance(pts1, pts2, start) {
	var matched = new Array(pts1.length); // pts1.length == pts2.length
	for (var k = 0; k < pts1.length; k++)
		matched[k] = false;
	var sum = 0;
	var i = start;
	do {
		var index = -1;
		var min = +Infinity;
		for (var j = 0; j < matched.length; j++) {
			if (!matched[j]) {
				var d = distance(pts1[i], pts2[j]);
				if (d < min) {
					min = d;
					index = j;
				}
			}
		}
		matched[index] = true;
		var weight = 1 - ((i - start + pts1.length) % pts1.length) / pts1.length;
		sum += weight * min;
		i = (i + 1) % pts1.length;
	} while (i != start);
	if (sum > 1) {
		//FIXME: This algorithm made BY A COLLEGE CS MAJOR is wrong. Fuck them, I've got to figure it out myself.
	}
	return sum;
}

function resample(pointsIn, n) {
	var points = JSON.parse(JSON.stringify(pointsIn));
	var I = pathLength(points) / (n - 1); // interval length
	var D = 0.0;
	var newpoints = new Array(new Point(points[0].x, points[0].y, points[0].id));
	for (var i = 1; i < points.length; i++) {
		if (points[i].id == points[i - 1].id) {
			var d = distance(points[i - 1], points[i]);
			if ((D + d) >= I) {
				var qx = points[i - 1].x + ((I - D) / d) * (points[i].x - points[i - 1].x);
				var qy = points[i - 1].y + ((I - D) / d) * (points[i].y - points[i - 1].y);
				var q = new Point(qx, qy, points[i].id);
				newpoints[newpoints.length] = q; // append new point 'q'
				points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
				D = 0.0;
			} else D += d;
		}
	}
	if (newpoints.length == n - 1) // sometimes we fall a rounding-error short of adding the last point, so add it if so
		newpoints[newpoints.length] = new Point(points[points.length - 1].x, points[points.length - 1].y, points[points.length - 1].id);
	return newpoints;
}

function scale(points) {
	var minX = +Infinity,
		maxX = -Infinity,
		minY = +Infinity,
		maxY = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].x);
		minY = Math.min(minY, points[i].y);
		maxX = Math.max(maxX, points[i].x);
		maxY = Math.max(maxY, points[i].y);
	}
	var size = Math.max(maxX - minX, maxY - minY);
	var newpoints = [];
	for (var j = 0; j < points.length; j++) {
		var qx = (points[j].x - minX) / size;
		var qy = (points[j].y - minY) / size;
		newpoints[newpoints.length] = new Point(qx, qy, points[j].id);
	}
	return newpoints;
}

function translateTo(points, pt) // translates points' centroid
{
	var c = centroid(points);
	var newpoints = [];
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].x + pt.x - c.x;
		var qy = points[i].y + pt.y - c.y;
		newpoints[newpoints.length] = new Point(qx, qy, points[i].id);
	}
	return newpoints;
}

function centroid(points) {
	var x = 0.0,
		y = 0.0;
	for (var i = 0; i < points.length; i++) {
		x += points[i].x;
		y += points[i].y;
	}
	x /= points.length;
	y /= points.length;
	return new Point(x, y, 0);
}

function pathDistance(pts1, pts2) // average distance between corresponding points in two paths
{
	var d = 0.0;
	for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
		d += distance(pts1[i], pts2[i]);
	return d / pts1.length;
}

function pathLength(points) // length traversed by a point path
{
	var d = 0.0;
	for (var i = 1; i < points.length; i++) {
		if (points[i].id == points[i - 1].id)
			d += distance(points[i - 1], points[i]);
	}
	return d;
}

function distance(p1, p2) // Euclidean distance between two points
{
	let dx = p2.x - p1.x;
	let dy = p2.y - p1.y;
	return Math.sqrt(dx * dx + dy * dy);
}

export {
	distance,
	pathLength,
	pathDistance,
	centroid,
	greedyCloudMatch,
	translateTo,
	scale,
	resample,
	cloudDistance,
	movePointAlongLine,
	findIntersectionPoint
};
