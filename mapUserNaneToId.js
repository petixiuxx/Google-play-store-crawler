const _ = require("lodash")

function checkExist(arr, userName) {
    var found = false;
    for(var i = 0; i < arr.length; i++) {
        if (arr[i].userName === userName) {
            found = true;
            break;
        }
    }
    return found;
}

function checkExistApp(arr, name) {
    var found = false;
    for(var i = 0; i < arr.length; i++) {
        if (arr[i].name === name) {
            found = true;
            break;
        }
    }
    return found;
}

function mapUserNameToId (arr) {
    const userNameArr = arr.map(a => a.userName)
    // console.log(userNameArr);
    const ids = [];
    let id = -1;
    userNameArr.forEach(name => {
        if (!checkExist(ids, name)) {
            id++;
            ids.push({ id, userName: name })
        }
    });
    return arr.map(a => {
        let user_id;
        ids.forEach(o => {
            if (o.userName === a.userName) {
                user_id = o.id
            }
        })
        return {
            ...a,
            user_id
        }
    })
}

function mapAppNameToId (arr) {
    const userNameArr = arr.filter(a => a.name.length !== 0).map(a => a.name)
    // console.log(userNameArr);
    const ids = [];
    let id = -1;
    userNameArr.forEach(name => {
        if (!checkExistApp(ids, name)) {
            id++;
            ids.push({ id, userName: name })
        }
    });
    return arr.map(a => {
        let app_id;
        ids.forEach(o => {
            if (o.userName === a.name) {
                app_id = o.id
            }
        })
        return {
            ...a,
            app_id
        }
    })
}
module.exports = { mapAppNameToId, mapUserNameToId }