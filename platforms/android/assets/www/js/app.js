(function() {

  var app = angular.module('Acemate', ['btford.modal', 'ngStorage', 'ngCordova', 'mgcrea.pullToRefresh']);
  //var app = angular.module('Acemate', ['btford.modal','ngStorage','ngColorThief']);  

  app.controller('local_storage', function($scope, $localStorage, $sessionStorage) {
    $scope.$storage = $localStorage.$default({
      user_id: 5,
      handle: 'crimson_zangetsu'
    });
  });
 

  // let's make a modal called `myModal`
  app.factory('myModal', function(btfModal) {
    return btfModal({
      controller: 'MyModalCtrl',
      controllerAs: 'modal',
      templateUrl: 'modal.html'
    });
  });

  // typically you'll inject the modal service into its own
  // controller so that the modal can close itself
  app.controller('MyModalCtrl', function(myModal) {
    this.closeMe = myModal.deactivate;
	this.userid = angular.element(item).data('user'); 
  });

  app.controller('MyCtrl', function(myModal) {
    this.showModal = myModal.activate;
  });

  

  app.filter('fromNow', function() {
    return function(dateString) {
      return moment(dateString).fromNow()
    };
  });

  //uses: https://gist.github.com/rishabhmhjn/7028079
  app.filter('linkify', function($sce) {
    var
    // replace #hashtags
      replacePattern1 = /(^|\s)#(\w*[a-zA-Z_]+\w*)/gim,
      // replace @mentions
      replacePattern2 = /(^|\s)\@(\w*[a-zA-Z_]+\w*)/gim;

    return function(text, target, otherProp) {
      replacedtext = text.replace(replacePattern1, "$1<a class=\"mention_hash\" href=\"interests-feed.html#/?hashtag=$2\">#$2</a>");
      replacedtext = replacedtext.replace(replacePattern2, "$1<a class=\"mention_hash\" href=\"profile.html#/?user=$2\">@$2</a>");
      return $sce.trustAsHtml(replacedtext);
    };
  });

  app.controller('HomeController', function($scope,$http, $localStorage) {
    $scope.users = 100000000;
    $scope.interests = 9001;
	 $scope.email = $localStorage.handle;
    $scope.login = function(){
      $scope.error = false;
	  //user credentials
     
      
	  
      $http.jsonp('http://acemate.us/api/?checklogin&login='+ $scope.login.email +'&password='+ $scope.login.password +'&callback=JSON_CALLBACK').success(function(data) {
        var data = data;
		/*
		
		{
			"user": [{
				"id": "5",
				"name": "Alyssa Q",
				"handle": "crimson_zangetsu",
				"profile_color": "225, 50, 79",
				"featured_id": "1",
				"bio": "I hate rain. Ichigo\u2026 When you are sad, the rain comes down\u2026 when you are moody, it becomes cloudy. It rains in here, too. I can\u2019t stand it. Can you un"
			}],
			"notifications": {
				"new_comments": 8,
				"new_likes": 7,
				"new_messages": 5,
				"group_notifications": {
					"new_comments": 6,
					"new_likes": 6
				}
			}
		}
		*/
		// if user is valid we save user data in localstorage
		$localStorage.user_id = data.user.id;  
        $localStorage.handle = data.user.handle;
		$localStorage.profile_color = data.user.profile_color;
		$localStorage.notifications = data.notifications;

        document.location = 'home.html';
      }).error(function(error) {
        //do error handling here
		 $scope.errormsg = 'Invalid login/password';
      });
    }
  });
   

  // Home Main Feed Page
  app.controller('UpdateController', function($scope, $http) {
    //this.section = user_updates;

    $http.jsonp('http://acemate.us/api/index.php?generatefeed&user_id=5&limit=20&callback=JSON_CALLBACK').success(function(data) {
      $scope.updates = data;
    });
  });
  
  
  // Main Search/Toggler (Groups, hashtag, and people)
  app.controller("searchToggle", function($scope) {
    $scope.search = {
      url: "include_mainsearch.html"
    };
	this.main_toggled = false;
    this.hashtag_toggled = false;
    this.person_toggled = false;
    this.group_toggled = false;
    //swiping left toggling other tabs
    $scope.swipeSearchBackward = function() {
        if ($scope.search.url == "groupsearch.html") {
          $scope.showSearch('person');
          $scope.isActivePerson = 'active';
          $scope.isActiveHash = '';
          $scope.isActiveGroup = ''
        } else if ($scope.search.url == "hashtagfeed.html") {
          $scope.showSearch('main');
          $scope.isActivePerson = '';
          $scope.isActiveHash = '';
          $scope.isActiveGroup = ''
        } else if ($scope.search.url == "personsearch.html") {
          $scope.showSearch('hashtag');
          $scope.isActivePerson = '';
          $scope.isActiveHash = 'active';
          $scope.isActiveGroup = ''
        }

      }
      //swiping right toggling other tabs
    $scope.swipeSearchForward = function() {
      if ($scope.search.url == "groupsearch.html") {
        $scope.showSearch('main');
        $scope.isActivePerson = '';
        $scope.isActiveHash = '';
        $scope.isActiveGroup = ''
      } else if ($scope.search.url == "hashtagfeed.html") {
        $scope.showSearch('person');
        $scope.isActivePerson = 'active';
        $scope.isActiveHash = '';
        $scope.isActiveGroup = ''
      } else if ($scope.search.url == "personsearch.html") {
        $scope.showSearch('group');
        $scope.isActivePerson = '';
        $scope.isActiveHash = '';
        $scope.isActiveGroup = 'active'
      } else if ($scope.search.url == "include_mainsearch.html") {
        $scope.showSearch('hashtag');
        $scope.isActivePerson = '';
        $scope.isActiveHash = 'active';
        $scope.isActiveGroup = ''
      }
    }
    $scope.showSearch = function(type) {
      if (type !== undefined) {
        if (type == "group") {
          $scope.search.url = "groupsearch.html";
        } else if (type == "hashtag") {
          $scope.search.url = "hashtagfeed.html";
        } else if (type == "person") {
          $scope.search.url = "personsearch.html";
        } else if (type == "main") {
          $scope.search.url = "include_mainsearch.html";
        }
      }
    }
  });
  // Main Search Page_include
  app.controller('InterestsController', function($scope, $http) {
    //this.slider = slider_section;
    //this.collages = collages_section;
    $http.jsonp('http://acemate.us/api/?getsearch&user_id=5&limit=10&callback=JSON_CALLBACK').success(function(data) {
      $scope.results = data;
    });

    $scope.submitForm = function(mainsearch) {
      $http.jsonp('http://acemate.us/api/?getsearchresults&user_id=5&limit=10&query=' + mainsearch + '&callback=JSON_CALLBACK').success(function(data) {
        $scope.results = data;
      }).error(function(error) {
        //do error handling here
      })
    };
  });
  //Group Search Page
  app.controller('GroupController', function($scope, $http) {
    //this.results = group_results;
    $http.jsonp('http://acemate.us/api/?getgroupsearch&user_id=5&limit=10&callback=JSON_CALLBACK').success(function(data) {
      $scope.results = data;
    });
    $scope.submitForm = function(groupsearch) {
      $http.jsonp('http://acemate.us/api/?getgroupresults&user_id=5&limit=10&query=' + groupsearch + '&callback=JSON_CALLBACK').success(function(data) {
        $scope.results = data;
      }).error(function(error) {
        //do error handling here
      })
    };
  });
  //Hashtag Search Page - Trending hashtags search.
  app.controller('HashtagController', function($scope, $http) {
    //this.results = hashtag_results;
    $http.jsonp('http://acemate.us/api/?gethashsearch&user_id=5&callback=JSON_CALLBACK').success(function(data) {
      $scope.results = data;
    });
    $scope.submitForm = function(hashsearch) {
      $http.jsonp('http://acemate.us/api/?gethashresults&user_id=5&query=' + hashsearch + '&callback=JSON_CALLBACK').success(function(data) {
        $scope.results = data;
      }).error(function(error) {
        //do error handling here
      })
    };
  });

  //Person Search Page
  app.controller('PersonController', function($scope, $http) {
    //this.results = person_results;
    $http.jsonp('http://acemate.us/api/?getpersonsearch&user_id=5&callback=JSON_CALLBACK').success(function(data) {
      $scope.results = data;
    });
    $scope.submitForm = function(personsearch) {
      $http.jsonp('http://acemate.us/api/?getpersonresults&user_id=5&query=' + personsearch + '&callback=JSON_CALLBACK').success(function(data) {
        $scope.results = data;
      }).error(function(error) {
        //do error handling here
      })
    };
  });
  // Group Page (group post list)
  app.controller('CommunityController', function($scope, $http) {
    //this.feed = community_feed;
    $http.jsonp('http://acemate.us/api/?getgrouppage&user_id=5&group_id=1&limit=10&callback=JSON_CALLBACK').success(function(data) {
      $scope.feed = data;
    });
  });
  //Single Group Post
  app.controller('CommunitySinglePostController', function($scope, $http) {
    //this.section = community_post;
    $http.jsonp('http://acemate.us/api/?getgrouppostdata&user_id=5&group_post=1&callback=JSON_CALLBACK').success(function(data) {
      $scope.section = data;
    });
  });
  // Single Profile Post
  app.controller('UpdateSingleController', function($scope, $http, $location, $localStorage) {
    //this.section = user_post; 
    $http.jsonp('http://acemate.us/api/?getpostdata&user_id=5&post=' + $location.search().id + '&callback=JSON_CALLBACK').success(function(data) {
      $scope.section = data;
    });

    $scope.sendComment = function(){

      var data = {
        posted_by : $localStorage.user_id,
        handle : $localStorage.handle,
        response : $scope.userComment
      }

      //change me
      var post_comment_api_url = "http://acemate.us/api/?";
      
      //$http.post(post_comment_api_url, data).then(function(data){


        //display my comment
        $scope.section.mainfeed[0].comments.push(data);
      
      //})
    }
  });
  //Profile Page
  app.controller('ProfileController', function($scope, $http, $location) {
    // this.showModal = myModal.activate;
	var profile_check1 = $location.search().id;
	var profile_check2 = $location.search().user;
	if (profile_check1) {
		var profile_id = profile_check1;
	} else {
		var profile_id = profile_check2;
	}
	
    //this.feed = profile_feed;
    $http.jsonp('http://acemate.us/api/?getprofile&user_id=5&profile_id=' + profile_id + '&post=1&limit=10&callback=JSON_CALLBACK').success(function(data, myModal) {
      $scope.feed = data;
    });
  });


  //About Me Modal
  app.controller('AboutMeController', function($scope, $http) {
	
    $http.jsonp('http://acemate.us/api/?getaboutme&user_id=5&profile_id=' + modal.userid + '&callback=JSON_CALLBACK').success(function(data, myModal) {
      $scope.about = data;
    });
  });

  //Messages Page
  app.controller('MessagesController', function($scope, $http) {

    $scope.page = 0;

    fetchMessages();

    $scope.messages = [];

    function fetchMessages(){
      //this.recent = recent_contacts;
      //this.chat = chat_excerpts;
      $http.jsonp('http://acemate.us/api/?getmessages&user_id=5&page='+$scope.page+'&limit=10&callback=JSON_CALLBACK').success(function(data) {
        $scope.messages = data;
      });

    }

    $scope.loadMoreMessages = function(){
      $scope.page++;
      fetchMessages();
    }

  });
  //Chat Page
  app.controller('ChatController', function($scope, $http) {
    //this.chatroll   = chat_roll;
    $http.jsonp('http://acemate.us/api/?getchat&user_id=3&partner_id=5&callback=JSON_CALLBACK').success(function(data) {
      $scope.chatroll = data;
    });
  });
  // #Interest in Feed Form (The hashtag posts Slider)
  app.controller('HashtagFeedController', function($scope, $http, $location) {
    //this.feed = feed_interests;
    $http.jsonp('http://acemate.us/api/?gethashfeed&user_id=5&query=' + $location.search().hashtag + '&limit=10&callback=JSON_CALLBACK').success(function(data) {
      $scope.hashtagfeed = data;
    });
  });
  // #Interest in Feed Form (The hashtag list)
  app.controller('HashtagListController', function($scope, $http, $location) {
    //this.feed = feed_interests;
    $http.jsonp('http://acemate.us/api/?gethashlist&user_id=5&query=' + $location.search().hashtag + '&limit=10&callback=JSON_CALLBACK').success(function(data) {
      $scope.hashtagfeed = data;
    });
    $scope.submitForm = function(hashsearch) {
      $http.jsonp('http://acemate.us/api/?gethashlistresults&user_id=5&query=' + hashsearch + '&callback=JSON_CALLBACK').success(function(data) {
        $scope.hashtagfeed = data;
      }).error(function(error) {
        //do error handling here
      })
    };
  });
  app.controller('InterestsListController', function($scope, $http, $location) {
    //this.list = interests_list;
    $http.jsonp('http://acemate.us/api/?getuserinterests&user_id=5&profile_id=' + $location.search().profile_id + '&limit=21&callback=JSON_CALLBACK').success(function(data) {
      $scope.user_interest_list = data;
    });
  });

  app.controller("CameraController", function($scope, $cordovaCamera, $cordovaImagePicker, $localStorage) {

    $scope.loading = false;

    $scope.takePicture = function() {
      console.log('cheese !');

      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
      }, function(err) {
        console.log('ERROR ' + err);
      });
    }

    $scope.chooseFile = function() {

      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 300,
        targetHeight: 300,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
      }, function(err) {
        console.log('ERROR ' + err);
      });
    }

    $scope.postToAM = function(){
      
      $scope.loading = true;

      var data = {
        user_id : $localStorage.user_id,
		handle : $localStorage.handle,
        image : $scope.imgURI,
        comment : $scope.imgCaption,
		type : "photo"
      }

      //send to api
		$http({
            url: "http://acemate.us/api/?uploadphoto",
            method: "POST",
            data: data,
            headers: {'Content-Type': undefined}
        }).success(function (response) {
            callback(response);
        });
      setTimeout(function(){

        //go back to home
        document.location = "home.html";

      }, 2000);


    }

    $scope.cancel = function(){
      $scope.imgURI = null;
      $scope.imgCaption = null;
    }
  });


  app.controller('SettingsController', function() {

  });

})();