/*
author:kolou
date:20150805
name:loading_progress
*/
function loading_progress(id,color,line_width,speed,imgcheck){
    this.id=id;
    this.color=color;
    this.line_width=line_width;
    this.speed=speed*1000;
    this.imgcheck=imgcheck;
    this.init();
}
loading_progress.prototype.obj=null;
loading_progress.prototype.setTime='';
loading_progress.prototype.init=function(){//init
    var obj=document.getElementById(this.id);
    obj.style.backgroundColor=this.color;
    obj.style.position='fixed';
    obj.style.top=0;
    obj.style.zIndex='10000';
    obj.style.height=this.line_width+'px';
    obj.style.width='0%';
    obj.style.boxShadow='1px 1px 2px #999';
    this.dom_check(50,this.imgcheck);
};
loading_progress.prototype.fade_out=function(){
    var obj=document.getElementById(this.id);
    var opacity=1;
    fade(opacity);
    function fade(){
        opacity-=0.1;
        obj.style.opacity=opacity;
        if(opacity>0){
            setTimeout(function(){fade(opacity);},20)
        }else{
            document.body.removeChild(obj);
        }
    }
};
loading_progress.prototype.width_plus=function(progress){//progress_up
    clearTimeout(loading_progress.prototype.setTime);
    var obj=document.getElementById(this.id);
    var i=obj.style.width.replace('%','')-0;
    animate();
    function animate(){
        if(i<progress&&i<100){
            i+=progress/100;
            i=Math.min(i,100);
            obj.style.width=i+'%';
            loading_progress.prototype.setTime=setTimeout(function(){
                animate();
            },this.speed/100);
        }
    }
}
loading_progress.prototype.dom_check=function(progress,imgcheck){//dom加载计算
    var that=this;
    var dom_list=document.getElementsByTagName('body')[0].children;

    check();
    function check(){
        for(var i=0;i<dom_list.length;i++){
            var attr_arr=dom_list[i].attributes;
            var attr_arr_2=dom_list[i].children;
            for(var a=0;a<attr_arr.length;a++){
                if(attr_arr[a].nodeName=='data-loading-progress'){
                    var val=attr_arr[a].nodeValue-0;
                    that.width_plus(val);

                }
            }


            for(var a=0;a<attr_arr_2.length;a++){
                if(attr_arr_2[a].attributes[0]){
                    if(attr_arr_2[a].attributes[0].nodeName=='data-loading-progress'){
                        var val=attr_arr_2[a].attributes[0].value-0;
                        that.width_plus(val);
                    }
                }
            }


        }
        setTimeout(function(){
            var obj=document.getElementById(that.id);
            if(obj.style.width.replace('%','')<progress){
                check();
            }else{
                that.img_check(progress,100,imgcheck);
            }
        },50)
    }
};
loading_progress.prototype.img_check=function(start,progress,on){//图片加载计算
    var that=this;
    var img_list=document.getElementsByTagName('img');
    var p=progress-start;
    var step=p/img_list.length;
    if(on&&img_list.length>0){
        check();
    }else{
        that.width_plus(progress);
        if(progress>=100){
            setTimeout(function(){that.fade_out();},1000);
        }
    }

    function check(){
        var complete_arr=[];
        var loading_arr=[];
        for(var i=0;i<img_list.length;i++){
            if(img_list[i].complete){
                complete_arr.push(img_list[i]);
            }else{
                loading_arr.push(img_list[i]);
            }
        }
        setTimeout(function(){
            that.width_plus(complete_arr.length*step+start);
            if(complete_arr.length*step+start>=100){
                setTimeout(function(){that.fade_out();},1000);
            }else{
                check();
            }
        },250);
    }
};
