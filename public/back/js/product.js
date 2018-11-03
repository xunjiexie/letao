$(function(){
  var currentPage = 1;
  var pageSize = 2;
  var picArr = [];
  function render(){
    $.ajax({
      type:'get',
      url:'/product/queryProductDetailList',
      dataType:'json',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        // console.log(info);
        var htmlStr = template('tmp',info);
        $('tbody').html(htmlStr);
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage:currentPage,//当前页
          totalPages:info.total/info.size,//总页数
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
  $('.product_btn').click(function(){
    $('#addModal').modal('show');
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      dataType:'json',
      data:{
        page:1,
        pageSize:100
      },
      success:function(info){
        console.log(info);
        var htmlStr = template('tmp2',info);
        // console.log(htmlStr);
        $('.dropdown-menu').html(htmlStr);
      }
    })
  })

  $('.dropdown-menu').on('click','a',function(){
    var txt = $(this).text();
    // console.log(txt);
    $('#dropdownText').text(txt);
    var id = $(this).data('id');
    $('[name="brandId"]').val(id);
    $('#form').data('bootstrapValidator').updateStatus('brandId','VALID');
  })

  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      console.log(data);
      var picObj = data.result;
      var picUrl = data.result.picAddr;
      picArr.unshift(picObj);
      $('#imgBox').prepend("<img src='"+ picUrl +"'>");
      if(picArr.length>3){
        picArr.pop()
        $('#imgBox img:last-of-type').remove();
      }
      console.log(picArr);
      if(picArr.length === 3){
        $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID');
      }
    }
});

  $('#form').bootstrapValidator({
    excluded: [],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      brandId:{
        validators:{
          notEmpty:{
            message:'请选择二级分类'
          }
        }
      },
      proName:{
        validators:{
          notEmpty:{
            message:'请输入商品名称'
          }
        }
      },
      proDesc:{
        validators:{
          notEmpty:{
            message:'请输入商品描述'
          }
        }
      },
      num:{
        validators:{
          notEmpty:{
            message:'请输入商品库存'
          },
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '库存格式要求是非零开头的数字'
          }
        }
      },
      size:{
        validators:{
          notEmpty:{
            message:'请输入商品尺码'
          },
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码格式必须是 xx-xx 的格式, 例如: 32-40'
          }
        }
      },
      oldPrice:{
        validators:{
          notEmpty:{
            message:'请输入商品原价'
          }
        }
      },
      price:{
        validators:{
          notEmpty:{
            message:'请输入商品现价'
          }
        }
      },
      picStatus:{
        validators:{
          notEmpty:{
            message:'请上传3张图片'
          }
        }
      }
     
    }
  })

  $('#form').on("success.form.bv", function( e ) {

    e.preventDefault();

    // 拼接需要传给后台的参数
    var params = $('#form').serialize();   // aa=xx&bb=xx

    // params += "&picName1=xx&picAddr1=xx";
    params += "&picName1="+ picArr[0].picName +"&picAddr1=" + picArr[0].picAddr;
    params += "&picName2="+ picArr[1].picName +"&picAddr2=" + picArr[1].picAddr;
    params += "&picName3="+ picArr[2].picName +"&picAddr3=" + picArr[2].picAddr;
    // console.log(params);
    // 通过 ajax 提交
    $.ajax({
      type: "POST",
      url: "/product/addProduct",
      data: params,
      dataType: "json",
      success: function( info ) {
        // console.log( info );
        if ( info.success ) {
          // 添加成功
          // 关闭模态框
          $('#addModal').modal("hide");
          // 重新渲染第一页
          currentPage = 1;
          render();
          // 重置模态框的表单内容和状态
          $('#form').data("bootstrapValidator").resetForm(true);
          // 重置文本和图片
          $('#dropdownText').text("请选择二级分类");
          $('#imgBox img').remove();
        }
      }
    })

  })

  


})