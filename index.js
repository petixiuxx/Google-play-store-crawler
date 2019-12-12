var gplay = require('google-play-scraper');
    Promise = require('bluebird');
    _ = require('lodash');

const fs = require('fs'); 
const lineReader = require('line-reader');
const array2csv = require('./array2csv')
const { mapAppNameToId, mapUserNameToId } = require('./mapUserNaneToId')
const apps = [];
let reviews = [];
var eachLine = Promise.promisify(lineReader.eachLine);

eachLine('data.txt', function(line) {
    apps.push(`${line}`);
  }).then(function() {
    const appInfo = apps.map(async app => {
      let info = {}
      try {
        info = await gplay.app({ appId: app })
        info = {
          id: info.appId,
          name: info.title,
          exist: true
        }
      } catch (error) {
        info = {
          id: app,
          name: "",
          exist: false
        }
      }
      return info
    })
    Promise.all(appInfo).then(appExist => {
          const appWithId = mapAppNameToId(appExist)
          // console.log(appWithId)
          const pro = appWithId.map(async app => {
            if (app.exist) {
                return gplay.reviews({
                  appId: app.id,
                  sort: gplay.sort.RATING
                })
                .then((data) => {
                  const review = data.map(dt => {
                      return {
                          appId: app.app_id,
                          appName: app.name,
                          userName: dt.userName,
                          score: dt.score
                      }
                  })
                  reviews.push(review)
                })
              .then(() => {
                reviews = _.flatten(reviews)
                reviews = mapUserNameToId(reviews)
              })
            }
        }
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

  })
  .catch(function(err) {
    console.error(err);
  });