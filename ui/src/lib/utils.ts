export const addZero = (num: number) => (num < 10 ? `0${num}` : `${num}`);


export function getCurrentDate() {
    const newDate = new Date();
    const date = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();

    return `${year}-${addZero(month)}-${addZero(date)}`;
}

export function getCurrentTime() {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    return `${addZero(hours)}:${addZero(minutes)}`;
}


export function presentTeamMembers(teamSelected: string[]) {

    if (teamSelected.length > 0 && teamSelected[0].length > 0) {

        let presentString = "";
        teamSelected.forEach((member, index) => {
            if (index !== teamSelected.length - 1) {
                presentString += member + ", ";
            }
            else if (index === teamSelected.length - 1) {
                presentString += member + ".";
            }
            else {
                presentString = "";
            }
        });


        return presentString;
    }

    else {
        return "";
    }

}




export function presentVehicleTable(vehicles: { name: string, phone_no: number | undefined, gsm_credit: string, emergency_pinger: string }[]) {

    let header = '| Name | Phone no | GSM Credit | Emergency Pinger |\n';
    header += '|---|---|---|---|\n';

    let bodyString = "";
    vehicles.forEach(vehicle => {
        bodyString += '|' + vehicle.name + '|' + (vehicle.phone_no !== undefined ? vehicle.phone_no : '') + '|' + (vehicle.gsm_credit !== undefined ? vehicle.gsm_credit : '') + '|' + (vehicle.emergency_pinger !== undefined ? vehicle.emergency_pinger : '') + '|\n';
    })

    return header + bodyString;
}


export function presentEquipmentList(equipment: string[]) {
    let presentString = '';
    equipment.forEach(item => {
        presentString += '* ' + item + '\n';
    })

    return presentString;
}

export function presentLogTable(logs: { time: string, description: string }[]) {

    if (logs.length > 0) {

        let header = '| Time | Description |\n';
        header += '|---|---|\n';

        let bodyString = '';
        logs.forEach(log => {
            bodyString += '|' + log.time + '|' + log.description + '|\n';
        })

        return header + bodyString;
    }
    else {
        return '';
    }
}

export function presentActionList(actions: string[]) {

    let presentString = '';
    actions.forEach((item, index) => {
        presentString += (index + 1) + '. ' + item + '\n';
    })

    return presentString;
}
