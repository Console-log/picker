;!function(win,doc){
    function Picker(ipt,config,callback){
        this.ipt=ipt;
        this.config={
            break:config?config.break||'-':'-',
            max_time:config?config.max_time||'':''
        };
        this.callback=function(){
            if(!callback) return new Function();
            return callback.apply(this,arguments);
        };
        this.init();
    };

    Picker.prototype={

        init:function(){
            var _this=this;
            var max_time=this.config.max_time?this.get_date(new Date(this.config.max_time)):'';
            this.ipt.addEventListener('click',function(){
                _this.ms=_this.ac_day=this.getAttribute('data-ms')-0;
                _this.render_dom();
            });
            this.ipt.readOnly=true;
            this.ipt.setAttribute('data-ms',new Date().getTime());
            this.max_ms=max_time?new Date(max_time.year,max_time.month-1,max_time.date+1).getTime():'';
        },

        render_dom:function(){
            var i,max_day,html,len,day_list=[],active=false,na;
            var position=this.offset();
            var date=this.get_date(this.ms);
            var ac_day=this.get_date(this.ac_day);
            var day_count=this.get_day_count(date.year,date.month);
            var first_day=this.get_first_date_day(date.year,date.month);

            this.dom=doc.createElement('div');
            this.dom.setAttribute('class','date_picker');
            this.dom.style.cssText='left:'+(position.left-3)+'px;top:'+(position.top-3)+'px;';

            for(i=0;i<day_count;i++){
                active=date.year==ac_day.year&&date.month==ac_day.month&&ac_day.date==i+1;
                na=new Date(date.year,date.month-1,i+1).getTime()>=this.max_ms;
                day_list.push('<span '+(active?'class="active"':na?'class="na"':'')+' data-ms="'+(new Date(date.year,date.month-1,i+1).getTime())+'">'+(i+1)+'</span>');
            };

            day_count=this.get_day_count(date.year,date.month-1);

            for(i=0;i<first_day;i++){
                day_list.unshift('<span class="na">'+(day_count-i)+'</span>');
            };

            len=day_list.length;
            max_day=len>35?42:35;

            for(i=0;i<(max_day-len);i++){
                day_list.push('<span class="na">'+(i+1)+'</span>');
            };

            html='\
                <div class="pk_tit">\
                    <span class="init_time">'+this.format_date(this.ac_day)+'</span>\
                    <span class="pk_close">&times;</span>\
                </div>\
                <div class="change_date">\
                    <span class="pre_year">&lt;&lt;</span><span class="pre_mon">&lt;</span>\
                    <span class="cur_mon">'+date.year+'年'+date.month+'月</span>\
                    <span class="next_mon">&gt;</span><span class="next_year">&gt;&gt;</span>\
                </div>\
                <div class="pk_main">\
                    <div class="main_tit">\
                        <span>日</span><span>一</span><span>二</span><span>三</span>\
                        <span>四</span><span>五</span><span>六</span>\
                    </div>\
                    <div class="main_day">'+day_list.join('')+'</div>\
                </div>\
                <div class="pk_bt">\
                    <span class="today" data-ms="'+new Date().getTime()+'">今天</span>\
                </div>\
            ';
            this.dom.innerHTML=html;
            doc.body.appendChild(this.dom);
            this.add_listener(this.dom);
        },

        get_date:function(ms){
            var date=new Date(ms-0);
            return {
                year:date.getFullYear(),
                month:date.getMonth()+1,
                date:date.getDate(),
                day:date.getDay()
            }
        },

        format_date:function(ms){
            var date=this.get_date(ms-0);
            var _brrak=this.config.break;
            return date.year+_brrak+this.zero(date.month)+_brrak+this.zero(date.date);
        },

        zero:function(num){
            return num-0<10?'0'+num:num+'';
        },

        offset:function(){
            var dom=this.ipt;
            var offset_parent;
            var top=dom.offsetTop;
            var left=dom.offsetLeft;
            while(dom.offsetParent){
                dom=dom.offsetParent;
                top+=dom.offsetTop;
                left+=dom.offsetLeft;
            };
            return {
                top:top,
                left:left
            };
        },

        get_day_count:function(year,month){
            return new Date(year,month,0).getDate()-0;
        },

        get_first_date_day:function(year,month){
            return new Date(year,month-1,1).getDay()-0;
        },

        add_listener(dom){
            var _this=this;
            dom.addEventListener('click',function(e){
                var ac_time=new Date().getTime();
                var tar=e.target;
                var date=_this.get_date(_this.ms);
                var cl_name=tar.getAttribute('class');
                switch(cl_name){
                    case 'pk_close':
                        doc.body.removeChild(dom);
                        return;
                    case 'pre_year':
                        _this.ms=new Date(date.year-1,date.month-1,1);
                        _this.re_render(dom);
                        break;
                    case 'pre_mon':
                        _this.ms=new Date(date.year,date.month-2,1);
                        _this.re_render(dom);
                        break;
                    case 'next_mon':
                        _this.ms=new Date(date.year,date.month,1);
                        _this.re_render(dom);
                        break;
                    case 'next_year':
                        _this.ms=new Date(date.year+1,date.month-1,1);
                        _this.re_render(dom);
                        break;
                    case 'today':
                        _this.ipt.value=_this.format_date(ac_time);
                        _this.ipt.setAttribute('data-ms',ac_time);
                        doc.body.removeChild(dom);
                        _this.callback();
                        break;
                }
                if(tar.tagName.toLocaleLowerCase()=='span'&&tar.parentNode.className=='main_day'&&tar.className!='na'){
                    _this.ipt.value=_this.format_date(tar.getAttribute('data-ms'));
                    _this.ipt.setAttribute('data-ms',tar.getAttribute('data-ms'));
                    doc.body.removeChild(dom);
                    _this.callback();
                };
            });
        },

        re_render:function(dom){
            doc.body.removeChild(dom);
            this.render_dom();
        }

    };

    win.Picker=Picker;

}(window,document);