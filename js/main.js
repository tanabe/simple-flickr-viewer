$(function() {

  var totalPages = 0;
  var currentPage = 0;
  var perPage = 0;
  var total = 0;

  var loadNextPage = function() {
    if (currentPage < totalPages) {
      getJSON(currentPage + 1);
    } else {
      $("#moreButton").hide();
      $("#loading").hide();
    }
  };

  var initMoreButton = function() {
    $("#moreButton").click(function() {
      if (currentPage < totalPages) {
        getJSON(currentPage + 1);
      }
    });
  };

  var getJSON = function(page) {
    $("#moreButton").hide();
    $("#loading").show();
    $.getJSON(
      "./get_images.pl?page=" + page,
      jsonLoadCallback
    );
  };

  var createImageThumbnailTag = function(thumbnailURL, bigImageURL, date, index) {
    var div = $("<div>").addClass("thumbnail");
    var taken = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
    var imageURL = bigImageURL;
    var aTag = $("<a>").attr({href: imageURL}).attr({target: '_blank'}).append($("<img>").attr({src: thumbnailURL}));
    //var aTag = $("<a>").attr({href: "javascript:void(null)"}).append($("<img>").attr({src: thumbnailURL}));
    /*
    aTag.click((function() {
      return function() {
        Shadowbox.open({
          player: "img",
          content: imageURL,
          title: [Number(taken[1]), "年", Number(taken[2]), "月", Number(taken[3]), "日"].join("")
        });
      };
    })());
    */

    if (((index - 1) % 3) === 0) {
      div.addClass("center");
    }

    div.append(aTag);
    return div;
  };

  var jsonLoadCallback = function(json) {
    //console.log(json);

    var photos = json.rsp.photos.photo;
    currentPage = Number(json.rsp.photos["@page"]);
    totalPages = Number(json.rsp.photos["@pages"]);
    perPage = Number(json.rsp.photos["@perpage"]);
    total = Number(json.rsp.photos["@total"]);

    for (var i = 0; i < photos.length; i++) {
      var photo = photos[i];
      var id = photo["@id"];
      var farmId = photo["@farm"];
      var secret = photo["@secret"];
      var serverId = photo["@server"];
      var thumbnailURL = photo["@url_s"];
      var bigImageURL = photo["@url_z"];
      var date = photo["@datetaken"];
      $("#images").append(createImageThumbnailTag(thumbnailURL, bigImageURL, date, i));
    }

    $("#moreButton").show();
    $("#loading").hide();
  };

  $(window).scroll(function() {
    //var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
    //if (scrollTop >= document.body.offsetHeight - $(window).height()) {
    //  loadNextPage();
    //}
  });

  //init
  getJSON(1);
  initMoreButton();
  Shadowbox.init({
    overlayOpacity: 0.9
  });
});
