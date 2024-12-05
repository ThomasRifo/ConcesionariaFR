import { Head, Link } from '@inertiajs/react';
import NavbarClient from '@/Layouts/NavbarClient';
import Footer from '@/Layouts/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules'; // Importa módulos necesarios
import 'swiper/css'; // Estilos básicos
import 'swiper/css/navigation'; // Estilos para navegación
import 'swiper/css/pagination'; // Estilos para paginación

export default function Welcome({ vehiculos }) {
    return (
        <>
            <Head title="Vehículos" />
            <NavbarClient />
            
            {/* Banner principal */}
            <div className="relative h-2/3 h-[76vh] overflow-hidden">
                <img 
                    src="https://autocity.com.ar/wp-content/uploads/2022/01/autocity-seis-marcas.jpeg" 
                    className="w-full -mt-24 object-cover" 
                    alt="Imagen de autos"
                />
                <div className="absolute top-[42%] left-24 transform -translate-y-1/2 text-white text-3xl md:text-4xl font-semibold">
                    <p className="mb-4">Tu próximo auto, cada vez más cerca</p>
                </div>
                <div className="absolute top-[60%] left-24 transform -translate-y-1/2 text-white text-xl md:text-3xl font-semibold">
                    <p>Encontrá el auto</p>
                    <p>perfecto para vos</p>
                    <p>en nuestra variedad de vehículos</p>
                </div>
            </div>

            <Link
                href={route("vehiculos.index")}
            >
            <div className="w-full px-0 mt-12">
                <div className="relative">
                <img 
                    src="https://assets.static-gm.com/Assets/4094fc05-4ebc-4a4e-8773-5114c565dc62/52cc8a00-df9a-4138-a657-c121052cfa48/v-1697675985/Desktop.webp" 
                    className="w-full px-80 -mt-26 object-cover" 
                    alt="Imagen de autos"
                />
                </div>
            </div>
            </Link>

            <div className="container mx-auto my-12 px-4">
            <h2 className="text-4xl mb-12 text-center font-autocity">Nuestros Vehiculos Destacados</h2>
                <Swiper
                    modules={[Navigation, Pagination]} // Activa módulos
                    spaceBetween={30} // Espacio entre slides
                    slidesPerView={4} // Slides visibles
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                    }}
                    navigation // Habilita botones de navegación
                    pagination={{ clickable: true }} // Habilita paginación
                >
                    
                    {vehiculos.map((vehiculo) => (
                        <SwiperSlide key={vehiculo.id}>
                            <div className="border rounded-lg shadow-lg overflow-hidden bg-white">
                                <img
                                    src={`/storage/${vehiculo.imagenes[0]?.urlImagen || 'default-image.jpg'}`}
                                    alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4 text-center">
                                    <h3 className="text-2xl font-bold mb-2">
                                        {vehiculo.marca} {vehiculo.modelo}
                                    </h3>
                                    <p className="text-black-600 font-bold text-2xl mt-4">
                                        {new Intl.NumberFormat('es-AR', {
                                            style: 'currency',
                                            currency: 'ARS',
                                            maximumFractionDigits: 0,
                                        }).format(vehiculo.precio)}
                                    </p>
                                    <Link
                                        href={route("vehiculo.show", {
                                            marca: vehiculo.marca,
                                            modelo: vehiculo.modelo,
                                            anio: vehiculo.anio,
                                        })}
                                        className="block"
                                    >
                                        <button className="bg-white text-black border border-black w-full mt-4 p-3 rounded transition-all duration-300 hover:bg-black hover:text-white">
                                            Ver Detalles
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <Footer></Footer>
        </>
    );
}
