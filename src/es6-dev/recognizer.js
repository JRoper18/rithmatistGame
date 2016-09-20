import * as coord from './coord.js';
import Point from './point.js';
import PointCloud from './pointcloud.js';
const NumPointClouds = 0;
const NumPoints = 32;
const Origin = new Point(0, 0, 0);
class Result // constructor
{
	constructor(name, score) {
		this.name = name;
		this.score = score;
	}
}


export default class PDollarRecognizer {
	constructor(PointClouds) {
		this.pointClouds = new Array(0);
	}

	//
	// The $P Point-Cloud Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), DeleteUserGestures()
	//
	recognize(pointsInput) {
		let points = JSON.parse(JSON.stringify(pointsInput));
		points = coord.resample(points, NumPoints);
		points = coord.scale(points);
		points = coord.translateTo(points, Origin);
		let b = +Infinity;
		let u = -1;
		for (let i = 0; i < this.pointClouds.length; i++) // for each point-cloud template
		{
			let d = coord.greedyCloudMatch(points, this.pointClouds[i]);
			if (d < b) {
				b = d; // best (least) distance
				u = i; // point-cloud
			} else if (d == b) {
				console.log("HEY! Something messed up with the recognizer. ");
			}
		}
		const resultToReturn = (u == -1) ? new Result("No match.", 0.0) : new Result(this.pointClouds[u].name, b);
		return resultToReturn;
	}
	addGesture(name, pointsInput) {
		let points = JSON.parse(JSON.stringify(pointsInput));
		this.pointClouds[this.pointClouds.length] = new PointCloud(name, points);
		let num = 0;
		for (let i = 0; i < this.pointClouds.length; i++) {
			if (this.pointClouds[i].name == name)
				num++;
		}
		return num;
	}
	deleteUserGestures() {
		this.pointClouds.length = NumPointClouds; // clear any beyond the original set
		return NumPointClouds;
	}
}
