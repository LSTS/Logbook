import React from 'react';

import equipmentOptions from '../data/equipment.json';
import { presentEquipmentSigleLine } from '../../lib/utils';

interface Props {
    onChangeEquipment: any;
    onAddEquipment: any;
    onDeleteEquipment: any;
    equipment: string[];
}

const Equipment: React.FC<Props> = (props: Props) => {

   const presentString = presentEquipmentSigleLine(props.equipment);

    return (
        <div className="equipment">
            <h4 className="title">Other Equipment</h4>

            <h4 className="equipment-selected">
                {presentString.length > 0 ? ( presentString ) : ( 'N/D' )}
            </h4>

            <ul className="equipment-ul">
                {
                    props.equipment.map((equip, index) => (

                        <li key={index}>
                            <datalist id="equipmentOptions">
                                {
                                    equipmentOptions.map((item, i) => (
                                        <option key={i}>{item}</option>
                                    ))
                                }
                            </datalist>

                            <input data-equipment={index}
                                type="text" 
                                className="equipment-input" 
                                list="equipmentOptions" 
                                value={equip} 
                                onChange={props.onChangeEquipment} />

                            <button className="delete-equipment" 
                                data-equipment={index} 
                                onClick={props.onDeleteEquipment}> 
                                
                                &#x2715;
                                
                            </button> 
                            
                        </li>
                    ))
                }
            </ul>

            <button onClick={props.onAddEquipment}> Add equipment </button>

        </div>
    );
}

export default Equipment;