$(function(){
   /*
   * 1. 进行表单校验配置
   *    校验要求:
   *        (1) 用户名不能为空, 长度为2-6位
   *        (2) 密码不能为空, 长度为6-12位
   * */
  $("#form").bootstrapValidator({
    // message: 'this value is not valid',
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh' 
    },
    fields: {
      username: {
        // message:'this username is not valid',
        validators: {
          notEmpty: {
            message: '用户名不能为空'
          },
          stringLength: {
            min:2,
            max:6,
            message:'用户名长度必须在2-6之间'
          },
          callback: {
            message:'用户名不存在'
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message:'密码不能为空'
          },
          stringLength: {
            min:6,
            max:12,
            message:'密码长度必须在6-12位'
          },
          callback: {
            message: '密码错误'
          }
        }
      }
    }
    
  })
  /*
   * 2. 登录功能
   *    表单校验插件会在表单提交时进行校验, 如果希望通过 ajax 提交
   *    可以注册表单校验成功事件, 在事件中, 阻止默认的跳转提交, 通过 ajax 进行提交
   * */
  $('form').on('success.form.bv', function(e){
    e.preventDefault();
    $.ajax({
      type:"post",
      url:"/employee/employeeLogin",
      data:$('#form').serialize(),
      dataType:"json",
      success:function(info){
        // console.log(info);
        if(info.success){
          location.href = "index.html";
        }
        else if(info.error == 1000) {
          $('#form').data('bootstrapValidator').updateStatus('username', 'INVALID', 'callback');
        }
        else if(info.error == 1001) {
          $('#form').data('bootstrapValidator').updateStatus('password', 'INVALID', 'callback');
        }
      }
    })
  })

  // 重置表单
  $("#btn_reset").click(function(){
    $('#form').data('bootstrapValidator').resetForm();
  })
})
