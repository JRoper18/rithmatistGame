import recognizer from './recognizer';
import Unit from './unit.js';
import * as coord from './coord.js';
import Point from './point.js';
import RenderedElement from './renderedElement.js';
import Rune from './rune.js';
export default class Circle extends Unit {
	constructor(points, id, player) {
		points.push(points[0]);
		//Close the circle

		let position = coord.centroid(points);

		//Find the average distance (radius)
		let distances = 0;
		for (let i = 0; i < points.length; i++) {
			distances += coord.distance(position, points[i]);
		}
		let radius = distances / points.length;
		if (points.length > Math.round(radius)) {

		} else {
			points = coord.resample(points, Math.round(radius));
		}
		const MAX = Math.round(radius) * 10; //Health is related to the number of points (10 health per point) which is the Radius. E.g bigger circle = more points = more health
		let health = MAX;
		for (let i = 0; i < points.length; i++) { //Deduct health for each point that's off center.
			let distance = coord.distance(points[i], position);
			health -= (distance / radius);
			//This means that a big circle will allow for more error.
		}
		let attr = {
			"maxHealth": MAX,
			"health": health
		};
		super("Circle", id, player, position, attr);
		this.points = points;
		this.radius = radius;
		this.toSimplePolygon();
		this.hasBinded = [];
		this.decompPolygons(this.toSATPolygon());
	}
	toSimplePolygon() { //When someone draws lines they can be complex (self-intersecting) which makes it impossible to detect collisions.
		let longestDistance = 0;
		for (let i = 0; i < this.points.length; i++) { //Find the longest distance away from center.
			let currentDistance = coord.distance(this.position, this.points[i]);
			if (currentDistance > longestDistance) {
				longestDistance = currentDistance;
			}
		}
		for (let i = 0; i < this.points.length; i++) { //
			/*
			How this works is that we draw an imaginary line between the center and the point. If we find an intersection from the imaginary line to one of the line segments of the circle, we then check if there's another point that's farther out from the center. If there is, that farther out point is taken as the new point, and the one on the inside is removed. This way the polygon takes all the points and just makes the biggest, non-complex polygon it can with them.
			 */
			//Make an imaginary line from from the center to this point.
			var endPoint = coord.movePointAlongLine(this.position, this.points[i], longestDistance);
			var throughLine = [this.position, endPoint];
			for (let j = 1; j < this.points.length; j++) {
				let currentLine = [this.points[j - 1], this.points[j]];
				let farthestPoint = coord.distance(this.points[i], this.position);
				let possibleIntersectPoint = coord.findIntersectionPoint(currentLine, throughLine);
				if (!possibleIntersectPoint.isZero()) { //Found intersection
					if (coord.distance(possibleIntersectPoint, this.position) > farthestPoint) {
						//Remove the farthestPoint
						this.points.splice(this.points.indexOf(farthestPoint), 1);
						farthestPoint = possibleIntersectPoint;
					}
				}
			}
		}
		//Don't forget to reclose the circle
		this.points.push(this.points[0]);
	}
	toSATPolygon() {
		let P = SAT.Polygon; //Shortening for easier typing
		let V = SAT.Vector;
		let pointArray = [];
		for (let i = 0; i < this.points.length; i++) {
			pointArray.push(new V(this.points[i].x, this.points[i].y));
		}
		let polygon = new P(new V(), pointArray);
		//Now check to see if we are clockwise or counter-clockwise : http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
		return polygon;
	}
	decompPolygons(polygon) {
		let validPolygons = polygon.getDecompPolygons();
		this.collisionPolygons = validPolygons;
	}
	averageDistanceFromCenter() {
		let distances = 0;
		for (let i = 0; i < this.points.length; i++) {
			distances += coord.distance(new Point(this.position.x, this.position.y), this.points[i]);
		}
		let avgDistance = distances / this.points.length;
		return avgDistance;
	}
	moveTo(point) {
		this.points = coord.translateTo(this.points, point);
		this.position = point;
	}
	getBinded(object = "Circle") { //depth-first search to find all objects of type object
		let binded = [];
		this.getBindedIncursion(this, object, binded);
		return binded;
	}
	getBindedIncursion(circle, object, binded) {
		if (circle.hasBinded.length !== 0) {
			for (let i = 0; i < circle.hasBinded.length; i++) {
				if (typeof object == "undefined" || circle.hasBinded[i].constructor.name == object || circle.hasBinded[i].constructor.name == "Circle") {
					binded.push(circle.hasBinded[i]);
					this.getBindedIncursion(circle.hasBinded[i], object, binded);
				} else {

				}
			}
		} else {
			binded.push(circle);
		}
	}
	bindRune(rune) {
		this.hasBinded.push(rune);
	}
	renderBinded() {
		let renderString = '';
		let binded = getBinded(this);
		for (let i = 0; i < binded; i++) {
			renderString = +(binded[i].render());
		}
		return renderString;
	}
	render() {
		let radius = this.radius;
		let r = radius.toString();

		let healthRatio = 1 - (this.attributes.health / this.attributes.maxHealth);
		let strokeColor = "rgb(" + Math.round(healthRatio * 255).toString() + "," + Math.round(255 * (1 - healthRatio)).toString() + ",0)";

		//perfectCircle is the perfect circle shown for clarity
		//Circle formula for paths found here: http://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path/10477334#10477334
		let perfectCircle = "<path fill='none' stroke='" + strokeColor + "' strokewidth=3 d='M" + this.position.x + " " + this.position.y + "m" + (-1 * radius).toString() + " 0a" + r + "," + r + " 0 1,0 " + (radius * 2).toString() + ",0" + "a " + r + "," + r + " 0 1,0 " + (radius * -2).toString() + ",0" + "'></path>";
		let realCircle = new Rune(this.points).render();
		return [new RenderedElement(perfectCircle, "CircleTrue"), realCircle];
	}
}
