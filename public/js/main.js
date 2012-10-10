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

        window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

/*

		var client = new BinaryClient('ws://localhost:3000');

		var streams = [];
    	var tempProgress = [];

    	client.on('open',function(){

    		$('#dropZone').on('drop',function(e){
    			e.originalEvent.preventDefault();

    			var evt = e.originalEvent;

    			var files = evt.dataTransfer.files;

    			var tempFile;
    			var outputString;
    			var i=0;

    			//var tx = [];

    			var children; //$('#fileRows').children().length;

    			for(i; i<files.length; i++){
    				tempFile = files[i];

    				children = $('#fileRows').children().length;

    				outputString = '<div class="fileListing"><div>File: ' + tempFile.name + '</div><div>File Progress:&nbsp;<span id="fileProgress' + children + '">0</span>% complete</div></div>';

    				$('#fileRows').append(outputString); 

	    			streams.push(client.send(tempFile,{
	    				'name': tempFile.name,
	    				'type': tempFile.type,
	    				'size': tempFile.size,
	    				'uniqueID': children,
	    				'lastModified': tempFile.lastModifiedDate
	    			}));

	    			tempProgress.push(0);

	    			// tempProgress = $('#fileProgress'+children).text(); 
	    			//alert(children);

	    			streams[children].on('data', function(data){
	    				tempProgress[data.uniqueID] += data.rx * 100;
	    				// alert(data.uniqueID);
	    				$('#fileProgress'+data.uniqueID).text(Math.round(tempProgress[data.uniqueID]));
	    			});

    			}

    		})

            $('#dropZone').on('dragenter',function(e){
    			if(e.preventDefault){
    				e.preventDefault();
    			}

    			$(this).addClass("dragEnter");
    		})

            $('#dropZone').on('dragleave',function(e){

    			e.preventDefault();
    			$(this).removeClass("dragOver");

    		})

            $('#dropZone').on('dragstart',function(e){
                this.style.opacity = '0.4';
    		});

    	});

*/

	},
	resize:function(){
		Win.init();
	}
}

Main.init();


