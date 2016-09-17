import PDollarRecognizer from './recognizer';
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
		this.bindPointConfig = 2;
		this.getConvexHull();
		this.setHealth();
		this.deductHealth();
		this.toSATPolygon();
	}
	setHealth() {
		this.points.pop();
		//Find the average distance (radius)
		let distances = 0;
		this.position = coord.centroid(this.points);
		for (let i = 0; i < this.points.length; i++) {
			distances += coord.distance(this.position, this.points[i]);
		}
		let radius = distances / this.points.length;
		this.radius = radius;

		const MAX = Math.round(this.radius) * 10; //Health is related to the number of points (10 health per point) which is the Radius. E.g bigger circle = more points = more health
		let health = MAX;
		this.attributes.possibleHealth = MAX;
		this.attributes.health = health;
	}
	deductHealth() {
		let health = this.attributes.health;
		for (let i = 0; i < this.points.length; i++) { //Deduct health for each point that's off center.
			let distance = coord.distance(this.points[i], this.position);
			health -= (distance / this.radius);
			//This means that a big circle will allow for more error.
		}
		this.points.push(this.points[0]);
		this.attributes.maxHealth = health;
		this.attributes.health = health;
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
			nextPoint = this.points[0];
			while (nextPoint == currentPoint) { //Make sure the first point we use isn't the currentPoint o that we aren't stuck in infinite loop.
				nextPoint = this.points[Math.round(Math.random() * this.points.length) - 1];
			}
			//BUG: This whole function might get stuck in an infinite loop. It has in the past, BUT hopefully the above while loop will fix it. If it pops up again look here.
			for (let i = 0; i < this.points.length; i++) {
				const orientation = ((nextPoint.x - currentPoint.x) * (this.points[i].y - currentPoint.y) - (nextPoint.y - currentPoint.y) * (this.points[i].x - currentPoint.x));
				if (orientation > 0) { //We found a most that is to the left (more outer) than our nextPoint
					nextPoint = this.points[i];
				}
			}
			if (currentPoint == nextPoint) {
				//Shit, stuck in an infinite loop
				alert("Oh shit, IT HAPPENED AGAIN");
				break;
			}
			currentPoint = nextPoint;
		}
		while (currentPoint != firstPoint);
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
	getBinded(object) { //depth-first search to find all objects of type object
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
		let pointOfBinding = coord.movePointAlongLine(this.position, rune.position, this.radius);
		pointOfBinding.id = 1;
		const pointInDegrees = Math.atan((pointOfBinding.y - this.position.y) / (pointOfBinding.x - this.position.x)) * (180 / Math.PI);
		this.bindPointsCoord.push(pointOfBinding);
		this.bindPointsDegrees.push(pointInDegrees);
		this.hasBinded.push(rune);
		if (this.bindPointsDegrees.length > 1) {
			const offset = this.bindPointsDegrees[0];
			let pointsOffsetCoord = [];
			for (let point in this.bindPointsDegrees) {
				pointsOffsetCoord.push(this.getDegreePoint(this.bindPointsDegrees[point] - offset));
			}
			const recognizer = new PDollarRecognizer();
			if (this.hasBinded.length <= 6) {
				recognizer.addGesture("6", [new Point(300, 150), new Point(225, 280), new Point(75, 280), new Point(0, 150), new Point(75, 20), new Point(225, 20)]);
			}
			if (this.hasBinded.length <= 4) {
				recognizer.addGesture("4", [new Point(2, 1), new Point(1, 2), new Point(0, 1), new Point(1, 0)]);
			}
			if (this.hasBinded.length <= 2) {
				recognizer.addGesture("2", [new Point(2, 1), new Point(0, 1)]);
			}
			recognizer.recognize(pointsOffsetCoord);
		}
		/*
		if (this.bindPointsCoord.length > 1) {
			const possibleBindPoints = [
				[0, 180], //Two point
				[0, 90, 180, -90], //Four point
				[0, 60, 120, 180, -120, -60], //Six Point
				//Nine-point circle guessed based on this image: https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Nine-point_circle.svg/2000px-Nine-point_circle.svg.png\
				//TODO: Calculate points for 9 point circle rather than guesstimate
				[0, 60, 100, 165, 180, 225, 235, 245, 335]
			];
			let availibleBindPoints = JSON.parse(JSON.stringify(possibleBindPoints));
			const errorGiven = devConfig.bindPointErrorGiven;

			if (this.hasBinded.length !== 1) { //Nothing has been binded yet, so let this be the first point.
				//We need to eliminate possible bind point configurations.
				if (this.hasBinded.length > 3) {
					delete availibleBindPoints['2'];
				}
				if (this.hasBinded.length > 5) {
					delete availibleBindPoints['4'];
				}
				if (this.hasBinded.length > 7) {
					delete availibleBindPoints['6'];
				}
				//We need to rotate our circle to make the first point 0.
				let rotatedPoints = [];
				for (let i = 0; i < this.bindPointsDegrees.length; i++) {
					const rotatedPoint = this.bindPointsDegrees[i] - offset;
					if (Math.abs(rotatedPoint - 90) < errorGiven || Math.abs(rotatedPoint + 90) < errorGiven) { //Telltale way to check if we're dealing with 4 point circle is to see if we have a 90 degree turn somewhere
						delete availibleBindPoints['2'];
						delete availibleBindPoints['6'];
						delete availibleBindPoints['9'];
					} else if (Math.abs(rotatedPoint - 60) < errorGiven) {
						delete availibleBindPoints['2'];
						delete availibleBindPoints['4'];
					} else if (Math.abs(rotatedPoint + 60) < errorGiven || Math.abs(rotatedPoint - 120) < errorGiven) {
						delete availibleBindPoints['2'];
						delete availibleBindPoints['4'];
						delete availibleBindPoints['9'];
					}
					rotatedPoints.push(rotatedPoint);
				}
				//We now have the possible bind point configuration
				let bestBindPointConfigError = Infinity;
				let bestBindPointConfig;
				let currentBindPoints = rotatedPoints;
				let newRuneAccuracy;
				for (let bindPointConfigId in availibleBindPoints) {
					if (possibleBindPoints.hasOwnProperty(bindPointConfigId)) { //FIXME: Right now, the bind points are checked in a way such that if we have points that match, but then another point might match better, it won't find out.
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
						if (bindPointConfigError < bestBindPointConfigError || (bindPointConfigError == bestBindPointConfigError && possibleBindPoints[bindPointConfigId].length < bestBindPointConfig.length)) {
							bestBindPointConfig = possibleBindPoints[bindPointConfigId];
							bestBindPointConfigError = bindPointConfigError;
							newRuneAccuracy = newRuneAccuracyForThisConfig;
						}
					}
				}
		//Found best point configuration. Take away maxhealth of our rune based on our accuracy towards the bindpoint.
		rune.attributes.maxHealth /= newRuneAccuracy;
		rune.attributes.health /= newRuneAccuracy;
		this.bindPointConfig = bestBindPointConfig.length;
	}
	debugger;
}
*/

	}
	getDegreePoint(angleInDegrees) {
		let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
		return new Point(
			this.position.x + (this.radius * Math.cos(angleInRadians)),
			this.position.y + (this.radius * Math.sin(angleInRadians)),
			1
		);
	}
	getArcPath(startDeg, finishDeg) {
		const start = this.getDegreePoint(finishDeg);
		const end = this.getDegreePoint(startDeg);

		const largeArcFlag = finishDeg - startDeg <= 180 ? "0" : "1";
		const d = [
		"M", start.x, start.y,
		"A", this.radius, this.radius, 0, largeArcFlag, 0, end.x, end.y
	].join(" ");

		return d;
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
		const swidth = devConfig.circleHealthStrokeWidth;
		const deductRatio = 360 * (1 - (this.attributes.maxHealth / this.attributes.possibleHealth));
		const deductedHealth = `<path fill='none' stroke='black' stroke-width='${swidth}' d='${this.getArcPath(0, deductRatio)}'></path>`;
		const maxHealthCircle = `<path fill='none' stroke='red' stroke-width='${swidth}' d='${this.getArcPath(deductRatio, 360)}'></path>`;
		const healthLeftCircle = `<path fill='none' stroke='green' stroke-width='${swidth}' d='${this.getArcPath(deductRatio + (healthRatio * (360-deductRatio)), 360)}'></path>`;
		let realCircle = new Rune(this.points).render();
		return [new RenderedElement(maxHealthCircle, "CircleTrue"), new RenderedElement(healthLeftCircle, "CircleTrue"), new RenderedElement(deductedHealth, "CircleTrue"), realCircle];
	}
}
