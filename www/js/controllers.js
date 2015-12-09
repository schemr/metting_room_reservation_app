angular.module('starter.controllers', ['firebase'])

.controller('LoginCtrl', function ($scope, $firebaseObject, $location, Auth) {
  Auth.$onAuth(function(authData) {
    console.log(authData);
    if (authData === null) {
      $scope.authData = authData;
      console.log('Not logged in yet');
    } else {
      $scope.authData = authData;
      console.log('Logged in as', authData.uid);
      $location.path("/tab/dash");
    }
  });
  $scope.login = function() {
    Auth.$authWithOAuthRedirect('google').then(function(authData) {
    }).catch(function(error) {
      if (error.code === 'TRANSPORT_UNAVAILABLE') {
        Auth.$authWithOAuthPopup('google').then(function(authData) {
        });
      } else {
        console.log(error);
      }
    });
  };
})

.controller('DashCtrl', function ( $scope, $location, Auth ) {
   // Logout method
    $scope.logout = function () {
      Auth.$unauth();

      $location.path("/login");    
    };
})
.controller('NoticeCtrl', function($scope, $ionicModal, $ionicPopup, SQLServices) {
  
  SQLServices.setup();

  $scope.loadNotice = function(){
    SQLServices.all().then(function(results){
      $scope.notices = results;
    });
   /* $scope.notices = Notices.all();  */
  };
  
  $scope.loadNotice();
  
  $scope.remove = function(notice) {
    Notices.remove(notice);
  };
  
  $ionicModal.fromTemplateUrl('new-notice.html', function(modal){
    $scope.noticeModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.newNotice = function(){
    $scope.noticeModal.show();
  };

  $scope.closeNewNotice = function(){
    $scope.noticeModal.hide();
  };

  $scope.createNotice = function(notice){
    // save Notice
    SQLServices.set(notice.notice_title);
    $scope.loadNotice();
    $scope.noticeModal.hide();
    notice.title='';
  }

  $scope.onItemDelete = function(noticeid){
    $ionicPopup.confirm({
      title: 'Confirm Delete',
      content: '선택한 공지사항을 삭제하겠습니까?'
    }).then(function(res){
      if(res){
        //del notice
        SQLServices.del(noticeid);
        $scope.loadNotice();
      }
    })
  }

  $scope.onItemEdit = function(noticeid){
    $ionicPopup.prompt({
      title: 'Update notice', 
      sunTitle: 'Enter new notice'
    }).then(function(res){
      if(res != undefined){
        //edit notice
        SQLServices.edit(res, noticeid);
        $scope.loadNotice();
      }else{
        $scope.loadNotice();
      }
    });
  }

  // move Item
  $scope.moveItem = function(item, fromIndex, toIndex){
    $scope.items.splice(fromIndex, 1);
    $scope.items.splice(toIndex, 0, item);
  }

})
.controller('RoomCtrl', function($scope) {
  
})
.controller('EventCtrl', function($scope) {
  
})
.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
