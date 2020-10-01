import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown/with-html'
import { useHistory } from 'react-router';


interface IFile {
    name: string;
    isDir: boolean;
}

const LoadReport: React.FC = () => {

    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState('');
    const [data, setData] = useState<IFile[]>([]);

    //const [sortedFiles, setSortedFiles] = useState();

    let history = useHistory();


    useEffect(() => {
        listFiles();    
    }, [])

    
    useEffect(() => {
        if(data.length > 0) {
            sortFiles();
        }
    }, [data])


    const handleClickFile = async (fileNameToOpen: string) => {

        if (fileName !== fileNameToOpen) {
            const data = await fetch('/file/' + fileNameToOpen);
            const fileContent = await data.text();

            setFile(fileContent);
            setFileName(fileNameToOpen);
        }
        else {
            console.log('File already open');
        }
    }


    const listFiles = async () => {
        const dataFetched = await fetch('/file/');
        const files = await dataFetched.text();

        var json = JSON.parse(files);
        setData(json);
    }


    const handleEditFile = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        history.push('/createReport/' + fileName);
    }


    const handleDownloadFile = async () => {
        const zipFileName = fileName.substring(0, fileName.indexOf('.')) + '.zip';

        const data = await fetch('/download/zip/' + fileName);
        const fileContent = await data.blob();

        var url = window.URL.createObjectURL(fileContent);
        var a = document.createElement('a');
        a.href = url;
        a.download = zipFileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }


    const handleDonwloadPdf = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const pdfFileName = fileName.substring(0, fileName.indexOf('.')) + '.pdf';

        const data = await fetch('/download/pdf/' + fileName);
        const fileContent = await data.blob();

        var url = window.URL.createObjectURL(fileContent);
        var a = document.createElement('a');
        a.href = url;
        a.download = pdfFileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }


    const sortFiles = () => {
        console.log(data);

        var finalObj: any = {};
        //var finalObj: any[] = {};
        
        var monthName = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        data.forEach((file, index) => {
            const fileDate = file.name.substring(11, file.name.length - 3);
            //console.log(fileDate);

            const fileYear = fileDate.split('-')[0];
            const fileMonth = fileDate.split('-')[1];

            var year = parseInt(fileYear); 
            var month = monthName[parseInt(fileMonth)];

            if( !finalObj[year] ) {
                finalObj[year] = [];
                if(!finalObj[year][month]) {
                    finalObj[year][month] = [file.name];
                }
                else {
                    finalObj[year][month].push(file.name);
                }
            }
            else {
                finalObj[year].push();
                if(!finalObj[year][month]) {
                    finalObj[year][month] = [file.name];
                }
                else {
                    finalObj[year][month].push(file.name);
                }
            }
            
        })
        

        console.log(finalObj);

        //setSortedFiles(finalObj);
        

        /*
        Object.keys(finalObj).map(item => {
            console.log(item);
        })
        */

        /*
        var obj = Object.assign({},finalObj);
        console.log(obj);
        setSortedFiles(obj);
        */
        
        /*
        console.log('---');
        obj = Object.keys(finalObj).map(item => {
            console.log('--> ' + item);
        });
        */
    }



    return (
        <div className="buttons-index">

            <div className="list-files">

                {
                    data.map((item, index) => (
                        (fileName === item.name) ?
                            (<span key={index} className="list-file-item-active" onClick={() => handleClickFile(item.name)}> &#128193; {item.name}  </span>)
                            :
                            (<span key={index} className="list-file-item" onClick={() => handleClickFile(item.name)}> &#128193; {item.name} </span>)
                    ))
                }

            </div>

            <hr />

            <div className="previewFile">

                {file ?
                    (<button className="edit-report" onClick={handleEditFile}> &#9998; </button>) : (<></>)
                }

                {file ?
                    (<button className="download-file" onClick={handleDownloadFile}> &#11015; Markdown </button>) : (<></>)
                }

                {file ?
                    (<button className="download-pdf-file" onClick={handleDonwloadPdf}> &#11015; PDF </button>) : (<></>)
                }


                {file ?
                    (<ReactMarkdown className='markdown-body' source={file} escapeHtml={false} />)
                    : <h4> (File Preview) </h4>
                }

            </div>

        </div>
    );
}

export default LoadReport;