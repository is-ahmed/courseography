/*jslint todo: true */
/*global $, console, jQuery*/
/*jslint browser:true */
/*jslint plusplus: true */
"use strict";
var result;
var i;
var contentString = "";
var courseSelect;
var xmlhttp;
var csvSplitNewline;
var splitLine;
var isACourse;
var notYetLogged;
var header;
var sections;
var entry;
$(document).ready(function () {
    courseSelect = document.getElementById("course-select");
    
    csvSplitNewline = getCourseArray();
    setupList();
    setAccordion();
    trapScroll();
});

function getCourseArray() {
    var httpResponse;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new window.ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.open("GET", "../../res/timetable2014.csv", false);
    xmlhttp.send();

    httpResponse = xmlhttp.responseText;

    return httpResponse.split("\n");
}

function setupEntry(courseObject) {
    entry = document.createElement("li");
    header = document.createElement("h3");
    header.appendChild(document.createTextNode(courseObject.code));
    courseObject.header = header;
    sections = processSession(courseObject);
    entry.appendChild(header);
    $(sections).css("height","100%");
    $(sections).css("width","100%");
    entry.appendChild(sections);
    courseSelect.appendChild(entry);
}

function getCourse(courseCode) {
    $.ajax({
        url: "../../res/courses/timetable/" + courseCode + "TimeTable.txt",
        dataType: "json",
        async: false,
        success: function (data) {
            result = data;
        }
    });
    return result;
}

function addCourseToList(course) {
    var courseObject = getCourse(course);
    courseObject.selectedSession = null;
    courseObject.selected = "false";

    // Convert CSC***H1 -> CSC***
    courseObject.code = courseObject.code.substring(0, 6);
    setupEntry(courseObject);
}

function setupList() {
    var course;
    // Iterates through the courses grabbed with the XMLHTTP request.
    // TODO: Rely on better way to grab all course node name in the future.
    for (i = 0; i < csvSplitNewline.length; i++) {
        splitLine = csvSplitNewline[i].split(",");
        course = splitLine[0];
        isACourse = course.indexOf("CSC") > -1;

        // Filters out graduate/undergraduate hybrid courses and makes them purely undergraduate courses.
        if (course.indexOf("/") > -1) {
            course = course.substring(0, course.indexOf("/"));
        }

        // Many courses have duplicate listings due to the timetable holding both F and S sections.
        notYetLogged = contentString.indexOf(course) <= -1;

        if (isACourse && notYetLogged) {
            addCourseToList(course);
            contentString = contentString + course;
        }
    }
}
