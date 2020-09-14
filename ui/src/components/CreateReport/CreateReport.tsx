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

import { Redirect } from 'react-router-dom'
import socketIOClient from 'socket.io-client'


const ENDPOINT = "http://localhost:3001/";
const socket = socketIOClient(ENDPOINT);

export { socket };

interface IVehicle {
    name: string,
    phone_no: number | undefined,
    gsm_credit: string,
    emergency_pinger: string
}

interface Props { 
    location: any;
}

interface State {

    fileName: string;

    currentDate: string;
    firstRender: boolean;

    mdeValueObjectives?: any;

    teamSelected: string[];

    emergencyContacts: number[];

    vehicles: IVehicle[];

    equipment: string[];

    missionLogs: {
        time: string,
        description: string
    }[];

    actions: string[];

    mdeValueFinalRemarks?: any;

    redirect: boolean;
}


class CreateReport extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            fileName: '',

            currentDate: '',
            firstRender: true,

            teamSelected: [],

            emergencyContacts: [],

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

            redirect: false
        }

        this.handleUpdateDate = this.handleUpdateDate.bind(this);
        this.handlePreviewDoc = this.handlePreviewDoc.bind(this);
        this.handleSaveDoc = this.handleSaveDoc.bind(this);
        this.handleChangeObjectives = this.handleChangeObjectives.bind(this);
        this.handleChangeTeam = this.handleChangeTeam.bind(this);
        this.handleUpdateVehicle = this.handleUpdateVehicle.bind(this);
        this.handleAddVehicle = this.handleAddVehicle.bind(this);
        this.handleUpdateEquipment = this.handleUpdateEquipment.bind(this);
        this.handleAddEquipment = this.handleAddEquipment.bind(this);
        this.handleMissionLog = this.handleMissionLog.bind(this);
        this.handleUpdateAction = this.handleUpdateAction.bind(this);
        this.handleAddAction = this.handleAddAction.bind(this);
        this.handleChangeFinalRemarks = this.handleChangeFinalRemarks.bind(this);

        this.handleSocketUpdate = this.handleSocketUpdate.bind(this);
        this.handleSockets = this.handleSockets.bind(this);

        this.shouldUpdate = this.shouldUpdate.bind(this);


    }

    componentDidMount() {
        this.reportExist();
        //setInterval(this.storeData,1000);
        this.handleSockets();
    }

    /*
    storeData(){
        console.log("update");
    }
    */


    componentWillUnmount() {
        //console.log('close connections');
        //socket.close();
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
                //console.log("-- Updating state --");
                //console.log(data.data);

                var fileDate = data.fileName.substring(data.fileName.indexOf('debriefing_') + 11, data.fileName.length - 3);


                if (this.state.mdeValueObjectives !== data.data.objectives || JSON.stringify(this.state.actions) !== JSON.stringify(data.data.actions) ||
                    JSON.stringify(this.state.teamSelected) !== JSON.stringify(data.data.team) || JSON.stringify(this.state.emergencyContacts) !== JSON.stringify(data.data.emergencyContacts) ||
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
                        mdeValueObjectives: data.data.objectives,
                        teamSelected: data.data.team,
                        emergencyContacts: data.data.emergencyContacts,
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


    shouldUpdate() {
        console.log('---FILENAME---');
        console.log(this.state.fileName);
    }


    handleSocketUpdate() {
        let previewMarkdown = '# LogBook\n';
        previewMarkdown += '## FEUP: ' + this.state.currentDate + '\n';

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

        previewMarkdown += '### AUVs\n';
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

        socket.emit('update.file', {
            fileName: this.state.fileName,
            previewMarkdown
        });
    }


    async reportExist() {
        let fileName;
        let fileDate;

        /*
        console.log(this.props.location);
        console.log('template - ' + this.props.location.template);
        */

        const fileToEdit = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        if (fileToEdit !== 'createReport' && fileToEdit.length > 0) {
            console.log("Load From file");
            fileName = fileToEdit;
            fileDate = fileToEdit.substring(fileToEdit.indexOf('debriefing_') + 11, fileToEdit.length - 3);

        }
        else {
            //console.log("Check if exist to load");
            fileName = 'debriefing_' + getCurrentDate() + '.md';
            fileDate = getCurrentDate();
        }

        const response = await fetch('http://localhost:3001/editFile/' + fileName);
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
                mdeValueObjectives: data.objectives,
                teamSelected: data.team,
                emergencyContacts: data.emergencyContacts,
                vehicles: data.vehicles,
                equipment: data.equipment,
                missionLogs: data.missionLogs,
                actions: data.actions,
                mdeValueFinalRemarks: data.finalRemarks
            })
        }
    }



    async createFile(fileName: string) {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };

        const response = await fetch('http://localhost:3001/createFile/' + fileName, requestOptions);
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
        previewMarkdown += '## FEUP: ' + this.state.currentDate + '\n';

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

        previewMarkdown += '### AUVs\n';
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

        //Prompt test
        /*
        var userName = prompt("Enter your name" , "e.g. debriefing_01-01-2020.md");
        if(userName) {
            console.log(userName);
        }
        else {
            console.log('Field cannot be empty');
        }

        */
    }



    async handleSaveDoc() {
        let previewMarkdown = '# LogBook\n';
        previewMarkdown += '## FEUP: ' + this.state.currentDate + '\n';

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

        previewMarkdown += '### AUVs\n';
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


        /*
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: previewMarkdown })
        };

        //const response = await fetch('http://localhost:3001/createFile/' + this.state.fileName, requestOptions);
        const response = await fetch('http://localhost:3001/updateFile/' + this.state.fileName, requestOptions);
        const data = await response.text();

        console.log(data);


        

        if (data === 'File updated') {
            // redirect page
            this.setState({
                redirect: true
            })
        }
        else {
            alert('Cannot save changes');
        }
        */

    }


    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/' />
        }
    }



    //--- Team
    handleChangeTeam(event: React.ChangeEvent<HTMLInputElement>) {
        const item = event.target.name;
        const isItemChecked = event.target.checked;

        let newArray = [...this.state.teamSelected, item];

        if (!isItemChecked) {
            newArray = newArray.filter(name => name !== item);
        }

        this.setState({ teamSelected: newArray }, this.handleSocketUpdate);
    }

    //--- Vehicles
    handleAddVehicle() {
        //console.log("Add vehicle - " + this.state.vehicles.length );
        const newVehicle = {
            name: '',
            phone_no: undefined,
            gsm_credit: '',
            emergency_pinger: '',
        }

        let vehicles = [...this.state.vehicles, newVehicle];
        this.setState({ vehicles }, this.handleSocketUpdate);

    }


    handleUpdateVehicle(event: any) {
        console.log("update vehicle");

        var elem = event.target;
        var vehicleId = elem.parentElement.getAttribute('data-vehicle');
        var dataType = elem.parentElement.getAttribute('data-type');
        var value = elem.value;

        console.log("ID    -> " + vehicleId);
        console.log("type  -> " + dataType);
        console.log("value -> " + value);

        /*
                var elem = event.target.parentElement;
                var value = elem.firstChild.value;
        
                var dataType = elem.getAttribute('data-type');
                var id = elem.parentElement.getAttribute('data-vehicle');
        */


        let vehicles = [...this.state.vehicles];
        let item;
        if (dataType === 'name') {
            item = {
                ...vehicles[vehicleId],
                name: value
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


        //console.log("update vehicle (" + dataType + "(" + id + ")) - " + value);

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


    //--- Mission Logs
    handleMissionLog(value: any) {
        const newMissionlog = {
            time: getCurrentTime(),
            description: value
        }

        const missionLogs = [...this.state.missionLogs, newMissionlog];
        this.setState({ missionLogs }, this.handleSocketUpdate);

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


    //--- simpleMDE - Objectives
    handleChangeObjectives = (value: any) => {
        this.setState({
            mdeValueObjectives: value
        }, this.handleSocketUpdate);

    }

    //--- SimpleMDE - Final Remarks
    handleChangeFinalRemarks = (value: any) => {
        this.setState({
            mdeValueFinalRemarks: value
        }, this.handleSocketUpdate)

    }


    render() {
        return (
            <div className="report" >

                {this.renderRedirect()}

                <button onClick={this.handlePreviewDoc}>Preview</button>

                <CurrentDate currentDate={this.state.currentDate} />

                <Objectives
                    onChange={this.handleChangeObjectives}
                    value={this.state.mdeValueObjectives} />

                <Team
                    teamSelected={this.state.teamSelected}
                    onChange={this.handleChangeTeam} />

                <EmergencyContacts />

                <Vehicle
                    vehiclesList={this.state.vehicles}
                    onChangeVehicle={this.handleUpdateVehicle}
                    onAddVehicle={this.handleAddVehicle} />

                <Equipment
                    equipment={this.state.equipment}
                    onChangeEquipment={this.handleUpdateEquipment}
                    onAddEquipment={this.handleAddEquipment} />

                <MissionLogbook
                    missionLog={this.state.missionLogs}
                    onAddMissionLog={this.handleMissionLog} />

                <ActionItems
                    actionList={this.state.actions}
                    onChangeAction={this.handleUpdateAction}
                    onAddAction={this.handleAddAction} />

                <FinalRemarks
                    onChange={this.handleChangeFinalRemarks}
                    value={this.state.mdeValueFinalRemarks} />

            </div >
        );
    }

}


/*
                <h6>{this.state.mdeValueObjectives}</h6>
                <h6>{this.state.teamSelected}</h6>
                */



/*
const CreateReport: React.FC = () => {

    const [currentDate , setCurrentDate] = useState('');


    return (
        <div className="report">
            <CurrentDate onChange={() => alert('test')}/>
        </div>
    );
}
*/


export default CreateReport;