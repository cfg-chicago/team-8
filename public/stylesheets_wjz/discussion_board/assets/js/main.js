$(document).ready(function() {
	// Hides expand all link by default
	$( ".js-expand-all" ).hide();
	// Toggles expanding and collapsing individual boards
     $(".m-topic-container").fadeOut(0);
     $(".m-board").click(function() {
          $(".m-topic-container").not($(this).next()).slideUp('fast');
          $(this).next().slideToggle(400);
     });
});

// Expand and Collapse All Boards

$( ".js-collapse-all" ).click(function() {
	$( ".js-collapse-all" ).hide();
	$( ".js-expand-all" ).show();
     $( ".m-topics-container" ).slideUp();
});

$( ".js-expand-all" ).click(function() {
	$( ".js-expand-all" ).hide();
	$( ".js-collapse-all" ).show();
     $( ".m-topics-container" ).slideDown();
});

// Expand and Collapse Individual Boards

$( ".js-expand-indv" ).hide();

$( ".m-board" ).mouseover(function() {
	$( ".js-expand-indv", this ).show();
});

$( ".m-board" ).mouseout(function() {
	$( ".js-expand-indv", this ).hide();
});


// Select All Checkboxes

$("#checkAll").change(function () {
    $("input:checkbox").prop('checked', $(this).prop("checked"));
});



// Test for new expand/collapse visibility



