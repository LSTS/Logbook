var express = require('express')
var router = express.Router()
var fs = require('fs')
var path = require('path')

const { GoogleSpreadsheet } = require('google-spreadsheet')

var creds;
try {
    creds = require('../resources/spreadsheet-credentials.json')
} catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
        throw e;
    }
}

router.get('/:fileName', function (req, res, next) {

    var filePath = path.join('../api/markdownFiles/', req.params.fileName);
    try {
        if (fs.existsSync(filePath)) {

            fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
                if (!err) {

                    var obj = convertFileActionsToJSON(data);
                    var date = req.params.fileName.substring(req.params.fileName.indexOf('debriefing_') + 11, req.params.fileName.indexOf('.'))

                    if (obj.actions.length === 1 && obj.actions[0].length === 0) {
                        res.json('Empty actions')
                        return;
                    }

                    try {
                        accessSpreadsheet(obj, date)
                            .then(response => {
                                if (response === 'success') {
                                    res.json('Spreadsheet updated')
                                }
                                else {
                                    res.json('Cannot update spreadsheet')
                                }
                            });

                    } catch (error) {
                        console.log(error)
                        res.json('Cannot update spreadsheet')
                    }

                }
                else if (err.code === 'ENOENT') {
                    console.log('Cannot read file - ' + req.params.fileName);
                    res.json('Cannot read file');
                }
                else {
                    console.log(err);
                }
            });
        }
        else {
            console.log("Cannot find file - " + req.params.fileName);
            res.json("Cannot find file");
        }
    }
    catch (err) {
        console.log(err);
    }
});


async function accessSpreadsheet(obj, date) {

    const months = ["Jan", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dec"];
    let date_aux = new Date(date)
    let formatted_date = date_aux.getDate() + '-' + months[date_aux.getMonth()] + '-' + date_aux.getFullYear()

    try {
        const doc = new GoogleSpreadsheet('1pJcpD2oeZyYp5XCpcjXs6qv4Jfk7QwWFxEYgxaDUfbo');
        await doc.useServiceAccountAuth(creds);
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0]
        const rows = await sheet.getRows()

        var id = rows.length + 1
/*
        for (const action of obj.actions) {
            if (action.length > 0) {
                await sheet.addRow([id, action, '', formatted_date, '', '', '', ''])
                id++
            }
        }
*/

        return 'success'

    } catch (error) {
        console.log(error)
        return 'error'
    }
}


function convertFileActionsToJSON(data) {

    var location = data.substring(data.indexOf('# LogBook') + 13);
    location = location.substring(0, location.indexOf(':'));

    var actions = data.substring(data.indexOf('### Action Items') + 17);
    actions = actions.substring(0, actions.indexOf('### Final Remarks') - 1);

    var actionsObj = [];
    var actionList = actions.split('\n');
    actionList.forEach(item => {
        actionsObj.push(item.substring(3));
    });

    var obj = new Object();
    obj.location = location;
    obj.actions = actionsObj;

    return obj;
}

module.exports = router;