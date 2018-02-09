var form;
var $;
var laypage;
var layer;
;!function () {
    //当使用了 layui.all.js，无需再执行layui.use()方法
    form = layui.form();
    $ = layui.jquery;
    laypage = layui.laypage;
    layer = layui.layer;

    $(".query-user-active").click(function () {
        queryByPhone("active");
        $(".coupons-list").hide();
        $(".active-list").show();
    });

    $(".query-user-coupons").click(function () {
        queryByPhone("coupons");
        $(".active-list").hide();
        $(".coupons-list").show();
    });
    form.on('submit(actResultForm)', function (data) {
        submitActResult();
        return false;
    });
}();

function tcs(actId) {
    $("input[name='actId']").val(actId);
    getActDetail(actId);
}

function getActDetail(id) {
    $.ajax({
        url: "",
        data: {"id": id},
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if (data.status == 'success') {
                var html = getActDetailHtml(data.act);
                layer.open({
                    area: '700px',
                    title: "免费领取优惠券",
                    type: '1',
                    content: html,
                    success: function (layero, index) {
                        $('#act-result-submit').click(function () {
                            layer.close(index)
                        })
                    }
                });

                layui.upload({
                    url: '/upload/active.html', //上传接口
                    method: 'POST',
                    success: function (res) { //上传成功后的回调
                        if (res.status == 'success') {
                            $("input[name='fileId']").val(res.fileId);
                            $("input[name='fileName']").val(res.fileName);
                        }
                    }
                });
            }
        }
    });
}

function getActDetailHtml(act) {
    var html = new StringBuffer();
    html.append("<form class=\"layui-form\" method=\"post\">");
    html.append("<div class=\"tc-box\">");
    html.append("<h3>").append(act.title).append("</h3>");
    html.append("<p>").append(act.content).append("</p>");
    html.append("<h3>活动备注：</h3>");
    html.append("<p>每个用户不限参加次数，请在分享完成后10分钟之内提交推荐结果</p>");
    html.append("<div class=\"layui-form-item\">");
    html.append("<div class=\"layui-form-label\">");
    html.append("<input type=\"text\" name=\"fileName\" class=\"layui-input layui-disabled\" disabled=\"disabled\" required lay-verify=\"required\" placeholder=\"请选择上传图片\">");
    html.append("</div>");
    html.append("<div class=\"layui-input-inline\">");
    html.append("<input type=\"file\" name=\"activeFile\" class=\"layui-upload-file\">");
    html.append("</div>");
    html.append("</div>");
    html.append("<div class=\"layui-form-item\">");
    html.append("<div class=\"layui-form-label\">");
    html.append("<input type=\"tel\" name=\"actPhone\" class=\"layui-input\" autocomplete=\"off\" required lay-verify=\"required\" placeholder=\"请填写正确的手机号\">");
    html.append("</div>");
    html.append("<div class=\"layui-input-inline\">");
    html.append("<button name=\"actResultForm\" id=\"act-result-submit\" lay-submit lay-filter=\"actResultForm\" class=\"submit_btn layui-btn-normal layui-btn\">提交结果</button>");
    html.append("</div>");
    html.append("</div>");
    html.append("</div>");
    html.append("</form>");
    return html.toString();
}

function submitActResult() {
    var actId = $("input[name='actId']").val();
    var fileId = $("input[name='fileId']").val();
    var actPhone = $("input[name='actPhone']").val();
    if (isNaN(actPhone) || actPhone.length < 11) {
        layer.msg("请填写正确的手机号");
        return;
    }
    $.ajax({
        url: "/userAct/submit.html",
        data: {
            "actId": actId,
            "fileId": fileId,
            "phone": actPhone
        },
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if (data.status == 'success') {
                layer.msg("提交成功，请耐心等待审核，您也可以通过手机号查询审核进度");
            } else {
                layer.msg("提交失败，请联系客服！");
            }
        }
    });
}

function queryByPhone(queryType, page) {
    var phone = $("input[name='phone']").val();
    var url = "";
    if (queryType == 'coupons') url = "/couponsList/getByPhone.html";
    if (queryType == 'active') url = "/userAct/getByPhone.html";
    $.ajax({
        url: url,
        data: {
            "phone": phone,
            "page": page
        },
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if (data.status == 'success') {
                $("." + queryType + "-query-result").html(getResult(data.list, queryType));
                laypage({
                    cont: 'page-bd',
                    curr: page,
                    pages: data.totalPage,
                    skin: '#1E9FFF',
                    jump: function (obj, first) {
                        if (!first) {
                            queryByPhone(queryType, obj.curr);
                        }
                    }
                });
            }
        }
    });
}

function getResult(list, queryType) {
    var html = "";
    for (var i = 0; i < list.length; i++) {
        var act = list[i];
        if (queryType == 'coupons') html += getCouponsHtml(act);
        if (queryType == 'active') html += getUserActiveHtml(act);
    }
    return html;
}

/**
 * 优惠券
 * @param act
 * @returns {string}
 */
function getCouponsHtml(act) {
    var html = "";
    html += "<tr>";
    html += "<td>" + act.systemShorthand + "</td>";
    html += "<td>" + act.couponsNum + "</td>";
    html += "<td>";
    if (act.status == '1') html += "未使用";
    if (act.status == '0') html += "已使用";
    html += "</td>";
    html += "<td>" + new Date(act.deadline).Format('yyyy-MM-dd HH:mm:ss') + "</td>";
    if (act.usedTime) {
        html += "<td>" + new Date(act.usedTime).Format('yyyy-MM-dd HH:mm:ss') + "</td>";
    } else {
        html += "<td>未使用</td>";
    }
    if (act.status == '1') html += "<td><a href='/check/submit/" + act.systemShorthand.toLowerCase() + ".html'>立即使用</a></td>";
    if (act.status == '0') html += "<td>已使用</td>";
    html += "</tr>";
    return html;
}

function getUserActiveHtml(act) {
    var html = "";
    html += "<tr>";
    html += "<td>" + act.actSystem + "</td>";
    html += "<td><a href='" + act.actResult + "' target='_blank'>查看</a></td>";
    html += "<td>";
    if (act.status == '0') html += "待审核";
    if (act.status == '1') html += "已通过";
    if (act.status == '-1') html += "<em style='color: red;'>不通过</em>";
    html += "</td>";
    html += "</tr>";
    return html;
}