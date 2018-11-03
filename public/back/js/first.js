$(function () {
  var currentPage = 1;
  pageSize = 5;
  function render() {
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      dataType: 'json',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        // console.log(info);
        var htmlStr = template('tmp', info);
        // console.log(htmlStr);
        $('.content tbody').html(htmlStr);
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage:currentPage,//当前页
          totalPages:Math.ceil(info.total/pageSize),//总页数
          size:"small",//设置控件的大小，mini, small, normal,large
          onPageClicked:function(event, originalEvent, type,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render()
          }
        });
      }
    })
  }
 
  render();

  $('.content .first_btn').click(function(){
    $('#addModal').modal('show');
  })

  $('#form').bootstrapValidator({
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',   // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 配置需要校验的字段
    fields: {
      categoryName: {
        // 校验规则
        validators: {
          notEmpty: {
            message: "请输入一级分类"
          }
        }
      }
    }
  });

  $('#form').on('success.form.bv',function(e){
    e.preventDefault();
    $.ajax({
      type:'post',
      url:'/category/addTopCategory',
      dataType:'json',
      data:$('#form').serialize(),
      success:function(info){
        console.log(info);
        $('#addModal').modal('hide');
        render();
        $('#form').data('bootstrapValidator').resetForm(true);
      }
    })
  })
})
