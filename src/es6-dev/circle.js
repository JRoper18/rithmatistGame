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

		let position = coord.Centroid(points);

		//Find the average distance (radius)
		let distances = 0;
		for (let i = 0; i < points.length; i++) {
			distances += coord.Distance(position, points[i]);
		}
		let radius = distances / points.length;
		if (points.length > Math.round(radius)) {

		} else {
			points = coord.Resample(points, Math.round(radius));
		}
		const MAX = Math.round(radius) * 10; //Health is related to the number of points (10 health per point) which is the Radius. E.g bigger circle = more points = more health
		let health = MAX;
		for (let i = 0; i < points.length; i++) { //Deduct health for each point that's off center.
			let distance = coord.Distance(points[i], position);
			health -= (distance / radius);
			//This means that a big circle will allow for more error.
		}
		let attr = {
			"MaxHealth": MAX,
			"Health": health
		};
		super("Circle", id, player, position, attr);
		this.Points = points;
		this.Radius = radius;
		this.toSimplePolygon();
		this.HasBinded = [];
		this.decompPolygons(this.toSATPolygon());
	}
	toSimplePolygon() { //When someone draws lines they can be complex (self-intersecting) which makes it impossible to detect collisions.
		let longestDistance = 0;
		for (let i = 0; i < this.Points.length; i++) { //Find the longest distance away from center.
			let currentDistance = coord.Distance(this.Position, this.Points[i]);
			if (currentDistance > longestDistance) {
				longestDistance = currentDistance;
			}
		}
		for (let i = 0; i < this.Points.length; i++) { //
			/*
			How this works is that we draw an imaginary line between the center and the point. If we find an intersection from the imaginary line to one of the line segments of the circle,
			 */
			//Make an imaginary line from from the center to this point.
			var endPoint = coord.movePointAlongLine(this.Position, this.Points[i], longestDistance);
			var throughLine = [this.Position, endPoint];
			for (let j = 1; j < this.Points.length; j++) {
				let currentLine = [this.Points[j - 1], this.Points[j]];
				let farthestPoint = coord.Distance(this.Points[i], this.Position);
				let possibleIntersectPoint = coord.findIntersectionPoint(currentLine, throughLine);
				if (!possibleIntersectPoint.isZero()) { //Found intersection
					if (coord.Distance(possibleIntersectPoint, this.Position) > farthestPoint) {
						//Remove the farthestPoint
						this.Points.splice(this.Points.indexOf(farthestPoint), 1);
						farthestPoint = possibleIntersectPoint;
					}
				}
			}

		}
		//Don't forget to reclose the circle
		this.Points.push(this.Points[0]);
	}
	toSATPolygon() {
		let P = SAT.Polygon; //Shortening for easier typing
		let V = SAT.Vector;
		let pointArray = [];
		for (let i = 0; i < this.Points.length; i++) {
			pointArray.push(new V(this.Points[i].X, this.Points[i].Y));
		}
		let polygon = new P(new V(), pointArray);
		return polygon;
	}
	decompPolygons(polygon) {
		console.log(decomp.isSimple(polygon))
		let validPolygons = polygon.getDecompPolygons();
		this.CollisionPolygons = validPolygons;
	}
	averageDistanceFromCenter() {
		let distances = 0;
		for (let i = 0; i < this.Points.length; i++) {
			distances += coord.Distance(new Point(this.Position.X, this.Position.Y), this.Points[i]);
		}
		let avgDistance = distances / this.Points.length;
		return avgDistance;
	}
	moveTo(point) {
		this.Points = coord.TranslateTo(this.Points, point);
		this.Position = point;
	}
	getBinded(object = "Circle") { //depth-first search to find all objects of type object
		let binded = [];
		this.getBindedIncursion(this, object, binded);
		return binded;
	}
	getBindedIncursion(circle, object, binded) {
		if (circle.HasBinded.length !== 0) {
			for (let i = 0; i < circle.HasBinded.length; i++) {
				if (typeof object == "undefined" || circle.HasBinded[i].constructor.name == object || circle.HasBinded[i].constructor.name == "Circle") {
					binded.push(circle.HasBinded[i]);
					this.getBindedIncursion(circle.HasBinded[i], object, binded);
				} else {

				}
			}
		} else {
			binded.push(circle);
		}
	}
	bindRune(rune) {
		this.HasBinded.push(rune);
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
		let radius = this.Radius;
		let r = radius.toString();

		let healthRatio = 1 - (this.Attributes.Health / this.Attributes.MaxHealth);
		let strokeColor = "rgb(" + Math.round(healthRatio * 255).toString() + "," + Math.round(255 * (1 - healthRatio)).toString() + ",0)";

		//perfectCircle is the perfect circle shown for clarity
		//Circle formula for paths found here: http://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path/10477334#10477334
		let perfectCircle = "<path fill='none' stroke='" + strokeColor + "' strokewidth=3 d='M" + this.Position.X + " " + this.Position.Y + "m" + (-1 * radius).toString() + " 0a" + r + "," + r + " 0 1,0 " + (radius * 2).toString() + ",0" + "a " + r + "," + r + " 0 1,0 " + (radius * -2).toString() + ",0" + "'></path>";
		let realCircle = new Rune(this.Points).render();
		realCircle.Type = "CirclePoints";
		return [new RenderedElement(perfectCircle, "CircleTrue"), realCircle];
	}
}
