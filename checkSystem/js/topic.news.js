var form;
var $;
var laypage;
var layer;
;!function () {
    //当使用了 layui.all.js，无需再执行layui.use()方法
    from = layui.form(),
        $ = layui.jquery,
        laypage = layui.laypage,
        layer = layui.layer;

    var curr = $("input[name='page']").val();
    var pages = $("input[name='pages']").val();
    laypage({
        cont: 'page-bd',
        curr: curr,
        pages: pages,
        skin: '#1E9FFF',
        jump: function (obj, first) {
            if (!first) {
                window.location.href = "/news/index-" + obj.curr + ".html";
            }
        }
    });
}();
