import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown/with-html'
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';


interface IFile {
    name: string;
    isDir: boolean;
}

const LoadReport: React.FC = () => {

    useEffect(() => {
        listFiles();
    }, []);

    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState('');
    const [data, setData] = useState<IFile[]>([]);

    let history = useHistory();

    const handleClickFile = async (fileName: string) => {
        //../api/routes/file
        const data = await fetch('http://localhost:3001/file/' + fileName);
        const fileContent = await data.text();

        setFile(fileContent);
        setFileName(fileName);
    }

    const listFiles = async () => {
        const dataFetched = await fetch('http://localhost:3001/file/');
        
        const files = await dataFetched.text();

        var json = JSON.parse(files);

        setData(json);
    }


    const handleEditFile = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        /*
        //check file template
        const dataFetched = await fetch('http://localhost:3001/file/type/' + fileName);
        const template = await dataFetched.text();

        console.log('Load template -> ' + template);
        if (template === 'template_1') {
            history.push('/createReport/' + fileName);
        }
        else if (template === 'template_2') {
            history.push('/createReport_2/' + fileName);
        }
        else {
            alert('template not found');
        }*/

        history.push('/createReport/' + fileName);
    }

    const handleDownloadFile = async () => {

        const data = await fetch('http://localhost:3001/download/' + fileName);
        const fileContent = await data.blob();

        var url = window.URL.createObjectURL(fileContent);
        var a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
 
    }


    return (
        <div className="buttons-index">

            <div className="list-files">
                <ul>
                    {
                        data.map((item, index) => (
                            <li key={index} className="list-file-item" onClick={() => handleClickFile(item.name)}>
                                {item.name}
                            </li>

                        ))
                    }
                </ul>
            </div>

            <hr />

            <div className="previewFile">

                {
                    file ?
                        (
                        <button className="edit-report" onClick={handleEditFile}>
                            &#9998;
                        </button>
                        ) : (<></>)
                }

                {file ? 
                (<button className="download-file" onClick={handleDownloadFile}> Download </button>) 
                : (<></>) }

                {
                    file ?
                        (<ReactMarkdown source={file} />)
                        : <h4> File not found </h4>
                }

            </div>




        </div>
    );
}

export default LoadReport;