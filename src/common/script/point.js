define('h5/js/common/point', [
	'jquery',
	'h5/js/common/data'
], function($, Data){

	function point(){
		this.hasSignToday = false; 		//今天是否可以签到
		this.signDay = 0;				//连续签到天数
		this.todayScore = 0; 			//今天签到获得积分数
		this.tomorrowScore=0; 			//明天签到获得积分数
		this.totalScore = 0; 			//积分总数

		this._promise = $.Deferred();
		this._promise.promise(this);
	}
	point.prototype = {
		fetch : function(){
			var S = this;
			return Data.fetchPoint().done(function(res){
				$.extend(S, res);
				S._promise.resolve(S);
			});
		},
		ready : function(callback){
			this.done(callback);
			if(!this._ready){
				this.fetch();
				this._ready = true;
			}
			return this;
		},
		obtain : function(){
			return Data.obtainPoint();
		}
		
	}
	return point;
});
