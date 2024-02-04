import { useState } from 'react'
import { MdCloudUpload, MdDelete } from 'react-icons/md'
import { AiFillFileImage } from 'react-icons/ai'

export const Uploader = () => {
    
    const [image, setImage] = useState<unknown>(null)
    const [fileName, setFileName] = useState('No selected file')

    return (
        <main>
            <form 
                className="form" 
                action=""
                onClick={() => document.querySelector('.form_input1')?.click()}
            >
                <input 
                    type="file"  
                    accept='image/*' 
                    className='form_input1'
                    hidden
                    onChange={({target: {files}}) => {
                        files[0] && setFileName(files[0].name)
                        if(files){
                            setImage(URL.createObjectURL(files[0]))
                        }
                    }}
                />
                {image ?
                    <img src={image} width={120} height={12
                        0} alt={fileName}/> 
                : 
                    <MdCloudUpload color="#1475cf" size={60} />
                }
            </form>
        </main>
    )
}