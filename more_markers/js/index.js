	var waypts_20=[];//to call each 20 for built drection
	var markers = [];// first map markers
	var markers_1=[];//second map markers
	var marker_data;//TO STORE ajax response
	var entries_1=[];//store all markers data
	var true_entries=[];//store true marker values 
	var false_entries=[];// store false marker value
		var direction_services_array=[];
		 var accounts = [];
	var direction=0;
	var newVariable = 0;//dynamic variable;
	var newVariable_1=0;
	
	var greater_value=40;
	var lesser_value=20;
	
	var create_way_value=0; 
	var bounds = new google.maps.LatLngBounds();
	var map = new google.maps.Map(document.getElementById("map"), {
		zoom: 10,
		center: new google.maps.LatLng(20.5937, 78.9629),
		mapTypeId: google.maps.MapTypeId.DRIVING,
		mapTypeControl: false,
		streetViewControl: false
	});
	
	var styles =[{	featureType: "water",
					elementType: "all",
					stylers: [{color: "#c9c9c9"}]},
				{	featureType: "poi.park",
					elementType: "all",
					stylers: [{color: "#ededed"}]
				}]
	map.setOptions({styles: styles});
	
	var icon_f = {
		url: "img/false.png",
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(10,10)
	};
	var icon_t = {
		url: "img/true.png",
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(15,15)
	};
			
	function unSuccessMarker(latlng, map, imageSrc) {
		this.latlng_ = latlng;
		this.imageSrc = imageSrc;
		this.setMap(map);
	}
	unSuccessMarker.prototype = new google.maps.OverlayView();

	unSuccessMarker.prototype.draw = function () {
		var div = this.div_;
		if (!div) {
			div = this.div_ = document.createElement('div');
			div.className = "tasks";
			var img = document.createElement("img");
			img.src = this.imageSrc;
			div.appendChild(img);
			$('#Markers').on('click',function(){
				$(div).toggle();
			});
			var panes = this.getPanes();
			panes.overlayImage.appendChild(div);	
		}
		// Position the overlay 
		var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
		if (point) {
			div.style.left = point.x + 'px';
			div.style.top = point.y + 'px';	
		}
	};
	
	unSuccessMarker.prototype.getPosition = function () {
		return this.latlng_;
	};

	$(document).ready(function(){
		
	});
	window.onload = function() {	
				$('#map_canvas_2').hide();		
				$('#Route').on('click',function(){
					$('#map_canvas_2').hide();
					$('#map').show();
				});
				$('#Markers').on('click',function(){
					$('#map').hide();
					$('#map_canvas_2').show();
				});
	}
	function get_user_data()
	{	
		deleteMarkers();

		for(var j=0;j<direction_services_array.length;j++)
		{
			var delete_route=direction_services_array[j].dirren;
			delete_route.setMap(null);
		}
		//directionDisplay.setMap(null);
		$('.tasks').html('');
		$('.tasks').removeClass('tasks');
		
		//delate all prev data on maps//
		//after the above code the ajax call have to be load//
		waypts_20=[];//to call each 20 for built drection
		markers = [];// first map markers
		markers_1=[];//second map markers
		marker_data='';//TO STORE ajax response
		entries_1=[];//store all markers data
		true_entries=[];//store true marker values 
		false_entries=[];// store false marker value
		newVariable = 0;//dynamic variable;
		newVariable_1=0;
		
		greater_value=40;//
		lesser_value=20;
		
		$.ajax({
			type:'GET',
			url: "http://localhost/more_markers/marker_file.txt",
			dataType: "text",
			success: function(response) {
					waypts_20=[];//to call each 20 for built drection
					markers = [];// first map markers
					markers_1=[];//second map markers
					marker_data;//TO STORE ajax response
					entries_1=[];//store all markers data
					true_entries=[];//store true marker values 
					false_entries=[];// store false marker value
				marker_data=response;
				processData(marker_data);
			
			}
		});	
		console.log(markers+" "+markers_1+" "+marker_data+" "+true_entries+" "+false_entries+""+entries_1);
	}
	//start clear map
	function setMapOnAll(map) {
		if(markers.length>=1)
		{
			for (var i = 0; i < markers.length; i++) {
				markers[i].setMap(map);
			}
		}	
    }
	function setMapOnAll_1(map_1) {
		if(markers_1.length>=1)
		{
			for (var i = 0; i < markers_1.length; i++) {
				markers_1[i].setMap(map_1);
			}
		}	
    }
	function clearMarkers() {
        setMapOnAll(null);
		setMapOnAll_1(null);
    }
     // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
        clearMarkers();
        markers = [];
		markers_1=[];
    }
	//end clear map
	function processData(allText) 
	{
		var record_num = 3;
		var allTextLines = allText.split(/\n/);
		
		for(var k=0;k<allTextLines.length;k++)
		{
			var split;
			split=allTextLines[k].split(',');
			var latt=split[0];
			var lann=split[1];
			var mat=split[2];
			var latt_1
			latt_1 = latt.split(" ");
			var final_latt= latt_1[1];
			var lann_1
			lann_1 = lann.split(" ");
			var final_lann= lann_1[1];
			var mat_1
			mat_1=mat.split(" ");
			var final_mat=mat_1[1];
			entries_1.push({lat:final_latt,lan:final_lann,boolean_val:final_mat});
		}
		
		for(var i=0;i<entries_1.length;i++)
		{
			if(entries_1[i].boolean_val=='True')
			{
				true_entries.push({lat:entries_1[i].lat,lan:entries_1[i].lan});
			}
			if(entries_1[i].boolean_val=='False')
			{
				false_entries.push({lat:entries_1[i].lat,lan:entries_1[i].lan});
			}
		}
		calculateAndDisplayRoute();
		only_markers();	
	}
	
	function calculateAndDisplayRoute()
	{
		var waypts = [];
		for (var i = 0; i < true_entries.length; i++) {
			waypts.push({
				location: new google.maps.LatLng(true_entries[i].lat,true_entries[i].lan),
				stopover: true
			});
		}
			
		var gpsdata_length=true_entries.length-1;
		var twenty_default=20;
	
		if(true_entries.length>=2)
		{	
			console.log(waypts.length/20);
			var divis=waypts.length/20;
			//var split=divis.split('.');
			divis++;
			for(var i=0;i<=divis;i++)
			{		
				var DirectionsRenderer=newVariable++;
				
				var new_var=DirectionsRenderer+"dirrender";
				new_var=new google.maps.DirectionsRenderer({ suppressMarkers: true });
				
				var directionServices1=newVariable_1+"services";
				directionServices1=new google.maps.DirectionsService();
				direction_services_array.push({dis:directionServices1,dirren:new_var});
			}
			for(i=0;i<waypts.length;i++)
			{	
				if(i<=20)
				{
					waypts_20.push({
						location: new google.maps.LatLng(true_entries[i].lat,true_entries[i].lan),
						stopover: true
					});
					if((i==20)||(i==gpsdata_length))
					{	
						create_way(direction_services_array[create_way_value].dis,direction_services_array[create_way_value].dirren,true_entries[0].lat,true_entries[0].lan,true_entries[i].lat,true_entries[i].lan,waypts_20);
					}	
				}
				if((i<=greater_value)&&(i>lesser_value))
				{
					waypts_20.push({
						location: new google.maps.LatLng(true_entries[i].lat,true_entries[i].lan),
						stopover: true
					});
					if((i==greater_value)||(i==gpsdata_length))
					{	
						create_way_value++
						create_way(direction_services_array[create_way_value].dis,direction_services_array[create_way_value].dirren,true_entries[lesser_value].lat,true_entries[lesser_value].lan,true_entries[i].lat,true_entries[i].lan,waypts_20);
						greater_value=greater_value+20;
						lesser_value=lesser_value+20;
					}	
				}
			}				
		}
		
		for(var i = 0; i < true_entries.length; i++ ) {
			var position = new google.maps.LatLng(true_entries[i].lat, true_entries[i].lan);
			bounds.extend(position);
			marker = new google.maps.Marker({
				position: position,
				map: map,
				icon:icon_t
			});	
			markers.push(marker);
		}
		for(var i = 0; i < false_entries.length; i++ ) {
			var position = new google.maps.LatLng(false_entries[i].lat, false_entries[i].lan);
			bounds.extend(position);
			marker = new google.maps.Marker({
				position: position,
				map: map,
				icon:icon_f
			});	
			markers.push(marker);
		}
		map.fitBounds(bounds);
	}
	function create_way(dir,disp,start_1,start_2,stop_1,stop_2)
	{
		//disp = new google.maps.DirectionsRenderer({ suppressMarkers: true });
		dir.route({
			origin:new google.maps.LatLng(start_1,start_2),//(lat, lng),//places_to_serve[0],
			destination:new google.maps.LatLng(stop_1,stop_2),
			waypoints: waypts_20,
			travelMode: 'DRIVING'
		}, function(response, status) {
			if (status === 'OK') {
				disp.setDirections(response);
				disp.setOptions({
					strokeColor: 'blue'
				});
				var route = response.routes[0];
			} else {
			}
		});
		disp.setMap(map);
		waypts_20=[];
	}

	var bounds_1 = new google.maps.LatLngBounds();	
	var map_1 = new google.maps.Map(document.getElementById('map_canvas_2'), {
			zoom:13,
			center: new google.maps.LatLng(20.5937, 78.9629),
			mapTypeId: google.maps.MapTypeId.DRIVING,
			mapTypeControl: false,
			streetViewControl: false
		});
	var styles_1 =[{	featureType: "water",
					elementType: "all",
					stylers: [{color: "#c9c9c9"}]},
				{	featureType: "poi.park",
					elementType: "all",
					stylers: [{color: "#ededed"}]
				}]
	map_1.setOptions({styles: styles_1});
	function only_markers()
	{	
		var infowindow = new google.maps.InfoWindow();
		var marker, i,j;
		for (i = 0; i < true_entries.length; i++) {  
			var position = new google.maps.LatLng(true_entries[i].lat, true_entries[i].lan);
			bounds_1.extend(position);
			marker = new google.maps.Marker({
			position: new google.maps.LatLng(true_entries[i].lat, true_entries[i].lan),
				map: map_1,
				icon:icon_t
			});
			markers_1.push(marker);
			google.maps.event.addListener(marker, 'click', (function(marker, i) {
				return function() {
					//infowindow.setContent('fa');
					infowindow.open(map_1, marker);
				}
			})(marker, i));
		}
		for (j = 0; j < false_entries.length; j++) 
		{  
			new unSuccessMarker(new google.maps.LatLng(false_entries[j].lat,false_entries[j].lan), map_1,  "img/false.png");
			/*var position = new google.maps.LatLng(false_entries[j].lat, false_entries[j].lan);
			bounds_1.extend(position);
			marker = new google.maps.Marker({
			position: new google.maps.LatLng(false_entries[j].lat, false_entries[j].lan),
				map: map_1,
				icon:icon_f
			});
			markers_1.push(marker);
			google.maps.event.addListener(marker, 'click', (function(marker, i) {
				return function() {
					//infowindow.setContent('fa');
					infowindow.open(map_1, marker);
				}
			})(marker, i));*/
		}
		map_1.fitBounds(bounds_1);
		
		google.maps.event.addListenerOnce(map_1, 'bounds_changed', function(event) {
			this.setZoom(map_1.getZoom()-1);
			console.log(this.getZoom());
			if (this.getZoom() <10) {
				this.setZoom(13);
			}
		});
	}	  
	  
	  