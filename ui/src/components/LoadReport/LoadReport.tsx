import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown/with-html'
import { useHistory } from 'react-router';


interface IFile {
    name: string;
    isDir: boolean;
}

interface IVisibleYear {
    year: string;
    visible: boolean;
}

const LoadReport: React.FC = () => {

    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState('');
    const [data, setData] = useState<IFile[]>([]);

    const [sortedFiles, setSortedFiles] = useState<any[]>([]);

    const [visibleYear, setVisibleYear] = useState<IVisibleYear[]>([]);

    let history = useHistory();

    const [isWaitingSpreadsheet, setIsWaitingSpreadsheet] = useState(false);

    useEffect(() => {
        listFiles();
    }, [])


    useEffect(() => {
        function sortFiles() {
            //console.log(data);

            var list: any = [];

            var byYearAndMonth: any = [];
            var monthName = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            data.forEach(file => {
                const fileDate = file.name.substring(11, file.name.length - 3);
                const year = fileDate.split('-')[0];
                const fileMonth = fileDate.split('-')[1];

                var month = monthName[parseInt(fileMonth)];



                if (typeof byYearAndMonth[year] === 'undefined') {
                    byYearAndMonth[year] = {};

                    list.push({ year: year, visible: true });

                }

                if (typeof byYearAndMonth[year][month] === 'undefined') {
                    byYearAndMonth[year][month] = [];
                }
                byYearAndMonth[year][month].push(file.name);
            })
            setSortedFiles(byYearAndMonth);
            setVisibleYear(list);
            //console.log(byYearAndMonth);
            //console.log(list);
        }

        sortFiles()
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

    const handleClickYear = (yearToChange: string) => {

        var listYear: any = [];

        visibleYear.forEach(item => {
            if (item.year === yearToChange) {
                listYear.push({ year: item.year, visible: !item.visible })
            }
            else {
                listYear.push({ year: item.year, visible: item.visible })
            }
        })

        setVisibleYear(listYear)
        //console.log(listYear);

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

    const handleSyncSpreadsheet = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    
        setIsWaitingSpreadsheet(true)

        const data = await fetch('/google/' + fileName);
        const response = await data.json();

        if(response === 'Spreadsheet updated'){
            alert('Spreadsheet updated')
        }
        else if(response === 'Empty actions') {
            alert('There are no actions')
        }
        else {
            alert('Cannot update Spreadsheet.\nMake sure you have internet access.')
        }

        setIsWaitingSpreadsheet(false)
    }


    return (
        <div className="buttons-index">

            <div className="list-files">
                {
                    Object.keys(sortedFiles).map((year: any, yearIndex) => (

                        <div className={(visibleYear[year]) ? 'year' : 'year-hide'} key={yearIndex} onClick={() => handleClickYear(year)}>
                            <h5 className="year-title" >{year}</h5>
                            {
                                Object.keys(sortedFiles[year]).map((month, monthIndex) => (
                                    <div className="month" key={monthIndex}>
                                        <h5 className="month-title">{month}</h5>
                                        {
                                            sortedFiles[year][month] ?
                                                (
                                                    <div className="files">
                                                        {
                                                            sortedFiles[year][month].map((i: any, fileIndex: any) => (
                                                                (fileName === i) ?
                                                                    (<span className="list-file-item-active fileName-title" key={fileIndex} onClick={() => handleClickFile(i)}> &#128193; {i} </span>)
                                                                    :
                                                                    (<span className="list-file-item fileName-title" key={fileIndex} onClick={() => handleClickFile(i)}> &#128193; {i} </span>)
                                                            ))
                                                        }
                                                    </div>
                                                )
                                                :
                                                (<></>)
                                        }
                                    </div>
                                ))
                            }
                        </div>
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
                    (<button className="sync-spreadsheet" disabled={isWaitingSpreadsheet} onClick={handleSyncSpreadsheet}> Sync with Google Spread sheet </button>) : (<></>)
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