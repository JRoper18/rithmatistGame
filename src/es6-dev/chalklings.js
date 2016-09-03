import Chalkling from './chalkling.js';

export class Testling extends Chalkling {
	constructor(id, player, position) {
		super("Testling", id, player, position, {
			"maxHealth": 100,
			"attack": 10,
			"attackRange": 200,
			"movementSpeed": 100,
			"viewRange": 3000,
			"animationData": {
				"IDLE": {
					"frames": 1,
					"time": 1000,
					"size": {
						"x": 259,
						"y": 194
					}
				},
				"WALK": {
					"frames": 6,
					"time": 800,
					"size": {
						"x": 1500,
						"y": 250
					}
				},
				"ATTACK": {
					"frames": 17,
					"time": 2000,
					"size": {
						"x": 10850,
						"y": 374
					}
				},
				"DYING": {
					"frames": 19,
					"time": 1000,
					"size": {
						"x": 6650,
						"y": 250
					}
				}
			},
			"tags": [
        "mobile",
        "destructible",
      ]
		});
	}
}
