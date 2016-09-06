import recognizer from './recognizer';
import Unit from './unit.js';
import * as coord from './coord.js';
import Point from './point.js';
import RenderedElement from './renderedElement.js';
import Rune from './rune.js';
import SAT from './SAT.js';
export default class Circle extends Unit {
	constructor(points, id, player) {
		//Close the circle
		let position = coord.centroid(points);
		super("Circle", id, player, position, {});
		this.points = points;
		this.hasBinded = [];
		this.bindPointsCoord = [];
		this.bindPointsDegrees = [];
		this.getConvexHull();
		this.setHealth();
		this.toSATPolygon();
	}
	setHealth(points) {
		this.points.pop();
		//Find the average distance (radius)
		let distances = 0;
		this.position = coord.centroid(this.points);
		for (let i = 0; i < this.points.length; i++) {
			distances += coord.distance(this.position, this.points[i]);
		}
		let radius = distances / this.points.length;
		const MAX = Math.round(radius) * 10; //Health is related to the number of points (10 health per point) which is the Radius. E.g bigger circle = more points = more health
		let health = MAX;
		for (let i = 0; i < this.points.length; i++) { //Deduct health for each point that's off center.
			let distance = coord.distance(this.points[i], this.position);
			health -= (distance / radius);
			//This means that a big circle will allow for more error.
		}
		this.points.push(this.points[0]);
		this.attributes.maxHealth = MAX;
		this.attributes.health = health;
		this.radius = radius;
	}
	getConvexHull() { //When someone draws lines they can be complex (self-intersecting) which makes it impossible to detect collisions.
		//We need to make a hull of the polygon which is convex: http://www.cs.jhu.edu/~misha/Fall05/09.13.05.pdf
		let firstPoint = new Point(Infinity, Infinity);
		for (let i = 0; i < this.points.length; i++) { //Get the leftmost point to start
			if (this.points[i].x < firstPoint.x) {
				firstPoint = this.points[i];
			}
		}
		let currentPoint = firstPoint;
		let hull = [];
		do {
			hull.push(currentPoint);
			//Using the gift-wrapping algorithm
			let nextPoint;
			if (currentPoint == this.points[0]) {
				nextPoint = this.points[1];
			} else {
				nextPoint = this.points[0];
			}
			for (let i = 0; i < this.points.length; i++) {
				const orientation = ((nextPoint.x - currentPoint.x) * (this.points[i].y - currentPoint.y) - (nextPoint.y - currentPoint.y) * (this.points[i].x - currentPoint.x));
				if (orientation > 0) { //We found a most that is to the left (more outer) than our nextPoint
					nextPoint = this.points[i];
				}
			}
			currentPoint = nextPoint;
			if (currentPoint === undefined) {
				break;
			}
		} while (currentPoint != firstPoint);
		hull.push(firstPoint); //Finish the loop
		this.points = hull;
		this.position = coord.centroid(this.points);
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
		this.collisionPolygon = polygon;
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
	getBinded(onextPointject = "Circle") { //depth-first search to find all objects of type object
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
		const pointOfBinding = coord.movePointAlongLine(this.position, rune.position, this.radius);
		const pointInDegrees = Math.atan((pointOfBinding.y - this.position.y) / (pointOfBinding.x - this.position.x)) * (180 / Math.PI);
		this.bindPointsCoord.push(pointOfBinding);
		this.bindPointsDegrees.push(pointInDegrees);
		this.hasBinded.push(rune);
		let possibleBindPoints = {
			"2": [0, 180], //Two point
			"4": [0, 90, 180, -90], //Four point
			"6": [0, 60, 120, 180, -120, -60], //Six Point
			//Nine-point circle guessed based on this image: https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Nine-point_circle.svg/2000px-Nine-point_circle.svg.png\
			//TODO: Calculate points for 9 point circle
			"9": [0, 60, 100, 165, 180, 225, 235, 245, 335]
		};
		if (this.hasBinded.length !== 1) { //Nothing has been binded yet, so let this be the first point.
			//We need to eliminate possible bind point configurations.
			if (this.hasBinded.length > 3) {
				delete possibleBindPoints['2'];
			}
			if (this.hasBinded.length > 5) {
				delete possibleBindPoints['4'];
			}
			if (this.hasBinded.length > 7) {
				delete possibleBindPoints['6'];
			}
			//We need to rotate our circle to make the first point 0.
			const offset = this.bindPointsDegrees[0];
			const errorGiven = devConfig.bindPointErrorGiven;
			let rotatedPoints = [];
			for (let i = 0; i < this.bindPointsDegrees.length; i++) {
				const rotatedPoint = this.bindPointsDegrees[i] - offset;
				if (Math.abs(rotatedPoint - 90) < errorGiven || Math.abs(rotatedPoint + 90) < errorGiven) { //Telltale way to check if we're dealing with 4 point circle is to see if we have a 90 degree turn somewhere
					delete possibleBindPoints['2'];
					delete possibleBindPoints['6'];
					delete possibleBindPoints['9'];
				} else if (Math.abs(rotatedPoint - 60) < errorGiven) {
					delete possibleBindPoints['2'];
					delete possibleBindPoints['4'];
				} else if (Math.abs(rotatedPoint + 60) < errorGiven || Math.abs(rotatedPoint - 120) < errorGiven) {
					delete possibleBindPoints['2'];
					delete possibleBindPoints['4'];
					delete possibleBindPoints['9'];
				}
				rotatedPoints.push(rotatedPoint);
			}
			//We now have the possible bind point configuration
			let bestBindPointConfigError = Infinity;
			let bestBindPointConfig;
			let currentBindPoints = rotatedPoints;
			let availibleBindPoints = Object.assign({}, possibleBindPoints);
			let newRuneAccuracy;
			for (let bindPointConfigId in availibleBindPoints) {
				if (possibleBindPoints.hasOwnProperty(bindPointConfigId)) { //FIXME: RIght now, the bind points are checked in a way such that if we have points that match, but then another point might match better, it won't find out.
					let bindPointConfig = availibleBindPoints[bindPointConfigId];
					let bindPointConfigError = 0;
					let newRuneAccuracyForThisConfig;
					//Calculate the strength of our current bind point configuration
					for (let i = 0; i < currentBindPoints.length; i++) {
						let closestBindPointError = Infinity;
						let closestBindPoint;
						for (let bindPointId in bindPointConfig) {
							let bindPoint = bindPointConfig[bindPointId];
							let tempBindPointError = Math.abs(bindPoint - currentBindPoints[i]);
							if (tempBindPointError < closestBindPointError) {
								closestBindPoint = bindPoint;
								closestBindPointError = tempBindPointError;

							}
						}
						//We found the closest one, dont let multiple points be assigned to the same bindpoint. If we're checking the last (new) bindpoint, save it for later.
						if (i == currentBindPoints.length - 1) {
							newRuneAccuracyForThisConfig = closestBindPointError;
						}
						bindPointConfig.splice(bindPointConfig.indexOf(closestBindPoint), 1);
						bindPointConfigError += closestBindPointError;
					}
					if (bindPointConfigError < bestBindPointConfigError) {
						bestBindPointConfig = possibleBindPoints[bindPointConfigId];
						bestBindPointConfigError = bindPointConfigError;
						newRuneAccuracy = newRuneAccuracyForThisConfig;
					}
				}
			}
			//Found best point configuration. Take away maxhealth of our rune based on our accuracy towards the bindpoint.
			rune.attributes.maxHealth -= newRuneAccuracy;
			rune.attributes.health -= newRuneAccuracy;
			this.bindPointConfig = bestBindPointConfig.length;
		}
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
