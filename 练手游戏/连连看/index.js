/*
*
* Author : Magician_Shiro
*
*
*/
var Ligature = function(option){
	this._init(option);
}

Ligature.prototype = {
	_init:function(option){
		// 定义一共有多少行
		this.row = option.rowAndCol || 6;
		// 定义一共多少列
		this.col = option.rowAndCol || 6;
		// 定义图片的种类数量
		this.imgType = option.imgType || 16;
		// 定义要游戏区域的大小
		this.canvas = option.canvas || 600;

		// 图片的总数量
		this.imgTotal = this.row*this.col;

		// 因为上下左右需要有1栏空白栏
		// 定义一列应有的元素(即实际上一共有多少行)
		this.imgRow = this.row + 2;
		// 定义一行应有的元素(即实际上一共有多少列)
		this.imgCol = this.col + 2;

		// 定义一个二维数组，一维表示行数，二维表示列数
		this.dimenArr = new Array(this.imgRow);
		//获取数组的长度
		this.dimenArrLength = this.dimenArr.length;

		for(var i=0;i<this.dimenArrLength;i++){
			this.dimenArr[i] = new Array(this.imgCol);
		}

		//定义一个数组里面按对数存图片名  2张图片为1对
		this.dbimgArr = [];
		//获取对数
		this.twain = this.row*this.col/2;
		for(var j=0,n=0,imgTp=0;j<this.twain;j++,n+=2){
			//如果种类用完了，就从头再取
			if(imgTp == this.imgType){
				imgTp = 0;
			}
			imgTp = imgTp+1;
			//按照一对一对往数组里面存入图片名
			this.dbimgArr[n] = imgTp;
			this.dbimgArr[n+1] = imgTp;
		}

		//定义一个打乱后的数组
		this.randomArr = [];

		//设置一个变量来获取点击的对象
		this.temp = null;

		//设置一个数组，保存两次点击图片位置的行数和列数
		this.pathInfo = [{x:0,y:0},{x:0,y:0}];

		//获取table元素
		this.table = document.getElementById('table');
	},
	// 游戏开始
	gameStart:function(){
		//打乱数组的顺序
		this.getRandomArr();
		//给table中创建表格
		this.createTable();
		this.createGame();
	},
	// 打乱数组
	getRandomArr:function(){
		//创建一个长度和存图片名的数组长度一样的一个空数组1
		var randomArr1 = new Array(this.dbimgArr.length);
		//给这个数组赋值
		for(var i=0;i<randomArr1.length;i++){
			randomArr1[i] = i;
		}
		// 创建一个长度和存图片名的数组长度一样的空数组2
		var randomArr2 = new Array(this.dbimgArr.length);
		//打乱数组1中的值放入数组2中
		for(var j=0; j<randomArr2.length;j++){
			randomArr2[j] = randomArr1.splice(Math.floor(Math.random()*randomArr1.length),1);
		}
		// 创建一个长度和存图片名的数组长度一样的空数组3
		//把数组2中的值当做索引来打乱原数组放在数组3中
		var randomArr3 = new Array(this.dbimgArr.length);
		for(var k=0;k<randomArr3.length;k++){
			randomArr3[k] = this.dbimgArr[randomArr2[k]];
		}
		this.randomArr = randomArr3;
	},
	// 创建表格
	createTable:function(){
		var n=0;
		//遍历二维数组来创建行数和列数
		for(var i=0;i<this.dimenArr.length;i++){
			//创建tr 
			var trObj = document.createElement('tr');
			//添加到table中
			this.table.appendChild(trObj);
			for(var j=0;j<this.dimenArr[i].length;j++){
				//创建td
				var tdObj = document.createElement('td');
				// 给表格创建大小
				tdObj.style.width = this.canvas/this.imgRow +'px';
				tdObj.style.height = this.canvas/this.imgCol + 'px';

				//将td添加到tr中
				trObj.appendChild(tdObj);
				//如果不为第一行，最后一行，第一列，最后一列，就给td里面添加图片元素
				if(i == 0 || i == this.dimenArr.length-1 || j==0 || j == this.dimenArr[i].length-1){
					this.dimenArr[i][j] = 0;
				}else{
					//创建一个img标签
					var imgObj = document.createElement('img');
					//添加到td中
					tdObj.appendChild(imgObj);

					//给数值中添加打乱后的图片索引值
					this.dimenArr[i][j] = this.randomArr[n];
					n++;					
	
				}
				//如果二维数组中存储的不是0,即代表有图片
				if(this.dimenArr[i][j]>0){
					//改变img的src的值
					imgObj.src = "images/"+this.dimenArr[i][j]+".jpg";
					// 给每个img添加一个坐标索引
					imgObj.indexX = i;
					imgObj.indexY = j;
				}
			}
		}
	},
	// 创建这个游戏
	createGame:function(){
		var imgObj = document.querySelectorAll('td img');
		for(var i=0;i<imgObj.length;i++){	
			imgObj[i].onclick = this.clickHandle(imgObj[i].indexX,imgObj[i].indexY);
		}
	},
	/*
	* 处理点击事件
	*
	* @param integer x
	* @param integer y
	*
	*/
	clickHandle:function(x,y){
		//获取对象 此时obj就是Ligature
		var obj = this;		
		// 第一次点击的图
		var fristImg = null;
		// 第二次点击的图
		var secondImg = null;
		//定义所有路径
		var allPath = null; 
		// 定义最短路径
		var shortPath = null;
		// 点的坐标和相交点的绘线方向
		var pathAndDirection = null;
		
		return function(){						
			//判断点击的位置是否有图片
			if(obj.dimenArr[x][y]){			
				
				//如果是第一次点击图片
				if(obj.temp == null){
					obj.temp = this;
	
					//改变单元格的的背景颜色
					this.parentNode.style.backgroundColor = "red";	
					//将此时的行数和列数存入数组中
					obj.pathInfo[0].x = x;
					obj.pathInfo[0].y = y;

				}else if(obj.temp != this){  //两次点击的不是同一张图
					
					//清除单元格颜色
					obj.temp.parentNode.style.backgroundColor = '';
					//将此时的行数和列数存入数组中
					obj.pathInfo[1].x = x;
					obj.pathInfo[1].y = y;

					//如果两张图片是同一类型
					if(obj.dimenArr[obj.pathInfo[0].x][obj.pathInfo[0].y] == obj.dimenArr[obj.pathInfo[1].x][obj.pathInfo[1].y] ){

						// 获取路径返回值
						allPath = obj.feasiblePath(obj.pathInfo[0],obj.pathInfo[1]);
						//检查路径是否可行
						if(allPath){
							// 拿到两张图片的DOM元素
							firstImg = obj.temp;
							secondImg = this;
							// 如果两张图不相邻相邻
							if(typeof allPath != "boolean"){

								console.log("==========两张能够连通的图片所有连通方式=========")
								console.log(allPath);
								// 获取最短路径
								shortPath = obj.getShortPath(allPath);
								console.log("===============所有路径中的最短路径===========");
								console.log(shortPath);
								// 获得路径点和相交点的绘线方向的对象
								pathAndDirection = obj.direction(shortPath);
								console.log("======下面是最短路径点 以及 两个交点的方向应该绘制线的方向=========");
								console.log(pathAndDirection);

								// 绘制线
								obj.pathCoordinate(pathAndDirection);

								// 获取div元素，清除掉练的线以及图片
								var divObj = document.querySelectorAll('td div');

								// 因为这里会延迟执行，但是不会阻塞后续代码的执行
								// 因此最后的obj.temp=null会先执行
								// 因此需要提前获取想要消除的两张图片的DOM元素,即firstImg和secondImg								
								setTimeout(function(){
								
									divObj.forEach(function(element,index){
										element.parentNode.removeChild(element);
									});
									
									//删除掉此时的2张图片
									firstImg.parentNode.removeChild(firstImg);
									secondImg.parentNode.removeChild(secondImg);
								},200)
							}else{
								//两张图片相邻就快速清除
								firstImg.parentNode.removeChild(firstImg);
								secondImg.parentNode.removeChild(secondImg);
							}
														
							//将二维数组中的他的值清空，防止再次点击
							obj.dimenArr[obj.pathInfo[0].x][obj.pathInfo[0].y] = 0;
							obj.dimenArr[obj.pathInfo[1].x][obj.pathInfo[1].y] = 0;

							//让图片数减去2
							obj.imgTotal -= 2;

							console.log("==========================一轮结束==============================");

							if(obj.imgTotal == 0){
								setTimeout(function(){
									alert('完成');
								},300)								
							} 						
						}
					}
					obj.temp = null;
				}else{
					obj.temp.parentNode.style.backgroundColor = '';
					obj.temp = null
				}

			}else{
				temp = null;
			}
		}
	},
	/*
	* 判断路径是否可行
	*
	* @param object A
	* @param object B
	*
	*/
	feasiblePath:function(A,B){  //A表示第一个点击的图片行列对象，B表示第二次点击的
		//如果两张图片相邻，直接消除
		if(this.checkAdjacent(A,B)){
			return true;
		}

		//获取A点和B点的十字线
		var aPaths = this.getPaths(A);
		var bPaths = this.getPaths(B);

		// 定义一个控制器
		var flag = false;
		// 定义一个数组,存储相邻的路径
		var nearPath = [];

		//遍历A点的十字线
		for(var i=0;i<aPaths.length;i++){
			//如果节点上存在图片，则跳出此次循环			
			if(this.dimenArr[aPaths[i].x][aPaths[i].y]){
		
				continue;
			}
			//判断A点到十字线上的某个点的连线上是否有图片
			if(!this.checkTwoPath(aPaths[i],A)){
			
				continue;
			}
	
			//获取B点与A点十字线上的某个点同行列的点
			var bPositions = this.getSamePostions(bPaths,aPaths[i]);

			//遍历点的个数,一共只要2个点
			for(var j=0;j<bPositions.length;j++){
				//如果点上事图片,则跳出当前循环
				if(this.dimenArr[bPositions[j].x][bPositions[j].y]){
					continue;
				}	
				//判断这个点点到B点之间有没有图片
				if(!this.checkTwoPath(bPositions[j],B)){
					continue;
				}
				//判断交点到A点上找交点的点之间有没有图片
				if(this.checkTwoPath(aPaths[i],bPositions[j])){
					// return true;
					flag = true;
					// nearPath.push({"交点1":aPaths[i],"交点2":bPositions[j],"A点":A,"B点":B});
					nearPath.push({"crossA":aPaths[i],"crossB":bPositions[j],"A":A,"B":B});
				}
			}
		}

		if(flag){
			return nearPath;
		}else{
			return false;
		}

	},
	//检查是否相邻
	checkAdjacent:function(A,B){
		//定义一个临时数组,判断上下左右四个方向是否邻近
		var tempArr = [-1,1];
		//遍历数组
		for(var i=0;i<tempArr.length;i++){
			//如果上下相邻,就返回true
			if(A.y == B.y && A.x == B.x+tempArr[i]){
				return true;
			}
			//如果左右相邻，返回ture
			if(A.x == B.x && A.y == B.y+tempArr[i]){
				return true;
			}
		}
	},
	/*
	* 获取十字线
	*
	* @param object element
	* return object 
	* 
	*/
	getPaths:function(element){  //获取点击图片的行数和列数
		//定义一个数组来存放十字线
		var paths = [];
		//遍历一共的行数
		for(var i=0;i<this.imgRow;i++){
			//列数不变，行数从0到最大
			paths.push({x:i,y:element.y});
		}
		//遍历一共的列数
		for(var j=0;j<this.imgCol;j++){
			//行数不变，列数从0到最大
			paths.push({x:element.x,y:j});
		}

		return paths;
	},
	// 判断两个点的连线上是否有图片
	checkTwoPath:function(target,current){
		//如果是同一列
		if(current.y == target.y){
			//遍历一行上不为点击的图片的行的所有十字线上的点
			for(var i=target.x;i<current.x?i<current.x:i>current.x;i<current.x?i++:i--){
				//如果含有图片 就返回false
				if(this.dimenArr[i][current.y]){
					return false;
				}
			}

		}else{
			//如果是同一行
			if(current.x == target.x){
				//遍历一列上不为点击的图片的列的所有十字线上的点
				for(var j=target.y;j<current.y?j<current.y:j>current.y;j<current.y?j++:j--){
					//如果含有图片 就返回false
					if(this.dimenArr[current.x][j]){
						return false;
					}
				}
			}
		}
		return true;
	},
	// 获取B点和有效点A同行同列的两个点
	getSamePostions:function(target,current){
		//定义一个数组存放同行同列的两个点的位置
		var paths = [{x:0,y:0},{x:0,y:0}]
		//遍历目标位置的十字线
		for(var i=0;i<target.length;i++){
			//如果在同一行
			if(current.x == target[i].x){
				paths[0].x = target[i].x;
				paths[0].y = target[i].y;
			}

			//如果在同一列
			if(current.y == target[i].y){
				paths[1].x = target[i].x;
				paths[1].y = target[i].y;
			}
		}
		return paths;
	},
	// 获取最短路径
	getShortPath:function(nearPath){
		var flag = true;

		// 定义一个数组用来存放路径的长度
		var pathLength = [];

		// 定义一个最短路径 
		var shortPath = null;

		// 如果只有一条路径
		if(nearPath.length==1){
			// console.log(nearPath);
			shortPath = nearPath[0];
			// this.direction(nearPath[0]);
		}else{
			// 遍历这个对象
			for (var i = 0; i < nearPath.length; i++) {
				// 如果两个交点重合的话，此时就是最短路径
				if(nearPath[i].crossA.x == nearPath[i].crossB.x && nearPath[i].crossA.y==nearPath[i].crossB.y){
					flag = false;
					shortPath = nearPath[i];
					break;
				}
			}

			if(flag){
				for (var i = 0; i < nearPath.length; i++) {
					pathLength.push({'index':i,"value":this.getPathLength(nearPath[i].crossA,nearPath[i].A)+this.getPathLength(nearPath[i].crossB,nearPath[i].B)+this.getPathLength(nearPath[i].crossA,nearPath[i].crossB)});					
				}
				
				// 升序排序得到最小值，拿到的值就是最短路径的索引
				pathLength.sort(function(obj1,obj2){
					return obj1.value>obj2.value ? 1 : -1;
				})
				// 获得到最短路径
				console.log("这是算出来的最短路径");
				shortPath = nearPath[pathLength[0].index];
			}
		
		}

		return shortPath;
	},
	// 获取路径的长度值，以便比较出最短路径
	getPathLength:function(currentCoords,targetCoords){

		// 如果x值坐标相等就获取y值的差值的绝对值，如果y值相等就获取x值差值的绝对值
		if(currentCoords.x==targetCoords.x){
			return Math.abs(currentCoords.y-targetCoords.y-1);
		}else if(currentCoords.y == targetCoords.y){
			return Math.abs(currentCoords.x-targetCoords.x-1);
		}
	},
	// 获取交点绘线的方向
	direction:function(pathObj){
		var directionA = '';
		var directionB = '';
		
		// 定义一个对象用来存放焦点的绘线方向和4个点的坐标
		var pointAndCrossDirection = {
			"point":pathObj
		};

		// A点和A点十字线上的点在同一行上
		if(pathObj.A.x==pathObj.crossA.x){
			directionA +=pathObj.A.y - pathObj.crossA.y >0 ? "Right" : "Left";
		}else if(pathObj.A.y == pathObj.crossA.y){
			// B点和B点十字线上的点在同一列上
			directionA += pathObj.A.x - pathObj.crossA.x >0 ? "bottom" : "top";
		}
		// B点和B点十字线上的点在同一行上
		if(pathObj.B.x==pathObj.crossB.x){
			directionB +=pathObj.B.y - pathObj.crossB.y >0 ? "Right" : "Left";
		}else if(pathObj.B.y == pathObj.crossB.y){
			// B点和B点十字线上的点在同一列上
			directionB += pathObj.B.x - pathObj.crossB.x >0 ? "bottom" : "top";
		}

		// 如果交点是重合的话
		if(pathObj.crossA.x == pathObj.crossB.x && pathObj.crossA.y==pathObj.crossB.y){

			// 如果4个点在一条线上，就不转画转角线
			if((pathObj.A.x==pathObj.crossA.x && pathObj.B.x==pathObj.crossB.x)||(pathObj.A.y==pathObj.crossA.y && pathObj.B.y==pathObj.crossB.y)){
				// console.log('在一条线上');
			}else{
				// 两个交点一致
				directionA = directionA+directionB;
				directionB = directionA;
				// 格式化字符串
				pointAndCrossDirection.crossDirection = {'A':this.formatStr(directionA),"B":this.formatStr(directionB)};
					
			}

		}else{
			// 交点非重合
			// 两个焦点在同一行上
			if(pathObj.crossA.x == pathObj.crossB.x){
				directionA += pathObj.crossA.y-pathObj.crossB.y > 0 ? "Left" : "Right";
				directionB += pathObj.crossA.y-pathObj.crossB.y > 0 ? "Right" : "Left";
			}else if(pathObj.crossA.y==pathObj.crossB.y){
				// 两个焦点在同一列上
				directionA += pathObj.crossA.x-pathObj.crossB.x > 0 ? "top" : "bottom";
				directionB += pathObj.crossA.x-pathObj.crossB.x > 0 ? "bottom" : "top";
			}

			// 格式化字符串
			pointAndCrossDirection.crossDirection = {'A':this.formatStr(directionA),"B":this.formatStr(directionB)};

		}
		// 返回关键点和相交点的对象
		return pointAndCrossDirection;
	},
	// 返回两个点之间是应该画水平方向的线还是垂直方向的线
	pathDirection:function(current,target){
		// 如果两个点在同一行上，则在水平方向划线
		if(current.x == target.x){
			return "horizontal";
		}else if(current.y == target.y){
			// 同一列，则在垂直方向划线
			return "vertical";
		}
	},
	// 格式化字符串
	formatStr:function(str){
		if(str == "Righttop"){
			return "topRight";
		}else if(str == "Rightbottom"){
			return "bottomRight";
		}else if(str == "Lefttop"){
			return "topLeft";
		}else if(str == "Leftbottom"){
			return "bottomLeft";
		}else{
			return str;
		}
	},
	// 得到路径上所有点坐标并画线
	pathCoordinate:function(pointAndCrossDirection){
		//判断绘制线的方向
		var pathDirection = ""; 

		// 获取途经点的坐标的数组
		var coordinateArr = [];

		// 如果焦点重合且所有点在一条直线上
		if(pointAndCrossDirection.crossDirection === undefined){
			// 如果A点和B点在同一行上
			coordinateArr = this.getAllPoint(pointAndCrossDirection.point.A,pointAndCrossDirection.point.B); 	

			// 获取绘制线的方向
			pathDirection = this.pathDirection(pointAndCrossDirection.point.A,pointAndCrossDirection.point.B);
			
			// 给路径画线
			this.drawPathLine(coordinateArr,pathDirection);

		}else{
			// 如果A点的十字线上的点和B点十字线上的点重合
			

			console.log("以下是两个点中间--除去相交点的所有的路径的坐标");
			console.log("===============A点到A点十字线之间的路径坐标=================");
			console.log(this.getAllPoint(pointAndCrossDirection.point.A,pointAndCrossDirection.point.crossA));
			console.log("===============B点到B点十字线之间的路径坐标=================");
			console.log(this.getAllPoint(pointAndCrossDirection.point.B,pointAndCrossDirection.point.crossB));
			console.log("===============A点十字线上的点到B点十字线之间的路径坐标=================");
			console.log(this.getAllPoint(pointAndCrossDirection.point.crossA,pointAndCrossDirection.point.crossB));

			// 绘制不包括焦点的线
			// 两个参数分别是 1.点的坐标 2.绘制的方向
			this.drawPathLine(this.getAllPoint(pointAndCrossDirection.point.A,pointAndCrossDirection.point.crossA),this.pathDirection(pointAndCrossDirection.point.A,pointAndCrossDirection.point.crossA));
			this.drawPathLine(this.getAllPoint(pointAndCrossDirection.point.B,pointAndCrossDirection.point.crossB),this.pathDirection(pointAndCrossDirection.point.B,pointAndCrossDirection.point.crossB));
			this.drawPathLine(this.getAllPoint(pointAndCrossDirection.point.crossA,pointAndCrossDirection.point.crossB),this.pathDirection(pointAndCrossDirection.point.crossA,pointAndCrossDirection.point.crossB));
			this.drawCrossDirection(pointAndCrossDirection);
		}
	},
	// 获取所有的非相交点的路径点坐标
	getAllPoint:function(validPointA,validPointB){
		// 定义一个数组保存沿途经过的点
		var pointArr = [];
		// 如果两个点在同一行上
		if(validPointA.x == validPointB.x){
			// i的值为两个点间y值较小的那个点的y值+1，len即为两个点较大的那个点的y值
			var i = validPointA.y < validPointB.y ? validPointA.y+1 : validPointB.y+1;
			var len = validPointA.y > validPointB.y ? validPointA.y : validPointB.y;
			for( ;i<len;i++){
				pointArr.push({x:validPointA.x,y:i});
			}
		}else if(validPointA.y == validPointB.y){
			// 同上
			var i = validPointA.x < validPointB.x ? validPointA.x+1 : validPointB.x+1;
			var len = validPointA.x > validPointB.x ? validPointA.x : validPointB.x;
			for( ;i<len;i++){
				pointArr.push({x:i,y:validPointA.y});
			}
		}

		return pointArr;
	},
	// 画交点的线
	drawCrossDirection:function(path){
		var trA = document.querySelectorAll('tr')[path.point.crossA.x];
		var tdA = trA.querySelectorAll('td')[path.point.crossA.y];
		tdA.innerHTML = "<div class='corner-line corner-"+path.crossDirection.A+"-line'></div>";
		var trB = document.querySelectorAll('tr')[path.point.crossB.x];
		var tdB = trB.querySelectorAll('td')[path.point.crossB.y];
		tdB.innerHTML = "<div class='corner-line corner-"+path.crossDirection.B+"-line'></div>";
	},
	drawPathLine:function(coordinateArr,direction){
		// 获取所有的tr对象
		var tr = document.querySelectorAll('tr');
		if(coordinateArr.length != 0){
			for(var i=0;i<coordinateArr.length;i++){
				// 获取td
				var td = tr[coordinateArr[i].x].querySelectorAll('td')[coordinateArr[i].y]
				// 绘制线
				td.innerHTML = "<div class='"+direction+"-line'></div>"
			}
		}		
	}
}














