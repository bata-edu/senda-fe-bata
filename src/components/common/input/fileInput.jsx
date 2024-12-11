import React, {useState} from "react";
import uploadFile from "../../../assets/icons/upluadFile.svg"

const FileInput = ({ name, type ,file, setFile }) => {

    const [dragActive, setDragActive] = useState(false);

    const handleFileDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleClick = () => {
        document.getElementById("file-upload").click();
    };

    return(
        <div>
            <div
                className={`w-full h-40 border-2 ${
                    dragActive ? 'border-blue-500' : 'border-gray-300'
                } border-dashed rounded-lg flex flex-col justify-center items-center text-center cursor-pointer`}
                onClick={handleClick}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleFileDrop}
            >
                {file ? (
                    <div>
                        <p className="text-blue-600 font-bold">Archivo cargado: {file.name}</p>
                    </div>
                ) : (
                    <div className>
                        <div className='flex justify-center mt-2'>
                            <img className='w-12 h-12' src={uploadFile} alt="" />
                        </div>
                        <p className="text-blue-500 font-semibold">{name}</p>
                        <p className="text-sm text-gray-400 mt-2">{type}</p>
                    </div>
                )}
            </div>
            <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileInputChange}
            />
        </div>
    )

}

export default FileInput;