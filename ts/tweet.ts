class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        var text = this.text;
        if (text.startsWith("Just completed")) {
            return "completed_event";
        }
        else if (text.startsWith("Watch my run")) {
            return "live_event";
        }
        else if (text.startsWith("Achieved")) {
            return "achievement";
        }
        else if (text.startsWith("Just posted")) {
            return "miscellaneous";
        }
        else {
            return "unknown";
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        return this.text.includes('-');
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        var split_text = this.text.split('-')[1];
        var written_text = split_text.split('https')[0].trim();
        return written_text;
    }
    // only applies for completed tweets
    get activityType():string {
        if (this.source != 'completed_event'){
            return 'unknown';
        }
        if (this.written){
            var split_activity = this.text.split(' -')[0].split(' ');
            var activity = split_activity[split_activity.length - 1];
            return activity;
        }
        var split_activity = this.text.split('with')[0].split(' ');
        var activity = split_activity[split_activity.length - 2];
        return activity;
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        var dist = this.text.split('a ')[1].split(' ');
        if (dist[1] == 'km'){
            var distance = (parseFloat(dist[0]) / 1.609).toFixed(2);
            return Number(distance);
        }
        var distance = dist[0];
        return Number(distance);;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        var split_text = this.text.split(' ');
        var html = split_text.find(function(w){
            return w.startsWith('http');
        });
        var front = this.text.split('https')[0];
        var text = `${front}<a href="${html}">${html}</a> #Runkeeper`;
        // console.log(html);
        var row = `<tr>
        <td>${rowNumber}</td>
        <td>${this.activityType}</td>
        <td>${text}</td>
        </tr>`
        return row ;
    }
}