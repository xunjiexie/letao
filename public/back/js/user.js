$(function(){
  $.ajax({
    type:'get',
    url:'/user/queryUser',
    dataType:'json',
    data:{
      page:1,
      pageSize:5
    },
    success:function(info){
      console.log(info);
      var htmlStr = template('tmp', info);
      // console.log(htmlStr);
      $('tbody').html(htmlStr);
    }
  })
})