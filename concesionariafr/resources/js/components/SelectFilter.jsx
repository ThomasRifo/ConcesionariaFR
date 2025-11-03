const SelectFilter = ({ title, options, selectedValue, setSelectedValue }) => {
    return (
        <div className="mb-4">
            <h5 className="font-medium">{title}</h5>
            <select
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value || "")}
                className="w-full p-2 border border-gray-300 rounded-md"
            >
                <option value="">Todas</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.tipo}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectFilter;