/*
	Author: OpenSourceAnonymous
	Desc: 	This is the main js file for the web application
*/


var Main = {
	init: function(){

		// Main.resize();
		var client = new BinaryClient('ws://localhost:3000');

    	client.on('open',function(){

      		// $('#content').bind('drop', function(e){
      		$('body').bind('drop', function(e){
      			alert("Shithead!!!");

	        	e.originalEvent.preventDefault();
	        	var file = e.originalEvent.dataTransfer.files[0];

		        // Add to list of uploaded files
		        $('<div align="center"></div>').append($('<a></a>').text(file.name).prop('href', '/'+file.name)).appendTo('body');

		        // `client.send` is a helper function that creates a stream with the
		        // given metadata, and then chunks up and streams the data.
		        var stream = client.send(file, {name: file.name, size: file.size});

		        // Print progress
		        var tx = 0;
		        stream.on('data', function(data){
		          $('#progress').text(Math.round(tx+=data.rx*100) + '% complete');
		        });
      		});
    	});

	},
	resize:function(){
		Win.init();
	}
}

Main.init();


