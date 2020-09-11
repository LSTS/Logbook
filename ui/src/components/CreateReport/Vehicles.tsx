import React, { useEffect, useState } from 'react'

interface Props {
    onChangeVehicle: any;

    onAddVehicle: any;

    vehiclesList: {
        name: string,
        phone_no: number | undefined,
        gsm_credit: string,
        emergency_pinger: string
    }[]

}


const Vehicle: React.FC<Props> = (props: Props) => {

    const headers = [
        { id: 1, name: "Name", phone: "Phone no", gsm: "GSM Credit", emergency: "Emergency Pinger" }
    ];

    //received from server side json
    /*
    const vehicleOptions = [
        { name: 'Vehicle1' },
        { name: 'Vehicle2' },
        { name: 'Vehicle3' },
        { name: 'Vehicle4' },
        { name: 'Vehicle5' },
        { name: 'Vehicle6' },
        { name: 'Vehicle7' },
        { name: 'Vehicle8' },
        { name: 'Vehicle9' }
    ];
    */

    const [vehicleOptions, setVehicleOptions] = useState([]);

    useEffect(() => {
        getVehicleListFromServer();
    }, []);


    const getVehicleListFromServer = () => {
        fetch('http://localhost:3001/vehicles/')
            .then(res => res.json())
            .then(
                (result) => {
                    setVehicleOptions(result.vehicles);
                }
            )
    }




    return (
        <div className="vehicles">
            <h4 className="title"> AUVs </h4>
            <table className="vehicles-table">
                <tbody className="vehicles-body">

                    {
                        headers.map(header => (
                            <tr key={header.id} className="vehicle-header">
                                <th>{header.name}</th>
                                <th>{header.phone}</th>
                                <th>{header.gsm}</th>
                                <th>{header.emergency}</th>
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