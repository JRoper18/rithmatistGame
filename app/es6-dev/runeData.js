import PDollarRecognizer from './recognizer.js';
import Point from './point.js';
import PointCloud from './pointcloud.js';
export const allRunes = new Array(
	new PointCloud("attack", new Array(
		new Point(0, 300, 1), new Point(0, 0, 1), new Point(100, 50, 1), new Point(0, 100, 1), new Point(100, 150, 1), new Point(0, 200, 1),
		new Point(100, 150, 2), new Point(100, 50, 2)
	)),
	new PointCloud("circle", new Array(
		///0.707 is 1+(1/sqrt2),
		//This isn't a circle, just a diagonal octagon.
		new Point(100, 0, 1), new Point(170, 39, 1), new Point(200, 100, 1), new Point(170, 170, 1), new Point(100, 200, 1), new Point(39, 170, 1), new Point(0, 100, 1), new Point(39, 39, 1), new Point(100, 0, 1)
	)),
	new PointCloud("amplify", new Array(
		new Point(0, 100, 1), new Point(200, 100, 1), new Point(100, 0, 1), new Point(100, 200, 1), new Point(200, 200, 1),
		new Point(50, 150, 2), new Point(150, 50, 2)
	))
);
//Helper functions
export function getUserRunes(recognizer, runes) { //Runes is array of the names of the runes that the user has.
	allRunes.forEach(function(item, index) {
		for (let i = 0; i < runes.length; i++) {
			if (runes[i] == item.Name) {
				recognizer.AddGesture(item.Name, item.Points);
			}
		}
	});
}
export function getRunePoints(gestureName, allRunes) {
	for (let i = 0; i < allRunes.length; i++) {
		if (gestureName == allRunes[i].Name) {
			isARune = true;
			return allRunes[i].Points;
		}
	}
}
