import React, { useRef } from 'react';
import clock from '../../../assets/icons/clock.svg';

const DatePickerInput = ({ label, value, onChange, placeholder }) => {
    const dateInputRef = useRef(null);

    const handleSelectClick = () => {
        if (dateInputRef.current) {
            dateInputRef.current.showPicker();
        }
    };

    return (
        <div className="flex flex-col items-start gap-2 mt-4 relative">
            <div className="flex items-center gap-2">
                <img src={clock} alt="clock" className="w-4 h-4" />
                <span className="text-gray-500">{label}</span>
                <span 
                    className="cursor-pointer text-[#4558C8] hover:underline"
                    onClick={handleSelectClick}
                >
                    {value ? new Date(value).toLocaleDateString() : "Seleccionar"}
                </span>
            </div>
            <input
                type="date"
                ref={dateInputRef} 
                value={value}
                onChange={(e) =>  onChange(e.target.value)}
                placeholder={placeholder}
                className="absolute top-0 left-0 w-40 opacity-0 pointer-events-none"
                style={{ transform: 'translateY(calc(-100% - 4px))' }}
            />
        </div>
    );
};

export default DatePickerInput;
