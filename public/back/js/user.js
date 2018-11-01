

$(function(){
  var pageSize = 5;
  var currentPage = 1;
  var id;
  var isDelete;
  function render(){
    $.ajax({
      type:'get',
      url:'/user/queryUser',
      dataType:'json',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        console.log(info);
        // console.log(pageSize);
        var htmlStr = template('tmp', info);
        // console.log(htmlStr);
        $('tbody').html(htmlStr);
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage:info.page,//当前页
          totalPages:Math.ceil(info.total/info.size),//总页数
          size:"small",//设置控件的大小，mini, small, normal,large
          onPageClicked:function(a,b,c,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            // console.log(page);
            currentPage = page;
            render();
          }
        });
      }
    })
  }
  render();
  
  $('.content table').on('click','button',function(){
    $('#myModal2').modal('show');
    console.log(this);
    id = $(this).parent().parent().children()[0].innerText;
    isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
  })
    $('#myModal2 .modal-footer .btn-primary').click(function(){ 
      $.ajax({
        type: 'post',
        url: '/user/updateUser',
        dataType: 'json',
        data: {
          id:id,
          isDelete:isDelete
        },
        success:function(info){
          console.log(info);
          $('#myModal2').modal('hide');
          console.log(id);
          console.log(isDelete);
          render();
        }
      })
    })
  
})