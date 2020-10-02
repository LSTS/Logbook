import React from 'react'
import CurrentDate from './CurrentDate';

import { presentTeamMembers, presentVehicleTable, presentEquipmentList, getCurrentTime, presentLogTable, presentActionList, getCurrentDate } from '../../lib/utils';

import Objectives from './Objectives';
import Team from './Team';
import EmergencyContacts from './EmergencyContacts';
import Vehicle from './Vehicles';
import Equipment from './Equipment';
import MissionLogbook from './MissionLogbook';
import ActionItems from './ActionItems';
import FinalRemarks from './FinalRemarks';
import Weather from './Weather';

import { Redirect } from 'react-router-dom';
import socketIOClient from 'socket.io-client';

import vehicleOptions from '../data/vehicles.json';
import locationOption from '../data/location.json';

import host from '../../../package.json';


const ENDPOINT = host.proxy;
const socket = socketIOClient(ENDPOINT);

export { socket };

interface IVehicle {
    name: string,
    phone_no: number | undefined,
    gsm_credit: string,
    emergency_pinger: string
}

interface IMissionLogs {
    time: string,
    description: string
}

interface Props {
    //location: any;
}


interface State {

    fileName: string;
    currentDate: string;
    firstRender: boolean;
    location: string;

    mdeValueObjectives?: any;
    teamSelected: string[];
    emergencyContacts?: any;
    vehicles: IVehicle[];
    equipment: string[];
    missionLogs: IMissionLogs[];
    actions: string[];
    mdeValueFinalRemarks?: any;
    redirect: boolean;
    weatherImage: string;
}


class CreateReport extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            fileName: '',

            currentDate: '',
            firstRender: true,

            location: '',

            teamSelected: [''],

            vehicles: [
                {
                    name: '',
                    phone_no: undefined,
                    gsm_credit: '',
                    emergency_pinger: '',
                }
            ],

            equipment: [''],

            missionLogs: [],

            actions: [''],

            redirect: false,

            weatherImage: ''
        }

        this.handleUpdateDate = this.handleUpdateDate.bind(this);
        this.handlePreviewDoc = this.handlePreviewDoc.bind(this);
        this.handleSaveDoc = this.handleSaveDoc.bind(this);
        this.handleDownloadFile = this.handleDownloadFile.bind(this);
        this.handleDownloadPdf = this.handleDownloadPdf.bind(this);
        this.handleSocketUpdate = this.handleSocketUpdate.bind(this);
        this.handleSockets = this.handleSockets.bind(this);

        this.handleChangeLocation = this.handleChangeLocation.bind(this);
        this.handleChangeObjectives = this.handleChangeObjectives.bind(this);
        this.handleChangeTeam = this.handleChangeTeam.bind(this);
        this.handleAddTeamMember = this.handleAddTeamMember.bind(this);
        this.handleDeleteTeamMember = this.handleDeleteTeamMember.bind(this);
        this.handleChangeEmergency = this.handleChangeEmergency.bind(this);
        this.handleWeatherFileChange = this.handleWeatherFileChange.bind(this);
        this.handleUpdateVehicle = this.handleUpdateVehicle.bind(this);
        this.handleAddVehicle = this.handleAddVehicle.bind(this);
        this.handleDeleteVehicle = this.handleDeleteVehicle.bind(this);
        this.handleUpdateEquipment = this.handleUpdateEquipment.bind(this);
        this.handleAddEquipment = this.handleAddEquipment.bind(this);
        this.handleDeleteEquipment = this.handleDeleteEquipment.bind(this);
        this.handleMissionLog = this.handleMissionLog.bind(this);
        this.handleUpdateMissionLog = this.handleUpdateMissionLog.bind(this);
        this.handleBlurMissionLog = this.handleBlurMissionLog.bind(this);
        this.handleDeleteMissionLog = this.handleDeleteMissionLog.bind(this);
        this.handleUpdateAction = this.handleUpdateAction.bind(this);
        this.handleAddAction = this.handleAddAction.bind(this);
        this.handleDeleteAction = this.handleDeleteAction.bind(this);
        this.handleChangeFinalRemarks = this.handleChangeFinalRemarks.bind(this);
    }

    componentDidMount() {
        this.reportExist();
        //setInterval(this.storeData,1000);
        this.handleSockets();
    }

    async reportExist() {
        let fileName;
        let fileDate;

        const fileToEdit = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        if (fileToEdit !== 'createReport' && fileToEdit.length > 0) {
            console.log("Load From file");
            fileName = fileToEdit;
            fileDate = fileToEdit.substring(fileToEdit.indexOf('debriefing_') + 11, fileToEdit.length - 3);

        }
        else {
            fileName = 'debriefing_' + getCurrentDate() + '.md';
            fileDate = getCurrentDate();
        }

        const response = await fetch('/editFile/' + fileName);
        const data = await response.json();

        if (data === 'Cannot find file') {
            //console.log('File not found');
            this.createFile(fileName);
        }
        else if (data === 'Cannot read file') {
            console.log('Cannot read file');
        }
        else {
            console.log('File already exist. Loading content.');
            alert('Report for the current day has already been created. \nLoading content.');

            this.setState({
                fileName: fileName,
                currentDate: fileDate,
                location: data.location,
                mdeValueObjectives: data.objectives,
                teamSelected: data.team,
                emergencyContacts: data.emergencyContacts,
                weatherImage: data.weather,
                vehicles: data.vehicles,
                equipment: data.equipment,
                missionLogs: data.missionLogs,
                actions: data.actions,
                mdeValueFinalRemarks: data.finalRemarks
            })
        }
    }



    handleSockets() {

        socket.on('connect', () => {
            console.log("Client connected");
        })

        /*
        socket.on('file.changed', function (data: any) {
            console.log('-- Filename --');
            console.log(data.fileName);
            console.log('-- Data --');
            console.log(data.data);

        });
        */

        socket.on('file.changed', (data: any) => {
            if (data.fileName === this.state.fileName) {
                console.log("-- Updating state --");
                //console.log(data.data);

                var fileDate = data.fileName.substring(data.fileName.indexOf('debriefing_') + 11, data.fileName.length - 3);


                if (this.state.location !== data.data.location || this.state.mdeValueObjectives !== data.data.objectives || JSON.stringify(this.state.actions) !== JSON.stringify(data.data.actions) ||
                    JSON.stringify(this.state.teamSelected) !== JSON.stringify(data.data.team) || JSON.stringify(this.state.emergencyContacts) !== JSON.stringify(data.data.emergencyContacts) ||
                    this.state.weatherImage !== data.data.weather ||
                    JSON.stringify(this.state.vehicles) !== JSON.stringify(data.data.vehicles) || JSON.stringify(this.state.missionLogs) !== JSON.stringify(data.data.missionLogs) ||
                    JSON.stringify(this.state.equipment) !== JSON.stringify(data.data.equipment) || this.state.mdeValueFinalRemarks !== data.data.finalRemarks) {

                    /*    
                    console.log("Chage state");

                    console.log("previous state:");
                    console.log(this.state.equipment);
                    console.log("state received:");
                    console.log(data.data.equipment);
                    */

                    this.setState({
                        fileName: this.state.fileName,
                        currentDate: fileDate,
                        location: data.data.location,
                        mdeValueObjectives: data.data.objectives,
                        teamSelected: data.data.team,
                        emergencyContacts: data.data.emergencyContacts,
                        weatherImage: data.data.weather,
                        vehicles: data.data.vehicles,
                        equipment: data.data.equipment,
                        missionLogs: data.data.missionLogs,
                        actions: data.data.actions,
                        mdeValueFinalRemarks: data.data.finalRemarks
                    })
                }
                else {
                    //console.log("Not change state");
                }
            }
            else {
                //console.log("Ficheiro diferentes nao alterar");
            }
        });
    }



    handleSocketUpdate() {
        let previewMarkdown = '# LogBook\n';
        previewMarkdown += '## ' + this.state.location + ': ' + this.state.currentDate + '\n';

        previewMarkdown += '### Objectives\n';
        if (this.state.mdeValueObjectives === undefined) {
            previewMarkdown += '\n';
        }
        else {
            previewMarkdown += this.state.mdeValueObjectives + '\n';
        }

        previewMarkdown += '### Team\n';
        previewMarkdown += presentTeamMembers(this.state.teamSelected) + '\n';

        previewMarkdown += '### Emergency Procedures / Contacts\n';
        if (this.state.emergencyContacts === undefined) {
            previewMarkdown += '\n';
        }
        else {
            previewMarkdown += this.state.emergencyContacts + '\n';
        }

        previewMarkdown += '### Weather\n';
        previewMarkdown += '![](' + this.state.weatherImage + ')\n\n';

        previewMarkdown += '### Systems\n';
        previewMarkdown += presentVehicleTable(this.state.vehicles);

        previewMarkdown += '### Other Equipment\n';
        previewMarkdown += presentEquipmentList(this.state.equipment);

        previewMarkdown += '### Mission LogBook\n';
        previewMarkdown += presentLogTable(this.state.missionLogs);

        previewMarkdown += '### Action Items\n';
        previewMarkdown += presentActionList(this.state.actions);

        previewMarkdown += '### Final Remarks\n';
        if (this.state.mdeValueFinalRemarks === undefined) {
            previewMarkdown += '';
        }
        else {
            previewMarkdown += this.state.mdeValueFinalRemarks;
        }

        console.log('Socket update');

        socket.emit('update.file', {
            fileName: this.state.fileName,
            previewMarkdown
        });
    }



    async createFile(fileName: string) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };

        const response = await fetch('/createFile/' + fileName, requestOptions);
        const data = await response.text();

        if (data === 'File created') {
            console.log('File created');
            this.setState({
                currentDate: fileName.substring(fileName.lastIndexOf('debriefing_') + 11, fileName.lastIndexOf('.md')),
                fileName: fileName
            })
        }
        else if (data === 'File exist') {
            console.log('File already exist');
        }
        else {
            console.log('Error creating file');
        }
    }



    handleUpdateDate(time: string) {
        this.setState({
            currentDate: time,
            fileName: 'debriefing_' + time + '.md'
        })
    }



    async handlePreviewDoc() {
        console.log('-----' + this.state.fileName + '-----');

        let previewMarkdown = '# LogBook\n';
        previewMarkdown += '## ' + this.state.location + ': ' + this.state.currentDate + '\n';

        previewMarkdown += '### Objectives\n';
        if (this.state.mdeValueObjectives === undefined) {
            previewMarkdown += '\n';
        }
        else {
            previewMarkdown += this.state.mdeValueObjectives + '\n';
        }

        previewMarkdown += '### Team\n';
        previewMarkdown += presentTeamMembers(this.state.teamSelected) + '\n';

        previewMarkdown += '### Emergency Procedures / Contacts\n';
        if (this.state.emergencyContacts === undefined) {
            previewMarkdown += '\n';
        }
        else {
            previewMarkdown += this.state.emergencyContacts + '\n';
        }

        previewMarkdown += '### Weather\n';
        previewMarkdown += '![](' + this.state.weatherImage + ')\n\n';

        previewMarkdown += '### Systems\n';
        previewMarkdown += presentVehicleTable(this.state.vehicles);

        previewMarkdown += '### Other Equipment\n';
        previewMarkdown += presentEquipmentList(this.state.equipment);

        previewMarkdown += '### Mission LogBook\n';
        previewMarkdown += presentLogTable(this.state.missionLogs);

        previewMarkdown += '### Action Items\n';
        previewMarkdown += presentActionList(this.state.actions);

        previewMarkdown += '### Final Remarks\n';
        if (this.state.mdeValueFinalRemarks === undefined) {
            previewMarkdown += '';
        }
        else {
            previewMarkdown += this.state.mdeValueFinalRemarks;
        }
        console.log(previewMarkdown);
    }



    async handleDownloadFile() {
        const zipFileName = this.state.fileName.substring(0, this.state.fileName.indexOf('.')) + '.zip';

        const data = await fetch('/download/zip/' + this.state.fileName);
        const fileContent = await data.blob();

        var url = window.URL.createObjectURL(fileContent);
        var a = document.createElement('a');
        a.href = url;
        a.download = zipFileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    async handleDownloadPdf() {
        const pdfFileName = this.state.fileName.substring(0, this.state.fileName.indexOf('.')) + '.pdf';

        const data = await fetch('/download/pdf/' + this.state.fileName);
        const fileContent = await data.blob();

        var url = window.URL.createObjectURL(fileContent);
        var a = document.createElement('a');
        a.href = url;
        a.download = pdfFileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }



    async handleSaveDoc() {
        let previewMarkdown = '# LogBook\n';
        previewMarkdown += '## ' + this.state.location + ': ' + this.state.currentDate + '\n';

        previewMarkdown += '### Objectives\n';
        if (this.state.mdeValueObjectives === undefined) {
            previewMarkdown += '\n';
        }
        else {
            previewMarkdown += this.state.mdeValueObjectives + '\n';
        }

        previewMarkdown += '### Team\n';
        previewMarkdown += presentTeamMembers(this.state.teamSelected) + '\n';

        previewMarkdown += '### Emergency Contacts\n';
        previewMarkdown += '* N/D\n';

        previewMarkdown += '### Systems\n';
        previewMarkdown += presentVehicleTable(this.state.vehicles);

        previewMarkdown += '### Other Equipment\n';
        previewMarkdown += presentEquipmentList(this.state.equipment);

        previewMarkdown += '### Mission LogBook\n';
        previewMarkdown += presentLogTable(this.state.missionLogs);

        previewMarkdown += '### Action Items\n';
        previewMarkdown += presentActionList(this.state.actions);

        previewMarkdown += '### Final Remarks\n';
        if (this.state.mdeValueFinalRemarks === undefined) {
            previewMarkdown += '';
        }
        else {
            previewMarkdown += this.state.mdeValueFinalRemarks;
        }

        console.log(previewMarkdown);

        this.handleSocketUpdate();

        // redirect page
        this.setState({
            redirect: true
        })
    }


    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/' />
        }
    }


    //--- Location
    handleChangeLocation(event: React.ChangeEvent<HTMLInputElement>) {
        var contacts: string = "";
        locationOption.forEach(location => {
            if (location.name === event.target.value) {
                if (location.contacts.length > 0) {
                    location.contacts.forEach(contact => {
                        contacts += '* ' + contact.name + " - " + contact.phoneNumber + "\n";
                    })
                }
            }
        })

        if (contacts.length > 0) {
            this.setState({
                location: event.target.value,
                emergencyContacts: contacts
            }, this.handleSocketUpdate);
        }
        else {
            this.setState({
                location: event.target.value
            }, this.handleSocketUpdate);
        }
    }


    //--- Team
    handleChangeTeam(event: any) {
        const elem = event.target;
        const memberId = elem.getAttribute('data-member');
        const value = elem.value;

        let teamSelected = [...this.state.teamSelected];
        teamSelected[memberId] = value;

        this.setState(
            {
                teamSelected
            }, this.handleSocketUpdate);
    }

    handleAddTeamMember() {
        let teamSelected = [...this.state.teamSelected, ''];
        this.setState(
            {
                teamSelected
            }, this.handleSocketUpdate);
    }

    handleDeleteTeamMember(event: any) {
        //console.log('remove team member');
        const elemId = event.target.getAttribute('data-member');

        console.log("REMOVE -> " + elemId);

        let teamSelected = [...this.state.teamSelected];
        teamSelected.splice(elemId, 1);

        this.setState({
            teamSelected
        }, this.handleSocketUpdate);
    }


    //--- weather 
    async handleWeatherFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files !== null) {
            //send file to server
            const formData = new FormData();
            formData.append('image', event.target.files[0]);

            const requestOptions = {
                method: 'POST',
                body: formData
            };

            const response = await fetch('/uploadImage/', requestOptions);
            const data = await response.json();

            if (data.message) {
                const imageEndpoint = host.proxy + '/image/' + data.fileName;

                this.setState({
                    weatherImage: imageEndpoint
                }, this.handleSocketUpdate);
            }
        }
    }


    //--- Vehicles
    handleAddVehicle() {
        const newVehicle = {
            name: '',
            phone_no: undefined,
            gsm_credit: '',
            emergency_pinger: '',
        }

        let vehicles = [...this.state.vehicles, newVehicle];
        this.setState({ vehicles }, this.handleSocketUpdate);
    }

    handleDeleteVehicle(event: any) {
        const vehicleId = event.target.getAttribute('data-vehicle');

        let vehicles = [...this.state.vehicles];
        vehicles.splice(vehicleId, 1);

        this.setState({
            vehicles
        }, this.handleSocketUpdate);
    }

    handleUpdateVehicle(event: any) {
        //console.log("update vehicle");

        var elem = event.target;
        var vehicleId = elem.parentElement.getAttribute('data-vehicle');
        var dataType = elem.parentElement.getAttribute('data-type');
        var value = elem.value;

        let vehicles = [...this.state.vehicles];
        let item;
        if (dataType === 'name') {
            var vehiclePhoneNumber;
            vehicleOptions.forEach(vehicle => {
                if (vehicle.name === value) {
                    vehiclePhoneNumber = vehicle.phoneNumber;
                }
            })
            if (vehiclePhoneNumber) {
                item = {
                    ...vehicles[vehicleId],
                    name: value,
                    phone_no: vehiclePhoneNumber
                }
            }
            else {
                item = {
                    ...vehicles[vehicleId],
                    name: value
                }
            }
        }
        else if (dataType === 'phone_no') {
            item = {
                ...vehicles[vehicleId],
                phone_no: value
            }
        }
        else if (dataType === 'gsm_credit') {
            item = {
                ...vehicles[vehicleId],
                gsm_credit: value
            }
        }
        else if (dataType === 'emergency_pinger') {
            item = {
                ...vehicles[vehicleId],
                emergency_pinger: value
            }
        }
        else {
            item = {
                ...vehicles[vehicleId]
            }
        }

        vehicles[vehicleId] = item;

        this.setState({ vehicles }, this.handleSocketUpdate);

        //console.log("update vehicle (" + dataType + "(" + vehicleId + ")) - " + value);
    }


    //--- Equipment
    handleUpdateEquipment(event: any) {
        const value = event.target.value;
        const id = event.target.getAttribute('data-equipment');

        let equipment = [...this.state.equipment];

        equipment[id] = value;

        this.setState({ equipment }, this.handleSocketUpdate);

        //console.log("change Equipment ("+ id +") - " + value);
    }

    handleAddEquipment() {
        let equipment = [...this.state.equipment, ''];
        this.setState({ equipment }, this.handleSocketUpdate);
    }

    handleDeleteEquipment(event: any) {
        const equipId = event.target.getAttribute('data-equipment');

        let equipment = [...this.state.equipment];
        equipment.splice(equipId, 1);

        this.setState({
            equipment
        }, this.handleSocketUpdate);
    }


    //--- Mission Logs
    handleMissionLog(value: any) {
        const newMissionlog = {
            time: getCurrentTime(),
            description: value
        }

        const missionLogs = [...this.state.missionLogs, newMissionlog];
        this.setState({ missionLogs }, this.handleSocketUpdate);
    }

    handleUpdateMissionLog(event: any) {
        var elem = event.target;
        var logId = elem.getAttribute('data-log-id');
        var logType = elem.getAttribute('data-log-type');
        var value = elem.value;

        //console.log('[' + logId + '] - ' + logType + ' --> ' + value);

        let missionLogs = [...this.state.missionLogs];
        let item;

        if (logType === 'time') {
            console.log('time');
            item = {
                ...missionLogs[logId],
                time: value
            }
        }
        else if (logType === 'description') {
            console.log('description');
            item = {
                ...missionLogs[logId],
                description: value
            }
        }
        else {
            console.log('nada');
            item = {
                ...missionLogs[logId]
            }
        }
        missionLogs[logId] = item;

        this.setState({
            missionLogs
        }, this.handleSocketUpdate);
    }

    handleBlurMissionLog(logId: number, value: string) {
        let missionLogs = [...this.state.missionLogs];
        let item = {
            ...missionLogs[logId],
            time: value
        };

        missionLogs[logId] = item;
        this.setState({
            missionLogs
        }, this.handleSocketUpdate);
    }

    handleDeleteMissionLog(event: any) {
        const logId = event.target.getAttribute('data-log-id');

        let missionLogs = [...this.state.missionLogs];
        missionLogs.splice(logId, 1);

        this.setState({
            missionLogs
        }, this.handleSocketUpdate);
    }


    //--- Action Items
    handleUpdateAction(event: any) {
        const value = event.target.value;
        const id = event.target.getAttribute('data-action');

        let actions = [...this.state.actions];

        actions[id] = value;

        this.setState(
            {
                actions
            }, this.handleSocketUpdate);

        //console.log("change action (" + id + ") - " + value);
    }

    handleAddAction() {
        let actions = [...this.state.actions, ''];
        this.setState(
            {
                actions
            }, this.handleSocketUpdate);
    }

    handleDeleteAction(event: any) {
        const actionId = event.target.getAttribute('data-action');

        let actions = [...this.state.actions];
        actions.splice(actionId, 1);

        this.setState({
            actions
        }, this.handleSocketUpdate);
    }


    //--- simpleMDE - Objectives
    handleChangeObjectives = (value: any) => {
        if (this.state.mdeValueObjectives !== value) {
            this.setState({
                mdeValueObjectives: value
            }, this.handleSocketUpdate);
        }
    }


    //--- simpleMDE - emergency
    handleChangeEmergency = (value: any) => {
        if (this.state.emergencyContacts !== value) {
            this.setState({
                emergencyContacts: value
            }, this.handleSocketUpdate);
        }
    }


    //--- SimpleMDE - Final Remarks
    handleChangeFinalRemarks = (value: any) => {
        if (this.state.mdeValueFinalRemarks !== value) {
            this.setState({
                mdeValueFinalRemarks: value
            }, this.handleSocketUpdate)
        }
    }


    render() {
        return (
            <div className="report" >

                {this.renderRedirect()}

                {/*<button onClick={this.handlePreviewDoc}>Preview</button>*/}
                <button className="download-file" onClick={this.handleDownloadFile}> &#11015; Download</button>
                <button className="download-pdf-file" onClick={this.handleDownloadPdf}> &#11015; PDF </button>

                <CurrentDate
                    currentDate={this.state.currentDate}
                    location={this.state.location}
                    locationChange={this.handleChangeLocation} />

                <Objectives
                    onChange={this.handleChangeObjectives}
                    value={this.state.mdeValueObjectives} />

                <Team
                    teamSelected={this.state.teamSelected}
                    onChange={this.handleChangeTeam}
                    onAddTeamMember={this.handleAddTeamMember}
                    onDeleteTeamMember={this.handleDeleteTeamMember} />

                <EmergencyContacts
                    onChange={this.handleChangeEmergency}
                    value={this.state.emergencyContacts} />

                <Weather
                    img={this.state.weatherImage}
                    onChange={this.handleWeatherFileChange} />

                <Vehicle
                    vehiclesList={this.state.vehicles}
                    onChangeVehicle={this.handleUpdateVehicle}
                    onAddVehicle={this.handleAddVehicle}
                    onDeleteVehicle={this.handleDeleteVehicle} />

                <Equipment
                    equipment={this.state.equipment}
                    onChangeEquipment={this.handleUpdateEquipment}
                    onAddEquipment={this.handleAddEquipment}
                    onDeleteEquipment={this.handleDeleteEquipment} />

                <MissionLogbook
                    missionLog={this.state.missionLogs}
                    onAddMissionLog={this.handleMissionLog}
                    onChangeMissionLog={this.handleUpdateMissionLog}
                    onBlurMissionLog={this.handleBlurMissionLog}
                    onDeleteMissionLog={this.handleDeleteMissionLog} />

                <ActionItems
                    actionList={this.state.actions}
                    onChangeAction={this.handleUpdateAction}
                    onAddAction={this.handleAddAction}
                    onDeleteAction={this.handleDeleteAction} />

                <FinalRemarks
                    onChange={this.handleChangeFinalRemarks}
                    value={this.state.mdeValueFinalRemarks} />

            </div >
        );
    }
}


export default CreateReport;