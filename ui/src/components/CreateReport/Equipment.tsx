import React from 'react';

import equipmentOptions from '../data/equipment.json';

interface Props {
    onChangeEquipment: any;
    onAddEquipment: any;
    equipment: string[];
}

const Equipment: React.FC<Props> = (props: Props) => {

    //received from server side json
    /*
    const equipmentOptions = [
        { name: 'equip-1' },
        { name: 'equip-2' },
        { name: 'equip-3' },
        { name: 'equip-4' },
        { name: 'equip-5' },
        { name: 'equip-6' }
    ];
    */

    /*
    const [equipmentOptions, setEquipmentOptions] = useState([]);

    useEffect(() => {
        getEquipmentListFromServer();
    }, []);

    const getEquipmentListFromServer = () => {
        fetch('http://localhost:3001/equipment/')
            .then(res => res.json())
            .then(
                (result) => {
                    setEquipmentOptions(result.equipment);
                }
            )
    }
    */



    return (
        <div className="equipment">
            <h4 className="title">Other Equipment</h4>

            <ul className="equipment-ul">
                {
                    props.equipment.map((equip, index) => (

                        <li key={index}>

                            <input data-equipment={index}
                                type="text" 
                                className="equipment-input" 
                                list="equipmentOptions" 
                                value={equip} 
                                onChange={props.onChangeEquipment} />

                            <datalist id="equipmentOptions">
                                {
                                    equipmentOptions.map((item, i) => (
                                        <option key={i}>{item}</option>
                                    ))
                                }
                            </datalist>
                        </li>

                    ))
                }
            </ul>


            <button onClick={props.onAddEquipment}>Add equipment</button>


        </div>
    );
}

export default Equipment;