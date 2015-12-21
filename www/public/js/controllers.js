angular.module('starter.controllers', ['firebase', 'gapi', 'angular.filter'])

.controller('LoginCtrl', function ($scope, $location, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope, Auth) {
  //var ref = new Firebase($scope.firebaseUrl);
  //var auth = $firebaseAuth(ref);

  $scope.login = function() {
    Auth.$authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        if (error.code === "TRANSPORT_UNAVAILABLE") {
          // fall-back to browser redirects, and pick up the session
          // automatically when we come back to the origin page
          Auth.$authWithOAuthRedirect("google", function(error) { 
            console.log(error);     
          });
        }
      } else if (authData) {
        console.log(authData);
        // user authenticated with Firebase
      }
    });
  };
})

.controller('DashCtrl', function ( $scope, $location, Notices, Events, Rooms, $rootScope, $ionicLoading ) {
  $scope.loadDash = function() {
    $scope.notices = Notices.all();
    $scope.events = Events.all();
    $scope.rooms = Rooms.all();
    if($scope.rooms != undefined){
      $scope.rooms = Rooms.dashAll();  
    }
    $scope.toDay = toDay;
  };
  $scope.loadDash();
})

.controller('NoticeCtrl', function($scope, $rootScope, $ionicModal, $ionicPopup, Notices) {
  $scope.loadNotice = function() {
    $scope.notices = Notices.all()
  };

  $scope.loadNotice();

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
    notice.provider = $rootScope.userInfo.provider;
    notice.displayName = $rootScope.userInfo.google.displayName;
    notice.uid = $rootScope.userInfo.uid;
    Notices.create(notice);
    $scope.loadNotice();
    $scope.noticeModal.hide();
    notice.title='';
  }

  $scope.onItemEdit = function(notice){
    $ionicPopup.prompt({
      title: 'Update notice', 
      sunTitle: 'Enter new notice',
      template: notice.title
    }).then(function(res){
      if(res != undefined){
        Notices.edit(res, notice);
        $scope.loadNotice();
      }else{
        $scope.loadNotice();
      }
    });
  }

  $scope.onItemDelete = function(notice){
    $ionicPopup.confirm({
      title: 'Confirm Delete',
      content: '선택한 공지사항을 삭제하겠습니까?'
    }).then(function(res){
      if(res){
        Notices.remove(notice);
        $scope.loadNotice();
      }
    })
  }
})

.controller('RoomCtrl', function($scope, $rootScope, $ionicModal, $ionicPopup, Rooms) {
  $scope.loadRoom = function() {
    $scope.toDay = toDay;
    $scope.rooms = Rooms.all();
  };
  var indexedDates = [];

  $scope.roomsToFilter = function() {
    indexedDates = [];
    return $scope.rooms;
  }

  $scope.filterDates = function(room) {
    var dateIsNew = indexedDates.indexOf(room.date) == -1;
    if (dateIsNew) {
      indexedDates.push(room.date);
    }
    return dateIsNew;
  }

  $scope.loadRoom();

  $ionicModal.fromTemplateUrl('new-room.html', function(modal){
    $scope.roomModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.newRoom = function(){
    $scope.room = {};
    $scope.roomModal.show();
  };

  $scope.closeNewRoom = function(){
    $scope.roomModal.hide();
  };

  $scope.createRoom = function(room){
    room.provider = $rootScope.userInfo.provider;
    room.displayName = $rootScope.userInfo.google.displayName;
    room.uid = $rootScope.userInfo.uid;
    room.date = room.date.yyyymmdd();
    Rooms.create(room);
    $scope.loadRoom();
    $scope.roomModal.hide();
    
  }

  $scope.onItemEdit = function(room){
    $ionicPopup.prompt({
      title: 'Update Reservation', 
      sunTitle: 'Enter new Reservation'
    }).then(function(res){
      if(res != undefined){
        Rooms.edit(res, event);
        $scope.loadRoom();
      }else{
        $scope.loadRoom();
      }
    });
  }

  $scope.onItemDelete = function(room){
    $ionicPopup.confirm({
      title: 'Confirm Delete',
      content: '선택한 예약를 삭제하겠습니까?'
    }).then(function(res){
      if(res){
        Rooms.remove(room);
        $scope.loadRoom();
      }
    })
  }
})

.controller('EventCtrl', function($scope, $rootScope, $ionicModal, $ionicPopup, Events) {
  $scope.loadEvent = function() {
    $scope.events = Events.all();
    $scope.toDay = toDay;
  };

  $scope.loadEvent();

  $ionicModal.fromTemplateUrl('new-event.html', function(modal){
    $scope.eventModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.newEvent = function(){
    $scope.eventModal.show();
  };

  $scope.closeNewEvent = function(){
    $scope.eventModal.hide();
  };

  $scope.createEvent = function(event){
    event.provider = $rootScope.userInfo.provider;
    event.displayName = $rootScope.userInfo.google.displayName;
    event.uid = $rootScope.userInfo.uid;
    event.date = event.date.yyyymmdd();
    Events.create(event);
    $scope.loadEvent();
    $scope.eventModal.hide();
    event={};
  }

  $scope.onItemEdit = function(event){
    $ionicPopup.prompt({
      title: 'Update event', 
      sunTitle: 'Enter new event',
      template: event.title
    }).then(function(res){
      if(res != undefined){
        Events.edit(res, event);
        $scope.loadEvent();
      }else{
        $scope.loadEvent();
      }
    });
  }

  $scope.onItemDelete = function(event){
    $ionicPopup.confirm({
      title: 'Confirm Delete',
      content: '선택한 이벤트를 삭제하겠습니까?'
    }).then(function(res){
      if(res){
        Events.remove(event);
        $scope.loadEvent();
      }
    })
  }
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
