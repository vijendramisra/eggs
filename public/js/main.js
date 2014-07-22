var EggGame = (function() {

    var canvas = document.getElementById('canvas'),
    	collisionMethod = ndgmr.checkPixelCollision,
    	stage, scrWidth, USER_LIFE = 3, scrHeight, eggItem, cloudItem, GLOBAL_SCORE = 0, DEFAULT_SCORE = 10, DEFAULT_SPEED = 150, eggs = [], CREATE_LEVEL = 1000 ;

    window.alphaThresh = 0.60;

    var initLoad = function () {
    	manifest = [
			{id: "egg", src:"images/egg.png"},
			{id: "basket", src:"images/basket.png"},
			{id: "cloud", src:"images/cloud.png"}
		];

		preload = new createjs.LoadQueue();
		preload.addEventListener("complete", doneLoading);
		preload.addEventListener("progress", updateLoading);
		preload.loadManifest(manifest);
    },

    updateLoading = function (e) {
    	var progress = e ? preload.progress*100|0 : 0;
		console.log("Loading: "+progress+"%");
    },

    doneLoading = function () {
    	init();
    },

    init = function () {
    	canvas.onselectstart = function () { return false; };
    	handleStage();
    },

    handleStage = function () {

    	stage = new createjs.Stage(canvas);
    	createjs.Touch.enable(stage);
    	stage.mouseMoveOutside = true;
    	stage.enableMouseOver(10);

    	scrWidth = canvas.width;
    	scrHeight = canvas.height;

    	

    	if (typeof interval != "number"){

			interval = setInterval(function () {
				genrateEgg();
			}, CREATE_LEVEL);
	    }

	    createClouds();
	    createBasket();

    	createjs.Ticker.useRAF = true;
    	createjs.Ticker.setFPS(60);

    	if(!createjs.Ticker.hasEventListener("tick")){
    		createjs.Ticker.addEventListener("tick", tick);
    	}

    },

    genrateEgg = function () {

    	var eggPic = preload.getItem("egg").src,

    		hitArea = new createjs.Shape();

    		hitArea.graphics.beginFill("#ff00cc").drawCircle(0,0,70);

    		eggItem = new createjs.Bitmap(eggPic);

    		eggItem.x = Math.floor(Math.random() * (700 - 70 + 1)) + 70;
    		eggItem.y = 0;
    		eggItem.hitArea = hitArea;

    		eggs.push(eggItem);
    		
    		stage.addChild(eggItem);
    		stage.setChildIndex(eggItem, 0);

    },

    createBasket = function () {

    	var basketPic = preload.getItem("basket").src;

    	basketItem = new createjs.Bitmap(basketPic);

    	basketItem.x = ((scrWidth/2)-64);
    	basketItem.y = (scrHeight-128);

    	stage.addChild(basketItem);
    },

    createClouds = function () {

    	var cloudPic = preload.getItem("cloud").src;

    	var cloudCont = new createjs.Container();

    	cloudItem = new createjs.Bitmap(cloudPic);

    	

    	var cloud2 = cloudItem.clone(),
    		cloud3 = cloudItem.clone(),
    		cloud4 = cloudItem.clone(),
    		cloud5 = cloudItem.clone();

    	cloudItem.y = cloud3.y = cloud5.y = 0;
    	cloudItem.x = 0;

    	cloud2.y = cloud4.y = -40;
    	cloud2.x = 170;

    	cloud3.x = 350;
    	cloud4.x = 520;

    	cloud5.x = 650;

    	
    	cloudCont.addChild(cloudItem, cloud2, cloud3, cloud4, cloud5);
    	

    	

    	stage.addChild(cloudCont);

    	
    	cloudCont.setChildIndex(cloud2, 0);

    },

    reduceScore = function () {

    	if(GLOBAL_SCORE > 0){
    		GLOBAL_SCORE = GLOBAL_SCORE - DEFAULT_SCORE;
    	}
    	else{
    		GLOBAL_SCORE = 0;
    	}

    	document.getElementById("upscore").innerHTML = GLOBAL_SCORE;

    },

    calcScore = function () {
    	GLOBAL_SCORE = GLOBAL_SCORE + DEFAULT_SCORE;
    	document.getElementById("upscore").innerHTML = GLOBAL_SCORE;
    },

    normalCatch = function (itm, num) {

    	var eggClash = collisionMethod(basketItem, itm, window.alphaThresh);

    	if(eggClash) {
    		stage.removeChild(itm);
    		eggs.splice(num,1);
    		calcScore();
    	}
    },

    reduceLife = function () {
    	USER_LIFE = USER_LIFE-1;


		if(USER_LIFE == 3 || USER_LIFE == 2 || USER_LIFE == 1){
			document.getElementById("ulife").innerHTML = USER_LIFE;
		}
		else if(USER_LIFE == 0){
			document.getElementById("ulife").innerHTML = USER_LIFE;
			gameOver();
		}

		return false;
    },

    gameOver = function () {

		clearInterval(interval);
		interval = "";

		for(var l = 0; l < eggs.length; l++){
			stage.removeChild(eggs[l]);
		}

		eggs = [];
		stage.removeChild(basketItem);

		document.getElementById("overmsg").style.display = "block";
		
		setTimeout(function() {
	    	createjs.Ticker.removeEventListener("tick", tick);
		}, 100);

		stage.update();
		
	},


    tick = function (event) {

    	var i = 0, tickerEvent = event, delta, chkEgg, chkNumber;

    	for(; i<eggs.length; i++){
    		
    		delta = tickerEvent.delta;
    		eggs[i].y += delta/1000*((Math.random()*15)+DEFAULT_SPEED);

    		if(eggs[i].y > (scrHeight-100)){
    			stage.removeChild(eggs[i]);
    			eggs.splice(i,1);

    			reduceScore();
    			reduceLife();
    		}

    		if(eggs.length > 0) {

    			chkEgg = eggs[i];
    			chkNumber = i;

    			normalCatch( chkEgg, chkNumber );
    		}
    	}



    	/*document.onkeydown = function(evt){

    		if(evt.keyCode == 39) {

    			basketItem.x +=  (delta/1000)*400;
    		}
    		else if(evt.keyCode == 37) {

    			basketItem.x -= (delta/1000)*400;
    		}
    	};*/

        //console.log(pos);

        if(pos < 0) {
            basketItem.x -= 8;
        }
        else{
            basketItem.x +=  8;
        }

    	stage.update(event);
    };
    
    return {
    	initLoad : function(){
    		initLoad();
    	}
    }

})();

EggGame.initLoad();