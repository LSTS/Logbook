import React from 'react';

import vehicleOptions from '../data/vehicles.json';

interface Props {
    onChangeVehicle: any;
    onAddVehicle: any;
    onDeleteVehicle: any;

    vehiclesList: {
        name: string,
        phone_no: number | undefined,
        gsm_credit: string,
        emergency_pinger: string
    }[];

}


const Vehicle: React.FC<Props> = (props: Props) => {

    const headers = [
        { id: 1, name: "Name", phone: "Phone no", gsm: "GSM Credit", emergency: "Emergency Pinger" }
    ];

    return (
        <div className="vehicles">
            <h4 className="title"> Systems </h4>
            <table className="vehicles-table">
                <tbody className="vehicles-body">

                    {
                        headers.map(header => (
                            <tr key={header.id} className="vehicle-header">
                                <th>{header.name}</th>
                                <th>{header.phone}</th>
                                <th>{header.gsm}</th>
                                <th>{header.emergency}</th>
                                <th className="remove-btn-cell"></th>
                            </tr>
                        ))
                    }

                    {
                        props.vehiclesList.map((item, index) => (
                            <tr key={index} data-vehicle={index} >
                                <td data-type="name" data-vehicle={index}>
                                    <input type="text" className="vehicle-input" list="vehicles" value={item.name} onChange={props.onChangeVehicle}>

                                    </input>
                                    <datalist id="vehicles">
                                        {
                                            vehicleOptions.map((vehicle, index) => (
                                                <option key={index}>{vehicle}</option>
                                            ))
                                        }
                                    </datalist>
                                </td>

                                <td data-type="phone_no" data-vehicle={index}>
                                    <input type="number" className="vehicle-input" value={item.phone_no || ''} onChange={props.onChangeVehicle} />                                           
                                </td>

                                <td data-type="gsm_credit" data-vehicle={index}>
                                    <input type="text" className="vehicle-input" placeholder="<Credit,Date>" value={item.gsm_credit} onChange={props.onChangeVehicle} />
                                </td>

                                <td data-type="emergency_pinger" data-vehicle={index}>
                                    <input type="text" className="vehicle-input" placeholder="<Freq,Pattern>" value={item.emergency_pinger} onChange={props.onChangeVehicle} />
                                </td>

                                <td className="remove-btn-cell">
                                <button className="delete-vehicle" 
                                        data-vehicle={index} 
                                        onClick={props.onDeleteVehicle}> 
                                
                                    &#x1f5d1;
                                
                                    </button> 
                                </td>
                            </tr>
                        ))
                    }

                </tbody>
            </table>

            <button onClick={props.onAddVehicle}>Add vehicle</button>

        </div>
    );
}

export default Vehicle;



/*

*/