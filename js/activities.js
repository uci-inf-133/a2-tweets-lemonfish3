function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	function Activity(name, number) {
        this.name = name;
        this.number = number;
    }

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	var completed_array = tweet_array.filter(t => t.source == "completed_event");
	var activities = new Set(completed_array.map(t => t.activityType));
	activities = Array.from(activities);
	// console.log(activities);

	// graph 1
	var activity_pair = activities.map(function(activity) {
		var count = completed_array.filter(t => t.activityType == activity).length;
		return new Activity(activity, count);
	});
	activity_pair = activity_pair.sort((a, b) => a.number > b.number);
	document.getElementById('numberActivities').innerText = activity_pair.length;
	document.getElementById('firstMost').innerText = activity_pair[0].name;
	document.getElementById('secondMost').innerText = activity_pair[1].name;
	document.getElementById('thirdMost').innerText = activity_pair[2].name;

	const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	function FindDate(num) {
		switch(num){
			case 0:
				return 'Sun';
			case 1:
				return 'Mon';
			case 2:
				return 'Tue';
			case 3:
				return 'Wed';
			case 4:
				return 'Thu';
			case 5:
				return 'Fri';
			case 6:
				return 'Sat';
		}

	}

	function ActivityData(type, date, dist) {
		this.type = type;
		this.date = FindDate(date);
		this.dist = dist;
	}

	// graph 2
	// filter the first three activities and their data 
	var activities_data = [];
	var first_three = [activity_pair[0].name, activity_pair[1].name, activity_pair[2].name];
	completed_array.forEach(element => {
		if (first_three.includes(element.activityType)){
			var activity = new ActivityData(element.activityType, element.time.getDay(), element.distance);
			activities_data.push(activity);
		}
	});
	// activities_data = activities_data.filter(i =>
	// 	i.dist !== undefined && i.dist !== null && i.dist !== Infinity
	// );

	function ActivityMean(type, date, mean) {
		this.type = type;
		this.date = date;
		this.mean = mean;
	}

	var first_activity_mean = week.map(function(d){
		var activity_list = activities_data.filter(i => i.date == d && i.type == first_three[0]).map(i => i.dist); 
		var mean_dist = activity_list.reduce((acc, val) => acc + val, 0) / activity_list.length;
		return new ActivityMean(first_three[0], d, mean_dist);
	});

	var second_activity_mean = week.map(function(d){
		var activity_list = activities_data.filter(i => i.date === d && i.type === first_three[1]).map(i => i.dist); 
		var mean_dist = activity_list.reduce((acc, val) => acc + val, 0) / activity_list.length;
		return new ActivityMean(first_three[1], d, mean_dist);
	});

	var third_activity_mean = week.map(function(d){
		var activity_list = activities_data.filter(i => i.date === d && i.type === first_three[2]).map(i => i.dist); 
		var mean_dist = activity_list.reduce((acc, val) => acc + val, 0) / activity_list.length;
		return new ActivityMean(first_three[2], d, mean_dist);
	});


	// graph 3
	var activities_mean = [...first_activity_mean, ...second_activity_mean, ...third_activity_mean];
	
	// text field
	var avg_activity = {};
	activities_mean.forEach(i => {
		if (!avg_activity[i.type]) {
			avg_activity[i.type] = [];
		}
		avg_activity[i.type].push(i.mean);
	})
	var sorted_activity = Object.entries(avg_activity).sort((a,b) => b[1]-a[1]);
	document.getElementById("longestActivityType").innerText = sorted_activity[0][0];
	document.getElementById("shortestActivityType").innerText = sorted_activity.at(-1)[0];
	document.getElementById("weekdayOrWeekendLonger").innerText = "weekends"; 
		//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "width": 600,
	  "height": 400,	 
	  "data": {
	    "values": activity_pair
	  },
	  "mark": "bar",
	  //TODO: Add mark and encoding
	  "encoding": {
		"x": {
		"field": "name",
		"type": "nominal",
		"title": "Activity Type"},
		"y": {
		"field": "number",
		"type": "quantitative",
		"title": "Number of Tweets"}
    	}
	};
	

	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the distance of activity on each day for the the three most tweeted-about activities",
	  "width": 600,
	  "height": 400,	
	  "data": {
	    "values": activities_data
	  },
	  "mark": "point",
	  //TODO: Add mark and encoding
	  "encoding": {
			"x": {
				"field": "date",
				"type": "nominal",
				"title": "Day of the Week",
				"sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]},
			"y": {
				"field": "dist",
				"type": "quantitative",
				"title": "Distance"},
			"color": {
				"field": "type",
				"type": "nominal",
				"title": "Activity Type"},
			"tooltip": [
				{"field": "type", "title": "Activity"},
				{"field": "date", "title": "Day"},
				{"field": "dist", "title": "Distance"}
			]
		}
    };

	dmean_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the mean distance of activity on each day for the the three most tweeted-about activities",
	  "width": 600,
	  "height": 400,	
	  "data": {
	    "values": activities_mean
	  },
	  "mark": "point",
	  //TODO: Add mark and encoding
	  "encoding": {
			"x": {
				"field": "date",
				"type": "nominal",
				"title": "Day of the Week",
				"sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]},
			"y": {
				"field": "mean",
				"type": "quantitative",
				"title": "Mean of Distance"},
			"color": {
				"field": "type",
				"type": "nominal",
				"title": "Activity Type"},
			"tooltip": [
				{"field": "type", "title": "Activity"},
				{"field": "date", "title": "Day"},
				{"field": "mean", "title": "Distance"}
			]
		}
    };

	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
	vegaEmbed('#distanceVisAggregated', dmean_vis_spec, {actions:false});

	// add event listener to button
	document.getElementById("distanceVisAggregated").style.display = "none";
	
	document.getElementById("aggregate").addEventListener("click", () => {
	const rawVis = document.getElementById("distanceVis");
	const meanVis = document.getElementById("distanceVisAggregated");

	if (rawVis.style.display !== "none") {
		rawVis.style.display = "none";
		meanVis.style.display = "block";
		document.getElementById("aggregate").innerText = "Show all activities";
	} else {
		rawVis.style.display = "block";
		meanVis.style.display = "none";
		document.getElementById("aggregate").innerText = "Show means";
	}
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
