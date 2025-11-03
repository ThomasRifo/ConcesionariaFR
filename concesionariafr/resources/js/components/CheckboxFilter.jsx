const CheckboxFilter = ({ title, options, selectedOptions, setSelectedOptions }) => {
    const handleCheckboxChange = (e) => {
        const value = e.target.value;
        setSelectedOptions(prevSelected =>
            prevSelected.includes(value)
                ? prevSelected.filter(item => item !== value)
                : [...prevSelected, value]
        );
    };

    return (
        <div className="mb-4">
            <h5 className="font-medium">{title}</h5>
            {options.map((option) => (
                <div key={option} className="flex items-center">
                    <input
                        type="checkbox"
                        value={option}
                        onChange={handleCheckboxChange}
                        checked={selectedOptions.includes(option)}
                        className="mr-2"
                    />
                    <label>{option}</label>
                </div>
            ))}
        </div>
    );
};

export default CheckboxFilter;