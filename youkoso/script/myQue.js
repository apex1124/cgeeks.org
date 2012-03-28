myQue = function(len){
	this.len = len;
	this.body = Array(len);
	this.rtn = 0;
	this.latest = 0;
	this.p  = 0;
	this.guadian = 0;
	this.enque = function(data){
		this.p++;
		if ( this.p == this.len){
			this.p = 0;
		}
		this.body[this.p] = data;
		if( this.p == this.guadian ){
			
			this.updateGuadian();
		}
		this.latest = this.p;
		
	}
	this.readq = function(way){
		switch(way){
			case "now":
				break;
			case "back":
				
				if( this.p == this.guadian){
					return false;
				}
				if( this.p == 0){
					this.p = this.len;
				}
				this.p--;
				
				if(this.body[this.p] === undefined){
					this.p++;
					return;
				}
				this.rtn++;
				break;
			case "next":
				if(!this.rtn){return false;}
				if( this.latest == this.p ){return false;}
				this.p++;
				
				if( this.p == this.len){
					this.p = 0;
				}
				this.rtn--;
				break;
			default:
				return null;
		}
		return this.body[this.p];
	}
	this.updateGuadian = function(){
		this.guadian++;
		if( this.guadian == this.len){
			this.guadian = 0;
			
		}
	}
}