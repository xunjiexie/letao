$(function(){
  var currentPage = 1;
  var pageSize = 5;
  function render(){
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      dataType:'json',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        // console.log(info);
        var htmlStr = template('tmp', info);
        // console.log(htmlStr);
        $('.content tbody').html(htmlStr);

        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage:currentPage,//当前页
          totalPages:Math.ceil(info.total/info.size),//总页数
          size:"small",//设置控件的大小，mini, small, normal,large
          onPageClicked:function(event, originalEvent, type,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          }
        });

      }
    })
  }
  render();

  $('button.second_btn').click(function(){
    $('#addModal').modal('show');
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      dataType:'json',
      data:{
        page:1,
        pageSize:100
      },
      success:function(info){
        // console.log(info);
        var htmlStr = template('tmp2', info);
        // console.log(htmlStr);
        $('ul.dropdown-menu').html(htmlStr);
      }
    })
  })

  // 给下拉菜单中的 a 注册点击事件, 通过事件委托注册
  $('.dropdown-menu').on('click','a',function(){
    var txt = $(this).text();
    // console.log(txt);
    $('#dropdownText').text(txt);
    var id = $(this).data('id');
    $('[name="categoryId"]').val( id );
    // console.log(id)
    $('#form').data("bootstrapValidator").updateStatus('categoryId','VALID');

  })

  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      // console.log(data.result.picAddr);
      var picUrl = data.result.picAddr;
      $('#imgBox img ').attr('src',picUrl);
      $('[name="brandLogo"]').val(picUrl);
      $('#form').data("bootstrapValidator").updateStatus('brandLogo','VALID');
    }
  });

  $('#form').bootstrapValidator({
    excluded:[],
    feedbackIcons:{
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      categoryId:{
        validators:{
          notEmpty:{
            message:'请选择一级分类'
          }
        }
      },
      brandName:{
        validators:{
          notEmpty:{
            message:'请输入二级分类'
          }
        }
      },
      brandLogo:{
        validators:{
          notEmpty:{
            message:'请选择图片'
          }
        },
      }
    }
  })

  $('#form').on('success.form.bv',function(e){
    e.preventDefault();
    $.ajax({
      type:'post',
      url:'/category/addSecondCategory',
      dataType:'json',
      data:$('#form').serialize(),
      success: function(info){
        if(info.success){
          $('#addModal').modal('hide');
          $('#form').data("bootstrapValidator").resetForm(true);
          $('#dropdownText').text('请选择一级分类');
          $('#imgBox img').attr('src','./images/none.png');
          currentPage = 1;
          render();
        }
      }
    })
  })
})