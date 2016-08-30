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
		points = coord.Resample(points, Math.round(radius));
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
	}
	toSimplePolygon() { //When someone draws lines they can be complex (self-intersecting) which makes it impossible to detect collisions.
		console.log(this.Points.length);
		let newPoints = [this.Points[0], this.Points[1], this.Points[2]];
		let poly = new SAT.Polygon(new SAT.Vector(), []);
		let lastIntersectPoint = null;
		for (let i = 3; i < this.Points.length; i++) {
			const currentLine = [this.Points[i], this.Points[i - 1]];
			for (let j = 1; j < newPoints.length; j++) {
				const checkedLine = [newPoints[j], newPoints[j - 1]];
				const possibleIntersectPoint = coord.findIntersectionPoint(currentLine, checkedLine);
				console.log(possibleIntersectPoint);
				if (!possibleIntersectPoint.isZero()) { //It intersects with a line already checked.
					console.log("INTER");
					if (lastIntersectPoint === null) { //If it's null, that means we are starting a self-intersection that will be cut off.
						lastIntersectPoint = possibleIntersectPoint;
					} else { //Turns out we're on an outside portion, but we just intersected again and now we're back to normal.
						lastIntersectPoint = null;
					}
				} else { //No intersection

				}
			}
			if (lastIntersectPoint === null) { //We're not currently checking points on the outside that will be removed.
				newPoints.push(this.Points[i]);
			}
		}
		console.log(this.Points.length);
		this.Points = newPoints;
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
