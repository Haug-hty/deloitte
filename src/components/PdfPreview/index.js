import React, { useState } from 'react'
import { Document, Page  } from  'react-pdf'
import { pdfjs } from 'react-pdf'
import Line from '../AuxiliaryLine/index'




import './index.css'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

function PdfComponent() {
	let [totalPage, setTotalPage] = useState(1)
	let [status, setStatus] = useState(false)

	function onDocumentLoadSuccess({numPages}) {
	    setTotalPage(numPages)
        changeStatus()
	}

    const changeStatus= ()=>{
        setStatus(true)
    }
	
	return <>
		<Document
         id="fileCanvas"
            className="container"
        //   file={require('../../11.pdf')}  //文件路径
          file={require('@/12.pdf')}  //文件路径

          onLoadSuccess={onDocumentLoadSuccess} //成功加载文档后调用
          renderMode="canvas"   //定义文档呈现的形式 
          
      >
          <Line status={status}/>
          {
              new Array(totalPage).fill('').map((item, index) => {
                  return <Page key={index} pageNumber={index + 1} />
              })
          }
      </Document>
	</>
}

export default PdfComponent
