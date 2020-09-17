var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
const { exit } = require('process');


/* GET file from server JSON. */
router.get('/:fileName', function (req, res, next) {

    var filePath = path.join('../api/markdownFiles/', req.params.fileName);
    try {
        if (fs.existsSync(filePath)) {
            //enviar conteudo

            fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
                if (!err) {

                    var obj = convertFileToJSON(data);
                    res.json(obj);
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


function convertFileToJSON(data) {

    var location = data.substring(data.indexOf('# LogBook') + 13);
    location = location.substring(0, location.indexOf(':'));

    var objectives = data.substring(data.indexOf('### Objectives') + 15);
    objectives = objectives.substring(0, objectives.indexOf('### Team') - 1);

    var team = data.substring(data.indexOf('### Team') + 9);
    team = team.substring(0, team.indexOf('### Emergency Procedures / Contacts') - 1);

    var teamObj = [];
    //var members = team.substring(0,team.length-1);
    var members = team.split(', ');
    members.forEach((member, index) => {

        if (member === '') { }
        else if (index === members.length - 1 && member !== '') {
            //console.log('- ' + member.substring(0,member.length-1));
            teamObj.push(member.substring(0, member.length - 1));
        }
        else {
            //console.log('- ' + member);
            teamObj.push(member)
        }
    })

    var emergencyContacts = data.substring(data.indexOf('### Emergency Procedures / Contacts') + 36);
    emergencyContacts = emergencyContacts.substring(0, emergencyContacts.indexOf('### Weather') - 1);

    var weather = data.substring(data.indexOf('### Weather') + 16);
    weather = weather.substring(0, weather.indexOf('### Systems') - 3);

    var vehiclesObj = [];
    var vehicles = data.substring(data.indexOf('### Systems') + 12);
    vehicles = vehicles.substring(0, vehicles.indexOf('### Other Equipment') - 1);
    //ignore headers
    vehicles = vehicles.substring(vehicles.indexOf('\n') + 1);
    vehicles = vehicles.substring(vehicles.indexOf('\n') + 1);

    var vehiclesList = vehicles.split('\n');
    vehiclesList.forEach(vehicle => {

        var vehicleProps = vehicle.substring(1, vehicle.length - 1).split('|');

        var vehicle = { name: vehicleProps[0], phone_no: vehicleProps[1], gsm_credit: vehicleProps[2], emergency_pinger: vehicleProps[3] };
        vehiclesObj.push(vehicle);

    })

    var equipment = data.substring(data.indexOf('### Other Equipment') + 20);
    equipment = equipment.substring(0, equipment.indexOf('### Mission LogBook') - 1);

    var equipmentObj = [];
    var equipmentList = equipment.split('\n');
    equipmentList.forEach(item => {
        equipmentObj.push(item.substring(2));
    })


    var logsObj = [];
    var logs = data.substring(data.indexOf('### Mission LogBook') + 20);
    logs = logs.substring(0, logs.indexOf('### Action Items') - 1);
    //ignore headers
    logs = logs.substring(logs.indexOf('\n') + 1);
    logs = logs.substring(logs.indexOf('\n') + 1);;

    var logsList = logs.split('\n');
    logsList.forEach(log => {
        if (log !== '') {
            var logProps = log.substring(1, log.length - 1).split('|');

            var log = { time: logProps[0], description: logProps[1] };
            logsObj.push(log);
        }
    })

    var actions = data.substring(data.indexOf('### Action Items') + 17);
    actions = actions.substring(0, actions.indexOf('### Final Remarks') - 1);

    var actionsObj = [];
    var actionList = actions.split('\n');
    actionList.forEach(item => {
        actionsObj.push(item.substring(3));
    });


    var finalRemarks = data.substring(data.indexOf('### Final Remarks') + 18);
    finalRemarks = finalRemarks.substring(0, data.length - 1);

    var obj = new Object();
    obj.location = location;
    obj.objectives = objectives;
    obj.team = teamObj;
    obj.emergencyContacts = emergencyContacts;
    obj.weather = weather;
    obj.vehicles = vehiclesObj;
    obj.equipment = equipmentObj;
    obj.missionLogs = logsObj;
    obj.actions = actionsObj;
    obj.finalRemarks = finalRemarks;

    return obj;
}


module.exports = router;