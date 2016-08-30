import * as coord from './coord.js';
import Point from './point.js';
import PointCloud from './pointcloud.js';
const NumPointClouds = 0;
const NumPoints = 32;
const Origin = new Point(0, 0, 0);
class Result // constructor
{
	constructor(name, score) {
		this.Name = name;
		this.Score = score;
	}
}


export default class PDollarRecognizer {
	constructor(PointClouds) {
		this.PointClouds = new Array(0);
	}

	//
	// The $P Point-Cloud Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), DeleteUserGestures()
	//
	Recognize(pointsInput) {
		let points = pointsInput;
		points = coord.Resample(points, NumPoints);
		points = coord.Scale(points);
		points = coord.TranslateTo(points, Origin);

		let b = +Infinity;
		let u = -1;
		for (let i = 0; i < this.PointClouds.length; i++) // for each point-cloud template
		{
			let d = coord.GreedyCloudMatch(points, this.PointClouds[i]);
			if (d < b) {
				b = d; // best (least) distance
				u = i; // point-cloud
			}
		}
		return (u == -1) ? new Result("No match.", 0.0) : new Result(this.PointClouds[u].Name, Math.max((b - 2.0) / -2.0, 0.0));
	}
	AddGesture(name, points) {
		this.PointClouds[this.PointClouds.length] = new PointCloud(name, points);
		let num = 0;
		for (let i = 0; i < this.PointClouds.length; i++) {
			if (this.PointClouds[i].Name == name)
				num++;
		}
		return num;
	}
	DeleteUserGestures() {
		this.PointClouds.length = NumPointClouds; // clear any beyond the original set
		return NumPointClouds;
	}
}
