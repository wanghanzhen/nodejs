var http = require('http');
var cheerio = require('cheerio');
var url = 'http://www.imooc.com/learn/348';

function filterChapters(html) {
	var $ = cheerio.load(html);
	var chapters = $('.chapter');

	// [{
	// 	chapterTitle:'',
	// 	videos:[
	// 	title:'',
	// 	id:''
	// 	]
	// }]
	var courseData = [];
	var chapter, chapterTitle, chapterData;
	var video, videoTitle, videoId
	chapters.each(function(item) {
		chapter = $(this);
		chapterTitle = chapter.find('strong').contents().filter(function(index) {
			return this.nodeType === 3;
		}).text().trim();
		videos = chapter.find('.video').children('li');
		chapterData = {
			chapterTitle: chapterTitle,
			videos: []
		}
		videos.each(function(index, el) {
			video = $(this).find('.J-media-item');
			videoTitle = video.contents().filter(function(index) {
				return this.nodeType === 3;
			}).text().trim().split('\n');
			// nodes = video[0].childNodes;
			// for (var i = 0; i < nodes.length - 1; i++) {
			// 	if (nodes[i].nodeType == 3) {
			// 		videoTitle = nodes[i].nodeValue.trim();
			// 	}
			// }
			videoId = video.attr('href').split('video/')[1];
			chapterData.videos.push({
				title: videoTitle[0].trim(),
				time: videoTitle[1].trim(),
				id: videoId
			})
		})
		courseData.push(chapterData);
	})
	
	return courseData;
}

function printData(courseData) {
	var html = '';
	courseData.forEach(function(item) {
		html += item.chapterTitle + '\n\n';
		item.videos.forEach(function(video) {
			html += '[' + video.id + ']  ' + video.title + '  ' + video.time + '\n';
		})
		html += '\n'
	})
	console.log(html);
}
http.get(url, function(res) {
	var html = '';
	res.on('data', function(data) {
		html += data;
	});
	res.on('end', function() {
		var courseData = filterChapters(html);
		printData(courseData);
	});

}).on('error', function() {
	console.log("获取课程数据错误");
})