export default function InputComponent({  label,
  placeholder,
  onChange,
  value,
  type,}){

    return(
        <div className="relative">
            <p className="py-0 px-2 absolute -mt-3 mr-0 ml-2 mb-0 font-medium text-gray-600 bg-white">
                {label}
            </p>
            <input placeholder={placeholder} type={type || 'text'} value={value} onChange={onChange} className="border placeholder-gray-400 focus:outline-none focus:border-black w-full p-4 mx-0 mt-0 text-base block bg-white border-gray-300 rounded-md" />
        </div>
    )
}

/*
If you set a value prop without an onChange prop, the input field will become read-only. This happens because React blocks native browser typing behavior to ensure that the visual text never drifts from the assigned state variable. You must use onChange to explicitly update that state as the user types
*/