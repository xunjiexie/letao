$(function(){
  $.ajax({
    type:'get',
    url:'/employee/checkRootLogin',
    dataType:'json',
    success:function(info){
      if(info.message === "未登录！"){
        location.href = "login.html"
      }
      // console.log(info);
    }
  })

  var as = $('.sidebar .nav a');
  $('.sidebar .nav a.nav_category').click(function() {
    $(this).next().stop().slideToggle();
  })
  
  $('.main .topbar .glyphicon-menu-hamburger').click(function(){
    $('.sidebar').toggleClass('hidemenu');
    $('.main .topbar').toggleClass('hidemenu');
    $('.main ').toggleClass('hidemenu');
  })

  $('.main .topbar .glyphicon-share').click(function(){
    $('#myModal').modal('show')
  })

  $("#myModal .modal-footer .btn-primary").click(function(){
    $.ajax({
      type:'get',
      url:'/employee/employeeLogout',
      dataType:'json',
      success:function(info){
        console.log(info);
        if(info.success){
          location.href="login.html"
        }
      }
    })
  })
})


