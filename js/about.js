function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	var total_count = tweet_array.length;
	document.getElementById('numberTweets').innerText = total_count;	

	// extract time
	var times = tweet_array.map(t => t.time);
	var first_date = new Date(Math.min(...times));
	var last_date = new Date(Math.max(...times));
	document.getElementById('firstDate').innerText = first_date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
	document.getElementById('lastDate').innerText = last_date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
	
	// categories
	var completed = tweet_array.filter(tweet => tweet.source == "completed_event");
	var completed_count = completed.length;
	var live_count = tweet_array.filter(tweet => tweet.source == "live_event").length;
	var achievement_count = tweet_array.filter(tweet => tweet.source == "achievement").length;
	var miscellaneous_count = tweet_array.filter(tweet => tweet.source == "miscellaneous").length;

	document.getElementsByClassName('completedEvents')[0].innerText = completed_count;
	document.getElementsByClassName('completedEventsPct')[0].innerText = `${(completed_count / total_count * 100).toFixed(2)}%`;
	document.getElementsByClassName('completedEvents')[1].innerText = completed_count;
	document.getElementsByClassName('liveEvents')[0].innerText = live_count;
	document.getElementsByClassName('liveEventsPct')[0].innerText = `${(completed_count / total_count * 100).toFixed(2)}%`;
	document.getElementsByClassName('achievements')[0].innerText = achievement_count;
	document.getElementsByClassName('achievementsPct')[0].innerText = `${(completed_count / total_count * 100).toFixed(2)}%`;
	document.getElementsByClassName('miscellaneous')[0].innerText = miscellaneous_count;
	document.getElementsByClassName('miscellaneousPct')[0].innerText = `${(completed_count / total_count * 100).toFixed(2)}%`;

	for (i = 0; i < 50; ++i) {
		console.log(tweet_array[i].text);
	}
	var written_count = completed.filter(t => t.written == true).length;
	document.getElementsByClassName('written')[0].innerText = written_count;
	document.getElementsByClassName('writtenPct')[0].innerText = `${(written_count / completed_count * 100).toFixed(2)}%`
	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});