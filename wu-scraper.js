const puppeteer = require('puppeteer');
const moment = require('moment');
const fs = require('fs');

var fromDate = moment('2017-11-01');
var toDate = moment('2017-11-30');

(async () => {
  	const browser = await puppeteer.launch();
  	const page = await browser.newPage();
  	
	for (var m = fromDate; m.diff(toDate, 'days') <= 0; m.add(1, 'days')) {

		console.log('Downloading dataset for: ' + m.format('YYYY-MM-DD'));

  		await page.goto('https://www.wunderground.com/history/airport/EKCH/' + m.format('YYYY/MM/DD') + '/DailyHistory.html');
  	
		let table_html = await page.evaluate(() => {
		    let element = document.getElementById('observations_details');
		    return element.outerHTML;
		});

		fs.writeFile(m.format('YYYYMMDD') + '.html', table_html, function(err) {
		    if(err) {
		        return console.log(err);
		    }
		}); 

	}

	for (var m = fromDate; m.diff(toDate, 'days') <= 0; m.add(1, 'month')) {

		console.log('Downloading dataset for: ' + m.format('YYYY-MM'));

  		await page.goto('https://www.wunderground.com/history/airport/EKCH/' + m.format('YYYY/MM') + '/01/MonthlyHistory.html');
  	
		let table_html = await page.evaluate(() => {
		    let element = document.getElementById('obsTable');
		    return element.outerHTML;
		});

		fs.writeFile(m.format('YYYYMM') + '.html', table_html, function(err) {
		    if(err) {
		        return console.log(err);
		    }
		}); 

	}

  	await browser.close();
})();
