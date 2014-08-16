var trapScroll;
var courses;
var courseCache = [];
var selectedCourses = [];
var selectedLectures = [];
var courseObjects = [];


$(document).ready(function () {

    $("#dialog").fadeOut()
                .css("visibility", "visible");

    generateGrid();
    var tdObjects = $("td");
    tdObjects.each(function () {
            $(this).data("conflicts", []);
        });
    restoreFromCookies();
    renderClearAllButton();
    enableSearch();
    courses = getVeryLargeCourseArray();
    trapScroll();
    setTdHover();
});


function renderClearAllButton() {
    var clearAllItem = document.getElementById("clear-all");
    $(clearAllItem).click(function () {
        if (confirm("Clear all selected courses?")) {
            $.each(courseObjects.slice(0), function (i, course) {
                removeCourseFromList(course.name);
            });
        }
    });
}


/**
 * Adapted from http://codepen.io/LelandKwong/pen/edAmn.
 * Will look into http://jscrollpane.kelvinluck.com/.
 */
 (function($) {
    trapScroll = function(){
        var trapElement;
        var scrollableDist;
        var trapClassName = "trapScroll-enabled";
        var trapSelector = "#course-select";

        var trapWheel = function(e){
            if (!$("body").hasClass(trapClassName)) {
                return;
            } else {
                var curScrollPos = trapElement.scrollTop();
                var wheelEvent = e.originalEvent;
                var dY = wheelEvent.deltaY;

                // only trap events once we've scrolled to the end
                // or beginning
                if ((dY>0 && curScrollPos >= scrollableDist) ||
                    (dY<0 && curScrollPos <= 0)) {
                    return false;
                }
            }
        };

        $(document)
        .on("wheel", trapWheel)
        .on("mouseleave", trapSelector, function() {
            $("body").removeClass(trapClassName);
        })
        .on("mouseenter", trapSelector, function() {
            trapElement = $(this);
            var containerHeight = trapElement.outerHeight();
            var contentHeight = trapElement[0].scrollHeight; // height of scrollable content
            scrollableDist = contentHeight - containerHeight;

            if (contentHeight > containerHeight) {
                $("body").addClass(trapClassName);
            }
        });
    };
})($);
