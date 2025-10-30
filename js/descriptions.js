var written_tweet = []

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	document.getElementById('searchCount').innerText = 0;
	document.getElementById('searchText').innerText = '';

	//TODO: Filter to just the written tweets
	written_tweet = tweet_array.filter(t => t.written == true);
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	var input_text = document.getElementById("textFilter");
	input_text.addEventListener('input', (event) => {
		var input = event.target.value;
		var search_result = searchText(written_tweet,input);
		var table_html = "";
		// extract html from each element
		search_result.forEach((element,index) => {
			table_html += element.getHTMLTableRow(index + 1);
		});
		// display
		document.getElementById('searchCount').innerText = search_result.length;
		document.getElementById('searchText').innerText = input;
		document.getElementById('tweetTable').innerHTML = table_html;
	});
}

function searchText(tweet_array, input) {
	console.log(tweet_array[0]);
	if (!input) return tweet_array.slice();
	var result_array = tweet_array.filter(function(t) {
		if (t.text.includes(input)){
			return t;
		}
	});
	return result_array;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	// addEventHandlerForSearch();
	// loadSavedRunkeeperTweets().then(parseTweets);
	loadSavedRunkeeperTweets().then( data => {
		parseTweets(data);
		addEventHandlerForSearch();
	});
});