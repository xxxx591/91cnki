//返回顶部
function goTop() {
    $('html,body').animate({'scrollTop': 0}, 600);
}
;!function () {
    layui.use('form', function () {
        var form = layui.form();
        form.on('radio(encrypt1)', function (data) {
            $("input[name='orderOrPhone']").attr("placeholder", "请输入手机号，点击查询！");
        });
        form.on('radio(encrypt2)', function (data) {
            $("input[name='orderOrPhone']").attr("placeholder", "请输入淘宝订单编号，点击查询！");
        });
    });
    $(".layui-btn-bs").click(function () {
        query();
    });
    //关闭查询
}();

function query() {
    $(".report-not-exist").hide();
    $(".report-are-exist").hide();
    var orderOrPhone = $("input[name='orderOrPhone']").val();
    $.ajax({
        url: "/check/query.html",
        data: {"orderOrPhone": orderOrPhone},
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if (data.status == 'fail') {
                $(".report-not-exist .layui-form-xs-s2").html(data.msg);
                $(".report-not-exist").show()
            } else if (data.status == 'success') {
                $(".report-are-exist .query-status").html("");
                getResultHtml(data);
                $(".report-are-exist").show();
            }
        }
    });
}

function getResultHtml(data) {
    var status = "";
    var html = "";
    if (data.type == 'order') {
        status += "标题：" + data.record.title + "&nbsp;&nbsp;";
        if (data.record.status == '0') status += "已提交,等待检测";
        if (data.record.status == '1') status += "检测中";
        if (data.record.status == '2') {
            html += new Date(data.record.createTime).Format("yyyy-MM-dd HH:mm:ss");
            html += "&nbsp;&nbsp;";
            html += "检测完成&nbsp;&nbsp;";
            html += "<a target='_blank' href=\"/download/r.html?fileId=" + data.record.reportFileId + "\">立即下载</a>";
        }
        $(".report-are-exist .query-status").html(status);
        $(".report-are-exist .query-result").html(html);
    } else if (data.type == 'phone') {
        $(".report-are-exist .layui-form-xsleft").html("");
        var content = "";
        for (var i = 0; i < data.list.length; i++) {
            var record = data.list[i];
            status = "";
            html = "";
            content += "<span class=\"layui-form-xs-s2\">";
            status += "标题：" + record.title + "&nbsp;&nbsp;";
            if (record.status == '0') status += "正在排队";
            if (record.status == '1') status += "检测中";
            if (record.status == '2') {
                html += "时间：" + new Date(record.createTime).Format("yyyy-MM-dd HH:mm:ss");
                html += "&nbsp;&nbsp;";
                html += "检测完成&nbsp;&nbsp;";
                html += "<a target='_blank' href=\"/download/r.html?fileId=" + record.reportFileId + "\">立即下载</a>";
                html += "&nbsp;&nbsp;";
                html += "<a href=\"javascript:void(0);\" onclick='deleteReport(" + record.id + ")'>删除</a>";
            }
            content += "<span class=\"query-status\">" + status + "</span>";
            content += "<span class=\"query-result\">" + html + "</span>";
            content += "</span>";
        }
        $(".report-are-exist .layui-form-xsleft").html(content);
    }
}

function deleteReport(id) {
    alert("请联系客服删除报告，序号" + id);
}