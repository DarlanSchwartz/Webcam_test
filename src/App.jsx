import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { styled } from 'styled-components';
import { saveAs } from 'file-saver';

export default function App() {

  const [mirrored,setMirrored] = useState(false);
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
      // Tira uma screenshot do frame atual da webcam
      // O screenshot é uma string que começa com data:image/jpeg;base64, eu removo esse inicio
      const photo = webcamRef.current.getScreenshot().replace('data:image/jpeg;base64,', '');
      // Faço o download da foto
      handleDownloadClick(photo);
    }, [webcamRef]);

  function base64ToBlob(base64String) {
    // converter a string da foto atual em bytes
    const byteCharacters = atob(base64String);
    const byteArrays = [];
  
    // Formatar os bytes para formato 64
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    // Criar o arquivo final formatado em base64 no formato de imagem.jpg
    return new Blob(byteArrays, { type: 'image/jpeg' });
  }

  function handleDownloadClick(ref) {

    if(ref == '')
    {
      return;
    }

    // Converter a string da foto atual em um arquivo
    const blob = base64ToBlob(ref);

    // Salvar o arquivo no pc como photo.jpg
    saveAs(blob, 'photo.jpg');
  }

  return (
    <PageContainer>
      <Webcam screenshotFormat="image/jpeg" className='webcam-div' mirrored={mirrored} ref={webcamRef}  forceScreenshotSourceSize ={true} height={720}/>
      <div className='actions-div'>
        <button onClick={()=> setMirrored(!mirrored)}>{'>|<'}</button>
        <button onClick={capture}>Capturar</button>
      </div>
    </PageContainer>
  )
}


const PageContainer = styled.div`

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  gap:30px;
  background-color: #313131;

  .actions-div{

        display: flex;
        gap: 30px;

        button{
        border: 1px solid white;
        color :white;
        border-radius: 5px;
        background-color: #363636;
        width: auto;
        height: 30px;
        font-size: 20px;
        transition: all 200ms;

        &:hover{
          background-color: white;
          color: #252525;
        }
      }
  }
  
  .webcam-div{
    position: relative;
    border: 10px solid white;
    border-radius: 10px;
    max-width: 100%;
    height: auto;
    box-sizing: border-box;
  }
`;
