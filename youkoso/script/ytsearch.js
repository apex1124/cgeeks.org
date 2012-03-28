var TOTAL_RESULT=0;
		var START_INDEX = 1;
		var KEYWORD = "";
		var MAX_RESULT=50;
		var player;
		var PLAYER_ID = 'videoDiv';
		var RESULT_COUNT=0;
		var ENTRY_NUM=0;
		var PAR_PAGE=10;
		var RELCOM_UPD_COUNT=1;
		var filterArr = [
			  ["HD"	, "orderby"	, "time", "category"], 
			  [0	, 0			, 0		, 0],
			  ["dum", 1			, 1		, 1]
			];
//================================================player==============================================
	    // プレーヤーの状態が変化した
	    function onPlayerStateChange( newState )
	    {
	        switch( newState )
	        {
	            case 0:
	                break;
	        }
	    }

	    // プレーヤーでエラーが発生した
	    function onPlayerError( errorCode )
	    {
	        switch( errorCode )
	        {
	            case 100:
	                break;
	        }
	    }

	    // プレーヤーの準備が整った
	    function onYouTubePlayerReady( PLAYER_ID )
	    {
	        player = document.getElementById( videoDiv );
	        
	        player.addEventListener( 'onStateChange', 'onPlayerStateChange' );
	        player.addEventListener( 'onError', 'onPlayerError' );
	       play();
	    }
	    function set_video(vid, startTime){
			document.getElementById("yt_rel").innerHTML="";
			document.getElementById("commentFrame").innerHTML="";
			RELCOM_UPD_COUNT = 1;call_detail(vid);
	    	LoadPlayer(vid, startTime);
			
			
			call_comment(vid, 1);
	    	call_related(vid, 1);
	    }

	    // プレーヤーを読み込む
	    function LoadPlayer( vid , startTime)
	    {
            var swfUrl = 'http://www.youtube.com/v/'
            	+ vid + '?enablejsapi=1&iv_load_policy=0&cc_load_policy=0&showsearch=0'
            	+ '&start=' + startTime + '&modestbranding=1&autohide=1&autoplay=1&version=3';
            
	        var replaceElemId = PLAYER_ID;
	        var width = '640';
	        var height = '360';
	        var swfVersion = '8';

	        var params = { allowScriptAccess: 'always', wmode: "transparent", allowfullscreen: "true"};    // 外部のドメインからのアクセスを許可
	        var atts = { id: replaceElemId };                // 埋め込みプレーヤーのID

	        // YouTubeプレーヤーの埋め込み
	        swfobject.embedSWF(
	            swfUrl,
	            replaceElemId,
	            width,
	            height,
	            swfVersion,
	            null,
	            null,
	            params,
	            atts
	            );
	    }
	    google.load( 'swfobject', '2.2' );
	    //google.setOnLoadCallback( call_detail);
	    
	    //====================================================Generate=========================================================

		gen_category = function( num ){
			var str;
			switch(num){
				case 1:
					str = "Music";
					break;
				case 2:
					str = "Entertainment";
					break;
				case 3:
					str = "Autos";
					break;
				case 4:
					str = "Sports";
					break;
				case 5:
					str = "Film";
					break;
				case 6:
					str = "Gaming";
					break;
				case 7:
					str = "Comedy";
					break;
				case 8:
					str = "Pets";
					break;
				case 9:
					str = "Science";
					break;
				case 10:
					str = "Howto";
					break;
				default:
					str = "default";
					break;
			}
			return str;
		}
		gen_time = function( num ){
			var str;
			switch(num){
				case 1:
					str = "all_time";
					break;
				case 2:
					str = "this_month";
					break;
				case 3:
					str = "this_week";
					break;
				case 4:
					str = "today";
					break;
				default:
					str = "default";
					break;
			}
			return str;
		}
		gen_orderby = function( num ){
			var str;
			switch(num){
				case 1:
					str = "relevance";
					break;
				case 2:
					str = "published";
					break;
				case 3:
					str = "viewCount";
					break;
				case 4:
					str = "rating";
					break;
				default:
					str = "default";
					break;
			}
			return str;
		}
		function call_search( keyword ){
			var script=document.createElement("script");
			script.type="text/javascript";
			script.src ="http://gdata.youtube.com/feeds/api/videos?vq="+keyword+"&alt=json-in-script"+"&max-results="+MAX_RESULT+"&start-index="+START_INDEX;
			if( filterArr[1][1] )//orderby
				script.src += "&"+filterArr[0][1]+"="+gen_orderby(filterArr[2][1]);
			if( filterArr[1][2] )//time
				script.src += "&"+filterArr[0][2]+"="+gen_time(filterArr[2][2]);			
			if( filterArr[1][3] )//category
				script.src += "&"+filterArr[0][3]+"="+gen_category(filterArr[2][3]);
			script.src += "&callback="+"dom_search";
			//alert(script.src);
			var yt_sea=document.getElementById("yt_sea");
			yt_sea.appendChild(script);
		}
		function dom_search(data){
			var yt_sea=document.getElementById("yt_sea");
			if( 0 == TOTAL_RESULT ){
				if( 'openSearch$totalResults' in data.feed ){
					TOTAL_RESULT = data.feed.openSearch$totalResults.$t;
				}
				var sResult = document.getElementById("sResult");
				if(TOTAL_RESULT != 0){
					sResult.innerHTML = "Found:"+TOTAL_RESULT;
				} else {
					sResult.innerHTML = "not Found";
					yt_sea.innerHTML = "not Found videos";
					return;
				}
			}
			for (var i=0,e=data.feed.entry;i<e.length; i++){
				
				START_INDEX++;
				ENTRY_NUM++;
				if( ENTRY_NUM == 1000 ){
					alert("Reached max");	
				}
                if( 1 == filterArr[1][0] ){
                    if( 'yt$hd' in e[i] ){
                        }else{ continue; }
                }
				var group=e[i].media$group;
				var block = document.createElement("div");
                block.className = "sBlock";
				var name = document.createElement("a");
				name.href	= group.media$player[0].url;
				name.innerHTML = group.media$title.$t;
				name.className = "vlink vName";
				var author = document.createElement("a");
                author.className = "author";
				author.innerHTML = e[i].author[0].name.$t;	
				author.title= e[i].author[0].name.$t;
				var viewCount = document.createElement("a");
                viewCount.className = "viewcount";
                if( 'yt$statistics' in e[i] ){
					viewCount.innerHTML = add_point( e[i].yt$statistics.viewCount );
				}
				var rating = document.createElement("a");
                rating.className = "rating";
                if( 'gd$rating' in e[i] ){
					rating.innerHTML = e[i].gd$rating.average.toFixed(2);
				}
                var pub = document.createElement("a");
                pub.className = "span";
                pub.innerHTML = span_published(e[i].published.$t);
				var duration = document.createElement("a");
				duration.className = "duration";
				duration.innerHTML = hms( group.yt$duration.seconds );
				var thumbFrame=document.createElement("div");
                thumbFrame.className = "thumbFrame";
	
				if( rating.innerHTML )
					viewCount.style.color = color_rate( rating.innerHTML );			
				
				var a0 = document.createElement("a");
                var a1 = document.createElement("a");
                var a2 = document.createElement("a");
				a0.href = group.media$player[0].url;
				a0.title = group.media$thumbnail[1].time.substring(0,8);
				a0.className = "vlink tlink";
				a1.href = group.media$player[0].url;
				a1.title = group.media$thumbnail[2].time.substring(0,8);
				a1.className = "vlink tlink";
				a2.href = group.media$player[0].url;
				a2.title = group.media$thumbnail[3].time.substring(0,8);
				a2.className = "vlink tlink";
                
                var img0 = document.createElement("img");
				var img1 = document.createElement("img");
				var img2 = document.createElement("img");
				img0.src = group.media$thumbnail[1].url;
				img0.width = '120';
				img1.src = group.media$thumbnail[2].url;
				img1.width = '120';
				img2.src = group.media$thumbnail[3].url;
				img2.width = '120';
				
				var blockLeft = document.createElement("div");
				blockLeft.className="blockLeft";				
				
				yt_sea.appendChild( block );
				
				block.appendChild(name);
				block.appendChild(thumbFrame);
				thumbFrame.appendChild( a0 );
				thumbFrame.appendChild( a1 );
				thumbFrame.appendChild( a2 );
				a0.appendChild(img0);
				a1.appendChild(img1);
				a2.appendChild(img2);
				block.appendChild( blockLeft );
				blockLeft.appendChild( duration );
				blockLeft.appendChild( author );
				block.appendChild( viewCount );
                block.appendChild( pub );
				
				if( 'yt$hd' in e[i] ){
					var hd = document.createElement("a");
					hd.innerHTML="HD";
					hd.className="hd";
					blockLeft.appendChild( hd );
				}
				
				RESULT_COUNT++;
				if( RESULT_COUNT >= PAR_PAGE ){
					RESULT_COUNT=0;
					return;	
				}
			}
			if( RESULT_COUNT < PAR_PAGE ){
				call_search( KEYWORD );
			}
		}
		function color_rate( rating ){
			var cc; 
			if			(rating > 4.7)	{ cc= "#2cb22c";}
			else if		(rating > 3)	{ cc= "#000";}
			else 						{ cc= "#b22222";}
			return cc;
		}
		function call_related( vid, startIndex ){
			var script=document.createElement("script");
			script.type="text/javascript";
			script.src="http://gdata.youtube.com/feeds/api/videos/"
				+ vid + "/related?alt=json-in-script"
				+ "&max-results=" + PAR_PAGE
				+ "&start-index=" + startIndex
				+ "&callback=dom_related";
				
			var yt_rel=document.getElementById("yt_rel");
			yt_rel.appendChild(script);
		}
		
		function dom_related(data){
			var yt_rel=document.getElementById("yt_rel");
			for (var i=0,e=data.feed.entry;i<e.length;i++){				
				var group=e[i].media$group;
				var block = document.createElement("div");
                block.className = "sBlock";
				var name = document.createElement("a");
				name.href	= group.media$player[0].url;
				name.innerHTML = group.media$title.$t;
				name.className = "vlink vName";
				var author = document.createElement("a");
                author.className = "author";
				author.innerHTML = e[i].author[0].name.$t;	
				author.title= e[i].author[0].name.$t;
				var viewCount = document.createElement("a");
                viewCount.className = "viewcount";
                if( 'yt$statistics' in e[i] ){
					viewCount.innerHTML = add_point( e[i].yt$statistics.viewCount );
				}
				var rating = document.createElement("a");
                rating.className = "rating";
                if( 'gd$rating' in e[i] ){
					rating.innerHTML = e[i].gd$rating.average.toFixed(2);
				}
                var pub = document.createElement("a");
                pub.className = "span";
                pub.innerHTML = span_published(e[i].published.$t);
				var duration = document.createElement("a");
				duration.className = "duration";
				duration.innerHTML = hms( group.yt$duration.seconds );
				var thumbFrame=document.createElement("div");
                thumbFrame.className = "thumbFrame";
	
				if( rating.innerHTML )
					viewCount.style.color = color_rate( rating.innerHTML );			
				
				var a0 = document.createElement("a");
                var a1 = document.createElement("a");
                var a2 = document.createElement("a");
				a0.href = group.media$player[0].url;
				a0.title = group.media$thumbnail[1].time.substring(0,8);
				a0.className = "vlink tlink";
				a1.href = group.media$player[0].url;
				a1.title = group.media$thumbnail[2].time.substring(0,8);
				a1.className = "vlink tlink";
				a2.href = group.media$player[0].url;
				a2.title = group.media$thumbnail[3].time.substring(0,8);
				a2.className = "vlink tlink";
                
                var img0 = document.createElement("img");
				var img1 = document.createElement("img");
				var img2 = document.createElement("img");
				img0.src = group.media$thumbnail[1].url;
				img0.width = '120';
				img1.src = group.media$thumbnail[2].url;
				img1.width = '120';
				img2.src = group.media$thumbnail[3].url;
				img2.width = '120';
				
				var blockLeft = document.createElement("div");
				blockLeft.className="blockLeft";				
				
				yt_rel.appendChild( block );
				
				block.appendChild(name);
				block.appendChild(thumbFrame);
				thumbFrame.appendChild( a0 );
				thumbFrame.appendChild( a1 );
				thumbFrame.appendChild( a2 );
				a0.appendChild(img0);
				a1.appendChild(img1);
				a2.appendChild(img2);
				block.appendChild( blockLeft );
				blockLeft.appendChild( duration );
				blockLeft.appendChild( author );
				block.appendChild( viewCount );
                block.appendChild( pub );
				
				if( 'yt$hd' in e[i] ){
					var hd = document.createElement("a");
					hd.innerHTML="HD";
					hd.className="hd";
					blockLeft.appendChild( hd );
				}
			}
		}
		function call_detail( vid ){
			var script=document.createElement("script");
			script.type="text/javascript";
			script.src="http://gdata.youtube.com/feeds/api/videos/" + vid
			+ "?alt=json-in-script&callback=dom_detail";
			var videoProperty = document.getElementById("videoProperty");
			videoProperty.appendChild(script);
		}
		function dom_detail(data){
			var i=0;
			var videoProperty = document.getElementById("videoProperty");
			var videoTitle = document.getElementById("videoTitle");
			videoTitle.innerHTML = data.entry.media$group.media$title.$t;
			videoProperty.innerHTML = "";
			var author = document.createElement("a");
			var viewCount = document.createElement("a");
			var rating = document.createElement("a");
			var description = document.createElement("p");
			var published = document.createElement("a");
			
			var an = data.entry.author[0].name.$t;
			author.innerHTML = an;
			author.href	= "http://www.youtube.com/user/" + an;
			author.title	= "Author";
			author.className = "author";
			published.innerHTML = data.entry.published.$t.substring(0,10);
			published.className = "published";
			if( 'yt$statistics' in data.entry ){
				viewCount.innerHTML = add_point(data.entry.yt$statistics.viewCount);
				viewCount.className = "viewcount";
			}
			if( 'gd$rating' in data.entry ){
				rating.innerHTML = data.entry.gd$rating.average.toFixed(2);
				rating.className = "rating";
			}
			description.innerHTML = data.entry.media$group.media$description.$t.replace(/\n/g,"<BR>");
			
			var blockLeft = document.createElement("div");
			blockLeft.className = "blockLeft";
			
			videoProperty.appendChild( blockLeft );
			blockLeft.appendChild( author );
			videoProperty.appendChild( viewCount );
			videoProperty.appendChild( rating );
			videoProperty.appendChild( published );
			
			videoProperty.appendChild( description );
			linker();
		}



		function call_comment( vid , startIndex){
			var script=document.createElement("script");
			script.type="text/javascript";
			script.src="http://gdata.youtube.com/feeds/api/videos/" + vid
			+ "/comments?alt=json-in-script"
			+ "&max-results=" + PAR_PAGE
			+ "&start-index=" + startIndex
			+ "&callback=dom_comment";
			var commentFrame = document.getElementById("commentFrame");
			commentFrame.appendChild(script);
		}
		function dom_comment(data){
			var commentFrame = document.getElementById("commentFrame");
			if( !data.feed.openSearch$totalResults.$t ){
				return;
			}
			for (var i=0,e=data.feed.entry;i<e.length;i++){//>
				var commentBlock = document.createElement("div");
				var cAuthor = document.createElement("a");
				var span = document.createElement("a");
				var comment = document.createElement("p");
				var ca = e[i].author[0].name.$t;
				cAuthor.innerHTML= ca;
				cAuthor.href = "http://www.youtube.com/user/" + ca;
				span.innerHTML = span_published(e[i].published.$t);
				span.className = "span";
				comment.innerHTML= e[i].content.$t.replace(/\n/g,"<BR>");
				commentBlock.className = "comBlock";
				commentFrame.appendChild( commentBlock );
				
				commentBlock.appendChild( cAuthor );
				commentBlock.appendChild( span );
				commentBlock.appendChild( comment );
			}
		}
//============================================================que===================================================
		
		var que = new myQue(10);
		//que.body[0]="1YLSfXy3CDk";
		
//==============================================================jquery========================================
		function gen_exckey(str){
			if( !str )return "";
			var exckey = str.replace(/[ 　]+/g, " -");
			return encodeURIComponent(" -"+exckey);
		}
		//encURIC
		function filter_input(str){
			return str.replace(/[\(\)!\._~'\*]+/g, "");
		}
		$(function(){
		    
			set_focus("keyIn");
			
			$("ul.sub").hide();
			
			$('#searchBox').submit(function(){
				var keyword;
				keyword = filter_input(document.getElementById("keyIn").value);
				keyword = encodeURIComponent(keyword);
				keyword += gen_exckey(filter_input(document.getElementById("dKeyIn").value));
				if( !keyword || keyword == KEYWORD ){
					return false;
				}
				$('html,body').animate({ scrollTop: 0 }, '1');
				TOTAL_RESULT=0;
				ENTRY_NUM=0;
				START_INDEX=1;
				KEYWORD = keyword;
				document.getElementById("yt_sea").innerHTML="";
				call_search( keyword );
				return false;
			});
			/*
            $("a.vName").live("click",function(){
				$(this).parent().css({"background":"#eff2ff"});
			});
            $("a.tlink").live("click",function(){
				$(this).parent().parent().css({"background":"#ffe0a7"});
			});
			*/
			$(document).on("click",'a.vlink',function(){
				var vid = this.href.substring(31,42);
				var startTime = 0;
				if( vid == que.readq("now") ){ return false; }
				if( this.title ){
					startTime = calc_time( $(this).attr("title") );
				}else{}
				if( !check_vid( vid ) ){ return false; }
				set_video( vid , startTime);
				que.enque( vid );
				return false;
			});
			$('#backb').live("click", function(){
				var vid=que.readq("back");
				if(vid){
					set_video( vid );
				}
				return false;
			});
			$('#nextb').live("click", function(){
				var vid=que.readq("next");
				if(vid){
					set_video( vid );
				}
				return false;
			});
			$('div#right .filter, ul.sub li').click(function(){
				KEYWORD="";
			});
			
			//filter
			$("ul#FilterList  li").click(function(){
        	    		$("ul",this).slideToggle(0);
    				}).toggle(
						function () {
							filterArr[1][$(this).index()]=1;
							$("button",this).addClass("button_pushed");
						},
						function () {
							filterArr[1][$(this).index()]=0;
							$("button",this).removeClass("button_pushed");;
						}
            );
			$("ul.sub > li").click(
				function(){
					var t, num;
					$(this).parent().children().children("a").removeClass("filter_selected");
					$("a",this).addClass("filter_selected");
					t= $(this).parent().parent().attr("name");
					num= $(this).index();
					for(var i=0; i<$("#FilterList button").size(); i++){
						if( t == filterArr[0][i]){
							filterArr[2][i]=num+1;
						}
					}
				}
			);
			$("ul.sub > li").hover(
				function () {
					$("a",this).addClass("filter_hover");
				},
				function () {
					$("a",this).removeClass("filter_hover");
				}
			);
			$("button, .button").hover(
				function () {
					$(this).addClass("button_hover");
				},
				function () {
					$(this).removeClass("button_hover");
				}
			);
			//bottomload
			$(window).bottom({proximity: 0.025});
			$(window).on('bottom', function() {
				var obj = $(this);
				if (!obj.data('loading')) {
					obj.data('loading', true);
					// コンテンツ表示の処理を記述
					setTimeout(function() {
						add_dom_search();
						add_dom_relcom();
						obj.data('loading', false);
					}, 1000);
				}
			});
			
		});
		function add_dom_search(){
			call_search( KEYWORD );
		}
		function add_dom_relcom(){
			var vid = que.readq("now");
			call_comment(vid, RELCOM_UPD_COUNT * PAR_PAGE + 1);
			RELCOM_UPD_COUNT++;
		}
		function check_vid( vid ) {
			if( !reg_vid( vid ) ){ return false	; }
			if( !vid || vid.length != 11){ return false; }
			return true;
		}
		function reg_vid( vid ) {
			var regex = /[^-_a-zA-Z0-9]/;
			if( regex.test( vid ) ) return false;
			return true;
		}
		function calc_time(time){
			var h = parseInt(time.substring(0,2));
			var m = parseInt(time.substring(3,5));
			var s = parseInt(time.substring(6,8));
			
			return h*60*60 + m*60 + s;
		}
		function hms(sec){
			var h,m,s, result="";
			var h = Math.floor( (sec / 60) / 60 );
			var m = Math.floor( (sec / 60) % 60 );
			var s = Math.floor( sec % 60 );
			if( h ){
				result += h +":";
			}
			if( m ){
				if( h ){ 
					if( m < 10){
						result += "0" + m + ":";
					}
					else { result += m +":";}
				}
				else   { result += m + ":";}
			} else { 
				if( h ){ result += "00:"; }
				else   { result += "0:";}
			}
			
			if( s ){
				if( s < 10){
					result += "0" + s;
				}
				else { result += s;}
			} else {
				result +="00"	
			}
			return result;
		}
		function linker() {
			$("p").autolink();
		}
//==========================================cookie===================================
		function setck(){
			ckary = new Array(3);
			
			ckary[0] = que.readq("now");
			ckary[1] = KEYWORD;
			ckary[2] = "";

			//alert ('◎フォームの内容\n'+ckary[0]+' '+ckary[1]+' '+ckary[2]);

			exp = new Date();
			exp.setTime(exp.getTime()+1000*60*60*24*1);
			ckstr =  escape(ckary[0]);
			i = 1;
			while (ckary[i]){
				ckstr += "%00" + escape(ckary[i]);
				i++;
			}
			//alert ('◎ESCAPEされた文字列'+ckstr);
			document.cookie = "ASH_jsc=" + ckstr + "; expires=" + exp.toGMTString();
		}

		function getck(){

			//alert ('◎cookie文字列全体\n'+document.cookie);

			cklng = document.cookie.length;
			ckary = document.cookie.split("; ");
			ckstr = "";
			i = 0;
			while (ckary[i]){
				if (ckary[i].substr(0,8) == "ASH_jsc="){
					ckstr = ckary[i].substr(8,ckary[i].length);
					break;
				}
				i++;
			}

			//alert ('◎抽出された文字列\n'+ckary[i]);

			ckary = ckstr.split("%00");
			if (ckary[1]) document.forms[0].keyIn.value = unescape(ckary[1]);
			if (ckary[2]) ;
		}
//============================================others=============================
		function add_point(str) {
			var num = new String(str).replace(/,/g, "");
			while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
			return num;
		}
		function set_focus(docID){
			document.getElementById( docID ).focus();
		}
		function span_published( time ){
			var now = new Date();
			//convert millisec
			var nows = Date.parse(now);
			var dates = Date.parse(time);
			
			var result = which_span(  (nows - dates) );

			return (result + " ago");
		}
		function which_span( millisec ){
			d = millisec/1000/60/60/24;
			s = millisec/1000;//sec
			if		( d >= 365*2 )	{ return Math.floor(d/365)+" years";}
			else if	( d >= 365 )	{ return Math.floor(d/365)+" year";}
			else if( d >= 30*2 )	{ return Math.floor(d/30)+" months";}
			else if( d >= 30 )		{ return Math.floor(d/30)+" month";}
			else if( d >= 7*2 )	{ return Math.floor(d/7)+" weeks";}
			else if( d >= 7 )		{ return Math.floor(d/7)+" week";}
			else if( d >= 1*2)		{ return Math.floor(d)+" days";}
			else if( d >= 1)		{ return Math.floor(d)+" day";}
			else if( s >=(60*60)*2){ return Math.floor(s/60/60)+" hours";}
			else if( s >=(60*60))	{ return Math.floor(s/60/60)+" hour";}
			else if( s >= 60*2 )	{ return Math.floor(s/60)+" minutes";}
			else if( s >= 60 )		{ return Math.floor(s/60)+" minute";}
			else if( s >= 1*2 )	{ return Math.floor(s)+" seconds";}
			else 				{return Math.floor(s)+" second"; }
		}
		
/*
strict trueでAPIリクエスト無効なパラメータを拒否する
*/