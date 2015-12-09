angular.module('starter.services', ['firebase'])

.factory('Notices', function() {
  // Might use a resource here that returns a JSON array
  // Some fake testing data
  var notices = [{
    id: 0,
    date: '2015.12.07',
    title: '공지사항 테스트1'
  }, {
    id: 1,
    date: '2015.12.07',
    title: '공지사항 테스트2'
  }, {
    id: 2,
    date: '2015.12.07',
    title: '공지사항 테스트3'
  }, {
    id: 3,
    date: '2015.12.07',
    title: '공지사항 테스트4'
  }, {
    id: 4,
    date: '2015.12.07',
    title: '공지사항 테스트5'
  }];

  return {
    all: function() {
      return notices;
    },
    remove: function(notice) {
      notices.splice(notices.indexOf(notice), 1);
    },
    get: function(noticeId) {
      for (var i = 0; i < notices.length; i++) {
        if (notices[i].id === parseInt(noticeId)) {
          return notices[i];
        }
      }
      return null;
    }
  };
})

.factory('SQLServices', function($q){
  
  var db;

  function createDB(){
    try{
      db = window.openDatabase("noticeDB", "1.0", "maxstApp", 10*1024*1024);
      db.transaction(function(tx){
        tx.executeSql("create table if not exists notices (notice_id integer not null primary key autoincrement, notice_title varchar(100) )", []);
      })
    }catch (err){
      alert('Error processing SQL : ' + err);
    }
  }

  function setNotices(ntitle){
    return promisedQuery("insert into notices (notice_title) values ('" + ntitle + "')", defaultResultHandler, defaultErrorHandler);
  }

  function delNotices(nid){
    return promisedQuery("delete from notices where notice_id = " + nid, defaultResultHandler, defaultErrorHandler); 
  }

  function UpdateNotices(ntitle, nid){
    return promisedQuery("update notices set notice_title = '" + ntitle + "' where notice_id = " + nid, defaultResultHandler, defaultErrorHandler); 
  }

  function getNotices(){
    return promisedQuery("select * from notices", defaultResultHandler, defaultErrorHandler); 
  }

  function defaultResultHandler(deferred){
    return function(tx, results){
      var len = results.rows.length;
      var output_results = [];

      for(var i=0; i<len; i++){
        var t = {'notice_id': results.rows.item(i).notice_id, 'notice_title': results.rows.item(i).notice_title};
        output_results.push(t);
      }
      deferred.resolve(output_results);
    }
  }

  function defaultErrorHandler(deferred){
    return function(tx, results){
      var len = 0;
      var output_results = '';
      deferred.resolve(output_results);
    }
  }

  function promisedQuery(query, successCB, errorCB){
    var deferred = $q.defer();
    db.transaction(function(tx){
      tx.executeSql(query, [], successCB(deferred), errorCB(deferred));
    }, errorCB);
    return deferred.promise;
  }

  return{
    setup: function(){
      return createDB();
    },
    set: function(n_title){
      return setNotices(n_title);
    },
    del: function(noticeid){
      return delNotices(noticeid);
    },
    edit: function(n_title, noticeid){
      return UpdateNotices(n_title, noticeid);
    },
    all: function(){
      return getNotices();
    }
  }
})

.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https//shining-inferno-4605.firebaseio.com");
  return $firebaseAuth(usersRef);
})