/*
	Author: OpenSourceAnonymous
	Desc: 	This is the main js file for the web application
*/


var Main = {
	init: function(){


		// if (window.File && window.FileReader && window.FileList && window.Blob) {
		//   // Great success! All the File APIs are supported.
		//   alert("Everything works correctly!");
		// } else {
		//   alert('The File APIs are not fully supported in this browser.');
		// }



		// Main.resize();
		var client = new BinaryClient('ws://localhost:3000');

    	client.on('open',function(){

    		$('#dropZone').on('drop',function(e){
    			e.originalEvent.preventDefault();

    			var evt = e.originalEvent;



    			// var files = e.target.dataTransfer.files;

    			// var dt = evt.dataTransfer;

    			// var files = dt.files;

    			var files = evt.dataTransfer.files;

    			var tempFile;
    			var outputString;
    			var i=0;
    			var streams = [];

    			// var tempPercent;

    			var tx;

    			for(i; i<files.length; i++){
    				tempFile = files[i];

    				outputString = "Name: " + tempFile.name + "\n";
    				outputString += "Type: " + tempFile.type + "\n";
    				outputString += "Size: " + tempFile.size + "\n";
    				outputString += "Last modified date: " + tempFile.lastModifiedDate + "\n";

	    			// alert(outputString)
	    			streams.push(client.send(tempFile,{
	    				'name': tempFile.name,
	    				'type': tempFile.type,
	    				'size': tempFile.size,
	    				'lastModified': tempFile.lastModifiedDate
	    			}));

	    			tx = 0;
	    			streams[i].on('data', function(data){
	    				tx += data.rx * 100;
	    				$('#progress').text(Math.round(tx) + '% complete');
	    			});


    			}



    		}).on('dragenter',function(e){
    			// e.preventDefault();
    			if(e.preventDefault){
    				e.preventDefault();
    			}

    			// e.dataTransfer.dropEffect = 'move';

    			$(this).addClass("dragEnter");

    			// return false;
    		}).on('dragleave',function(e){

    			e.preventDefault();
    			$(this).removeClass("dragOver");

    		}).on('dragstart',function(e){
    			this.style.opacity = '0.4';  // this / e.target is the source node.
    		});



      		// $('#content').bind('drop', function(e){
      		// $('body').bind('drop',function(e){
      		// 	alert("Shithead!!!");

	       //  	e.originalEvent.preventDefault();
	       //  	var file = e.originalEvent.dataTransfer.files[0];

		      //   // Add to list of uploaded files
		      //   $('<div align="center"></div>').append($('<a></a>').text(file.name).prop('href', '/'+file.name)).appendTo('#content');

		      //   // $('#content').append();

		      //   // `client.send` is a helper function that creates a stream with the
		      //   // given metadata, and then chunks up and streams the data.
		      //   var stream = client.send(file,{
		      //   	name: file.name,
		      //   	size: file.size
		      //   });

		      //   // Print progress
		      //   var tx = 0;

		      //   stream.on('data', function(data){
		      //     	$('#progress').text(Math.round(tx+=data.rx*100) + '% complete');
		      //   });
      		// });
    	});

	},
	resize:function(){
		Win.init();
	}
}

Main.init();


