var gplay = require('google-play-scraper');
    Promise = require('bluebird');
    _ = require('lodash');

const fs = require('fs'); 
const lineReader = require('line-reader');
const array2csv = require('./array2csv')
const apps = [];
let reviews = [];
var eachLine = Promise.promisify(lineReader.eachLine);

eachLine('data.txt', function(line) {
    apps.push(`${line}`);
  }).then(function() {
      
    const pro = apps.map(app => 
        gplay.reviews({
            appId: app,
            sort: gplay.sort.RATING
          })
          .then((data) => {
            const review = data.map(dt => {
                return {
                    appId: app,
                    userName: dt.userName,
                    score: dt.score
                }
            })
            reviews.push(review)
          })
        .then(() => reviews = _.flatten(reviews))
    )
    Promise.all(pro).then(() => {
        const csv = array2csv({ data: reviews })
        // console.log(csv);
        fs.writeFile("./data.csv", csv, function(err) {

            if(err) {
                return console.log(err);
            }
        
            console.log("The file was saved!");
        }); 
    })

  })
  .catch(function(err) {
    console.error(err);
  });