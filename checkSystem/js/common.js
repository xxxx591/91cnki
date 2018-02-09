var form;
var element;
var laypage;
var laydate;
'use strict';
layui.use(['jquery', 'form', 'layer', 'element', 'laypage','laydate'], function () {
    window.jQuery = window.$ = layui.jquery;
    window.layer = layui.layer;
    form = layui.form();
    element = layui.element();
    laypage = layui.laypage;
    laydate = layui.laydate;
    $(".layui-canvs").width($(window).width());
    $(".layui-canvs").height($(window).height());
});

//获取当前网址，如 http://localhost:8080/demo/xx/xx.jsp
var curWwwPath = window.document.location.href;
//获取主机地址之后的目录，如： demo/xx.jsp
var pathName = window.document.location.pathname;
var pos = curWwwPath.indexOf(pathName);
//获取主机地址，如： http://localhost:8080
var localhostPaht = curWwwPath.substring(0, pos);
//获取带"/"的项目名，如：/demo
var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
var PageCommon = {contextPath: localhostPaht};

$(document).ready(function () {
    $(document).ajaxStart(onStart).ajaxComplete(onComplete).ajaxSuccess(onSuccess);
});

function onStart(event) {
}

function onComplete(event, xhr, settings) {
    if (xhr.status == 403) {
        alert("与服务器断开连接，请重新登录！");
        window.location.href = PageCommon.contextPath + "/manger/login.xhtml";
    }
}

function onSuccess(event, xhr, settings) {
}

Date.prototype.Format = function (datePattern) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(datePattern)) datePattern = datePattern.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(datePattern)) datePattern = datePattern.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return datePattern;
};

function StringBuffer() {
    this.__strings__ = new Array();
}
StringBuffer.prototype.append = function (str) {
    this.__strings__.push(str);
    return this;    //方便链式操作
};
StringBuffer.prototype.toString = function () {
    return this.__strings__.join("");
};