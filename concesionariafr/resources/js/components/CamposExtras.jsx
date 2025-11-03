import React from 'react';
import TextInput from '@/Components/TextInput';

const CamposExtras = ({ data, setData, errors }) => {
    return (
        <>
            {/* Campos nuevos de Auto.dev - Información adicional */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">País de Origen</label>
                    <TextInput
                        value={data.pais_origen}
                        onChange={(e) => setData('pais_origen', e.target.value)}
                        className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ej: Mexico, USA"
                    />
                    {errors.pais_origen && <span className="text-red-500 text-sm">{errors.pais_origen}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Motor</label>
                    <TextInput
                        value={data.tipo_motor}
                        onChange={(e) => setData('tipo_motor', e.target.value)}
                        className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ej: V8, V6, 4-Cylinder"
                    />
                    {errors.tipo_motor && <span className="text-red-500 text-sm">{errors.tipo_motor}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Cilindrada</label>
                    <TextInput
                        value={data.cilindrada}
                        onChange={(e) => setData('cilindrada', e.target.value)}
                        className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ej: 5.3L, 2.0L"
                    />
                    {errors.cilindrada && <span className="text-red-500 text-sm">{errors.cilindrada}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Potencia</label>
                    <TextInput
                        value={data.potencia}
                        onChange={(e) => setData('potencia', e.target.value)}
                        className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ej: 355 hp, 200 CV"
                    />
                    {errors.potencia && <span className="text-red-500 text-sm">{errors.potencia}</span>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Número de Puertas</label>
                    <TextInput
                        type="number"
                        value={data.num_puertas}
                        onChange={(e) => setData('num_puertas', e.target.value)}
                        className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ej: 2, 4, 5"
                    />
                    {errors.num_puertas && <span className="text-red-500 text-sm">{errors.num_puertas}</span>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Detalles / Estilo</label>
                <textarea
                    value={data.detalles}
                    onChange={(e) => setData('detalles', e.target.value)}
                    className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    rows="3"
                    placeholder="Ej: 4x4 4dr Crew Cab 5.8 ft. SB"
                    maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1">{data.detalles?.length || 0}/300 caracteres</p>
                {errors.detalles && <span className="text-red-500 text-sm">{errors.detalles}</span>}
            </div>
        </>
    );
};

export default CamposExtras;


