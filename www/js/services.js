angular.module('starter.services', ['firebase'])

.factory('Events', function($firebaseArray, $rootScope) {
  // Might use a resource here that returns a JSON array
  // Some fake testing data
  var ref = new Firebase(firebaseUrl);
  var events = $firebaseArray(ref.child('events'));
  
  
  function getEvents(){
    return events;
  }

  return {
    all: function(){
      return getEvents()
    },
    create: function(event) {
      events.$add({
        title: event.title,
        date: toDay,
        displayName: event.displayName,
        uid: event.uid
      })
    },
    edit: function(res, event) {
      events.$getRecord(event.$id).title = res;
      events.$save(event);
    },
    remove: function(event) {
      events.$remove(event);
    }
  };
})

.factory('Notices', function($firebaseArray, $rootScope) {
  // Might use a resource here that returns a JSON array
  // Some fake testing data
  var ref = new Firebase(firebaseUrl);
  var notices = $firebaseArray(ref.child('notices'));
  
  
  function getNotices(){
    return notices;
  }

  return {
    all: function(){
      return getNotices()
    },
    create: function(notice) {
      notices.$add({
        title: notice.title,
        date: toDay,
        displayName: notice.displayName,
        uid: notice.uid
      })
    },
    edit: function(res, notice) {
      notices.$getRecord(notice.$id).title = res;
      notices.$save(notice);
    },
    remove: function(notice) {
      notices.$remove(notice);
    }
  };
})

.factory('Rooms', function($firebaseArray, $rootScope) {
  // Might use a resource here that returns a JSON array
  // Some fake testing data
  var ref = new Firebase(firebaseUrl);
  var rooms = $firebaseArray(ref.child('rooms'));
  function getRooms(){
    return rooms;
  }
  function getDashRooms(){
    var dashRooms = $firebaseArray(ref.child('rooms').orderByChild('date').equalTo(toDay));
    return dashRooms;
  }
  return {
    all: function(){
      return getRooms()
    },
    dashAll: function(){
      return getDashRooms();
    },
    create: function(room) {
      rooms.$add({
        title: room.title,
        date: room.date,
        startTime: room.startTime,
        endTime: room.endTime,
        displayName: room.displayName,
        uid: room.uid,
        attendee: room.attendee
      })
      console.log(room.date);
    },
    edit: function(res, room) {
      rooms.$getRecord(room.$id).title = res;
      rooms.$save(room);
    },
    remove: function(room) {
      rooms.$remove(room);
    }
  };
})

.factory("Auth", ["$firebaseAuth", "$rootScope", function($firebaseAuth, $rootScope) {
  var ref = new Firebase(firebaseUrl);
  return $firebaseAuth(ref);
}])