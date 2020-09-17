import React from 'react'
import SimpleMDE from 'react-simplemde-editor'

interface Props {
    onChange: any;
    value: any;
}

const FinalRemarks: React.FC<Props> = (props: Props) => {

    return (
        <div className="final-remarks">
            <h4 className="title">Final Remarks</h4>

            <SimpleMDE
                id="simplemde-final-remarks"
                onChange={props.onChange}
                value={props.value}
                options={{
                    autoDownloadFontAwesome: true,
                    spellChecker: false,
                    hideIcons: ["quote", "image", "side-by-side", "fullscreen", "guide"]
                }} />

        </div>
    );

}

export default FinalRemarks;