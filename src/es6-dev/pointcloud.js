import * as coord from './coord.js';
import Point from './point.js';
const NumPoints = 32;

const Origin = new Point(0, 0, 0);

export default class PointCloud {
	constructor(name, points) {
		this.name = name;
		this.points = coord.resample(points, NumPoints);
		this.points = coord.scale(this.points);
		this.points = coord.translateTo(this.points, Origin);
	}
}
