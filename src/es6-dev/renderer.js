export default class Renderer {
	constructor(element){
		this.queue = [];
		this.element = element;
		this.stage;
		this.indexLocations = {}; //Stores the first element of a particular z index
		this.renderer;
	}
	setup(callback){
		this.renderer = PIXI.autoDetectRenderer(1000, 500);
		this.renderer.backgroundColor = 0xffffff;
		document.getElementById(this.element).append(this.renderer.view);
		this.stage = new PIXI.Container();
		PIXI.loader
			.add("./chalklings/Testling/Animations/Idle.png")
			.add("./chalklings/Testling/Animations/Dying.png")
			.add("./chalklings/Testling/Animations/Attack.png")
			.add("./chalklings/Testling/Animations/Walk.png")
			.load(callback);
	}
	addToRenderQueue(graphicsContainer){
		this.queue.push(graphicsContainer);
	}
	updateIndexLocations(insertedNum){
		for(let index of Object.keys(this.indexLocations)){
			if(index > insertedNum){
				this.indexLocations[index]++;
			}
		}
	}
	render(){
		//Make a dictionary of the render order as the key and the elements with that order as the data. 
		for (let renderedElement of this.queue) {
			const num = devConfig.renderOrder[renderedElement.type];
			if(this.indexLocations[num] === undefined){
				let foundHigherIndex = false;
				for(let index of Object.keys(this.indexLocations)){
					if(index > num){
						foundHigherIndex = true;
						this.stage.addChildAt(renderedElement.displayObj, this.indexLocations[index] - 1)
						this.indexLocations[num] = this.indexLocations[index - 1];
						this.updateIndexLocations(num);
						break;
					}
				}
				if(!foundHigherIndex){
					this.stage.addChild(renderedElement.displayObj);
					this.indexLocations[num] = this.stage.children.length - 1;
				}	
			}
			else{
				this.stage.addChildAt(renderedElement.displayObj, this.indexLocations[num]);
				this.updateIndexLocations(num);
			}
		}
		this.renderer.render(this.stage);
		console.log(this.stage);
 		this.queue = [];
	}
}