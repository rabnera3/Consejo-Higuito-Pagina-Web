import { MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

// Animation helpers
const FadeIn = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={className}
  >
    {children}
  </motion.div>
);

const Stagger = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={{
      visible: { transition: { staggerChildren: 0.1 } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const municipios = [
  {
    nombre: 'Cucuyagua',
    imagen: new URL('../img/municipios/cucuyagua.webp', import.meta.url).href,
    color: 'green',
    historia: 'Cucuyagua era un pequeño pueblo indios, existen listados de 1,580 de los indios que pagaban tributo al rey, los títulos de los elegidos fueron extendidos en 1,754 por Don Carlos de Castillo, Rey de León y archiduque de Australia. En el recuerdo de población de 1,791 aparece como pueblo del curato de Sensenti, en la División Política Territorial de 1,889 ya figuraba como distrito.\n\nCucuyagua aparece como los primeros municipios fundados en el occidente del país, habiendo pertenecido hasta 1,898 al departamento de Lempira en el año 1,700 La villa de Cucuyagua contaba con 19 familias de españoles y otros orígenes Chorti; se cree que fue creada por los años 1,600 cuando los españoles llegaron ya existía Cucuyagua, es uno de los municipios más antiguos en el occidente del país. Todos los pueblos que los españoles fundaron sembraron un árbol de Ceiba el cual fue destruido por personas ignorantes. Cucuyagua, su nombre autóctono quiere decir canto de palomas y mucha agua arrullada por el río Catapa y río grande, otro origen del nombre es Cocohuacan, lugar que tiene negocios.',
  },
  {
    nombre: 'Dulce Nombre',
    imagen: new URL('../img/municipios/dulce_nombre.webp', import.meta.url).href,
    color: 'blue',
    historia: 'Dulce Nombre de María es un municipio con una población predominantemente mestiza y descendencia indígena (Chortí y español). Fue fundado a mediados del siglo XIX durante la época colonial bajo la jurisdicción de la intendencia de Gracias a Dios. Las primeras familias que se establecieron eran inmigrantes de Chalatenango, República del Salvador, quienes se ubicaron en el sitio denominado las cáscaras, al sur de la actual cabecera.\n\nEn el año de 1887 tenía el nombre de Las Cascara, en 1907 por acuerdo del poder ejecutivo, a iniciativa del Lic. Jerónimo J. Reina, se elevó a categoría de municipio, separándola de Santa Rosa de Copán, el 1ero. De agosto de 1928 es cabecera del Distrito Departamental de, el 12 de noviembre de 1940 forma parte del Distrito Departamental de Santa Rosa de Copán, 1943 se pide la segregación del municipio y el 5 de marzo de 1953 fue elevado a categoría de ciudad.',
  },
  {
    nombre: 'Dolores Copán',
    imagen: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop',
    color: 'teal',
    historia: 'A principio del XIX, estas tierras eran montañosas, habitadas por muchos indios de pueblos vecinos, quienes atraídos por su fertilidad empezaron a poblarlos y cultivar el tabaco; Estos vivían sin reconocer autoridad ninguna y no recibían los sacramentos; por ser posibles de reunirlos.\n\nCon el cultivo del tabaco es Santa Rosa de Copán, en el año de 1793 se desplazaron familias descendientes de los criollos españoles y ladinos (mestizos) a las tierras del hoy municipio de Dolores. En la actualidad, según los pobladores, se dejó de cultivar el tabaco ya que por su producción las tierras estaban envenenadas con químicos perjudiciales a la salud y se redujo la productividad.\n\nDon Pedro Pineda, vicario de Quezailica, juntos con otras autoridades de Santa Rosa de Copán solicitó al gobernador de Honduras, Don Juan Antonio Tornos, Brigadier de los reales ejércitos, quien residía en Comayagua, que se fundara un pueblo con el nombre de Pueblo Nuevo de Dolores en el año de 1813, con 48 familias. Los primeros habitantes de este municipio en su mayoría eran descendientes de la etnia Chortí, quienes se desplazaron a este territorio para el uso de nuevas tierras para la agricultura. Su título ejidal fue extendido el 16 de enero de 1866. Oficialmente, el 11 de abril de 1919 se creó el municipio de Dolores Copán, bajo el siguiente acuerdo.',
  },
  {
    nombre: 'Belén Gualcho',
    imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    color: 'amber',
    historia: 'El municipio de Belén Gualcho, está comprendido dentro del Departamento de Ocotepeque, en la zona occidental de nuestro país, situado a 82 Kms de la cabecera departamental, Belén Guacho, anteriormente recibió el nombre de Kuricunque, que significa lugar de las casas, en el recuentro de población, del año de 1791, aparecía como cabecera Curato de Gualcho, después paso a formar parte de Copan, con el nombre Belén de Copan o Belén de Occidente y el 2 de Septiembre de 1,907, paso a ser parte del departamento de Ocotepeque y el 15 de febrero de 1,922, recibe el nombre de Belén Gualcho, que en el lenguaje Lenca, significa lugar de muchas aguas, fue constituido como municipio desde el año 1,871, siendo su primer alcalde Don Juan Francisco Sánchez, en 1,873 se postula su siguiente alcalde llamado Dionisio Vásquez, Belén Gualcho, tiene una elevación de 1660 metros sobre nivel del mar.\n\nBelén Gualcho, se localiza al sur del pico las minas, sobre las colinas más altas de la montaña del Celaque y su principal cuenca hidrográfica, la constituyen los ríos Rancho y Zopilote, la vegetación es variada, con bosques de conífera y también latí. Foliado con predomino de árboles de roble, pino, cedro, mal cinco y liquidámbar, el municipio de Belén Gualcho, Ocotepeque es netamente Lenca, reconocido internacionalmente, por sus parajes y sus sitios turísticos que se encuentran dentro del pueblo, con el encanto y la belleza natural que se cuenta.',
  },
  {
    nombre: 'Veracruz',
    imagen: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
    color: 'purple',
    historia: 'Antiguamente el Municipio de Veracruz, Copán se llamaba "QUETUNA" la cual era aldea del Municipio de San José Copán. Según algunas personas el nombre surgió desde que un hombre adinerado, político y famoso pasó cabalgando en su caballo negro por el camino real que conducía a la ciudad de Santa Rosa de Copán. El hombre del cual se desconoce el nombre hizo una pausa justamente al principio de un camino en el cual había dos plantas de TUNA que se entrelazaban formando un arco, el hombre inspirado por la belleza de las tunas exclamó: ¡QUETUNA! y de allí surgió el nombre "Quetuna".\n\nEntre sus primeros pobladores están las familias: Tabora, Archila, castellano y Figueroa. Además, se cuenta que estas personas llegaron a poseer mucho dinero el cual dejaron bajo tierra, ya que no había manera distinta de guardarlo, la historia cuenta que el dinero lo sacaban periódicamente colocado en cueros de vaca a tomar el sol, para que soltara el moho, ya que en esos tiempos no había gran oferta de productos y servicios como para tener en que invertir el dinero, por lo cual se les amontonaba.\n\nTiempo después, el dos ( 2 ) de junio del año mil novecientos dos ( 1902 ) la comunidad de Quetuna recibió el título de Municipio con el nombre de: "Veracruz de Quetuna", el nombre de Veracruz, surgió por la tradición que aún se practica de subir al cerro denominado ¨ El Cielito ¨ para bañar una cruz que se encuentra en ese sitio, actividad que se realiza el tres de mayo de cada año, fecha en que se celebra la feria patronal del Municipio.',
  },
  {
    nombre: 'Corquin',
    imagen: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop',
    color: 'green',
    historia: 'Los primeros pobladores del territorio que pertenece ahora al municipio de Corquín eran descendientes de los toltecas, originarios de México, quienes se radicaron en los márgenes del río Jopopo a mediados del siglo XVII y fueron estos quienes le dieron el nombre de Corquín, que en su lengua significaba ¨Tierra entre Aguas¨ . Posteriormente se extendieron a orillas del rió Julalgua y la quebrada de San Francisco a finales del siglo XVII.\n\nA principios del siglo XVIII se establecieron en el mismo sitio algunas tribus de origen Lencas y Chorotegas que provenían centro y sur del país. Corquín perteneció como aldea al Curato ó Parroquia de Sensenti, la cual también pertenecía a la Diócesis de Gracias, hoy departamento de Lempira. A finales del siglo IX surgieron dos grupos poblacionales en la misma comunidad: los nativos y el barrio de los ladinos; los primeros se dedicaban a la agricultura y los segundos dieron comienzo a las actividades comerciales.\n\nEn el año de 1824 obtuvo carácter del Municipio bajo el Gobierno Federal del General Manuel José Arce; siendo su primer alcalde el señor "VICTORIANO FUENTES ", contando con una extensión territorial de 92 km2; y se le otorga el título de Ciudad el 13 de marzo de 1926.',
  },
  {
    nombre: 'San Pedro Copán',
    imagen: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop',
    color: 'blue',
    historia: 'Antiguamente, el lugar donde está asentado el casco urbano de San Pedro de Copán, se llamaba Llano Grande, siendo una aldea de Cucuyagua, habitada por familias que habían inmigrado de Comayagua atraídos por el tipo de suelo que en ese tiempo era muy bueno para el cultivo de tabaco.\n\nLos primeros habitantes fueron los señores José María Romero, Pedro Romero, Hilario Alvarado, Juan Alvarado, Angélica Quijada, Severino Quijada. Una de las primeras viviendas construidas fue de don Hilario Alvarado. El 19 de mayo de 1887 se elevó a la categoría de municipio con el nombre "San Pedro Llano Grande" con terreno desmembrado de Cucuyagua y el primero de enero de 1888 fue inaugurado el nuevo municipio con la instalación de la primera por la primera Corporación Municipal; en ese mismo año se construye e inaugura la Iglesia Católica.',
  },
  {
    nombre: 'La Unión',
    imagen: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    color: 'teal',
    historia: 'Los primeros pobladores del municipio vinieron de Sensenti, Ocotepeque para dedicarse a la agricultura en vista de las buenas tierras de vega existentes. A este lugar primero se le llamo Malsinca, cuando era una pequeña aldea y a medida que fue creciendo la población, pensando que debía existir la unidad entre los vecinos, decidieron llamarle "La Unión". Este municipio fue creado por acuerdo extendido el 14 de noviembre de 1894 por la Gobernación Política del Departamento de Copan, con sede en Santa Rosa de Copan, que en esos entonces tenían potestad constitucional para tomar este tipo de decisiones. En ese período fungía como presidente de la República el Doctor Policarpo Bonilla.\n\nLa Gobernación Política en uso de sus facultades de conformidad con el Articulo No. 82 de La Constitución de la República, y los incisos 2 y 5 de La Ley de Municipalidades acordó que el vecindario de La Unión se proclama municipio, independizándose de Cucuyagua, al cual ha pertenecido y se compondrá de las comunidades de la Unión,  El  Coyolito,  San  Andrés, Jualgipa y La Arena, siendo la Unión la cabecera  municipal.',
  },
  {
    nombre: 'San José de Copán',
    imagen: 'https://images.unsplash.com/photo-1518623001395-125242310d0c?w=800&h=600&fit=crop',
    color: 'amber',
    historia: 'A raíz del atentado criminal en contra del primer Jefe de Estado, en ese entonces don Dionisio de Herrera, fue acusado como actor intelectual el Vicario General de Honduras el sacerdote Nicolás Irías, al ser perseguido en Comayagua, capital del Estado de Honduras, emigro hacia la capital de Centro América, en ese entonces Guatemala, perdiéndose en el camino descubrió el caserío Boca del Monte, lo que hoy se conoce como San José de Copán, siendo éste uno de los pasajes de la historia que involucra a los primeros pobladores.\n\nEntre los habitantes que se reconocen a finales del siglo XIX están Cirilo, Julián y Carmelo, todos de apellido Claros, quienes llegaron procedente de Quezailica a finales de 1890 en la administración del General Luís Bográn. El municipio fue creado, y ascendida la cabecera a categoría de Villa de San José, el 19 de enero de 1939, por decreto legislativo No. 355, siendo el primer alcalde municipal el Sr. Adolfo Rodríguez, posteriormente en la administración del presidente Juan Manuel Gálvez se le concede el título de ciudad, mediante decreto No. 109, Articulo Único, de fecha 1 de marzo de 1954, siendo el Alcalde Municipal don José María Zerón.',
  },
  {
    nombre: 'Talgua Lempira',
    imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    color: 'purple',
    historia: 'Talgua fue fundada en tiempos de la colonia, en el siglo XVI, en el lugar que ocupa la aldea de Mercedes, es uno de los Municipios más antiguos, siendo este un centro de operaciones en tiempo de los Españoles; cuando don Pedro de Alvarado paso por estas tierras ya existía un gran número de chozas indígenas, posteriormente fue trasladado al lugar donde hoy se encuentra, mediante resolución Nº 9 el 02 de enero de 1963, que expresaba lo siguiente: "Vistas con sus antecedentes que en diferentes fechas a partir del año 1941 hasta la fecha han venido elevando a la consideración del supremo poder ejecutivo los vecinos del pueblo de Talgua, departamento de Lempira, en su mayoría, contraídas a pedir que se resuelva el traslado de la cabecera del expresado municipio del lugar donde actualmente se encuentra o sea en Talgua, a la aldea de San Antonio de Pedernales, actualmente San Ramón, Lempira.\n\nSegún resolución Nº 25 en 1965, nuevamente se traslada a Talgua. Resolución Nº 3 Presidencia de la República, Tegucigalpa M.D.C. 13 de Julio de 1965 vista la resolución Nº 25 del 26 de febrero de1963 emitida por el Consejo de Ministros en ejercicio de la Presidencia de la República, sustituyendo el nombre de San Antonio de Pedernales cabecera del Municipio de Talgua, en el departamento de Lempira, por el de San Ramón y trasladando la cabecera del mismo municipio al último lugar citado.',
  },
  {
    nombre: 'San Agustín Copán',
    imagen: 'https://images.unsplash.com/photo-1601656414439-386f85289a53?w=800&h=600&fit=crop',
    color: 'green',
    historia: 'Hasta las primeras décadas del siglo XX, San Agustín era una aldea municipio de Santa Rosa, del Departamento de Copán, que se llamada La Boca del Monte del Gallinero. Se le dio la categoría de municipio por primera vez el día 6 de mayo de 1930, pero por no reunir los requisitos para conservarse como tal perdió la categoría de municipio quedando nuevamente como aldea en el año de 1941 y en el año de 1957, queda nuevamente declarada oficialmente como municipio.\n\nLas primeras familias en habitar el territorio de este municipio eran de apellido Rodríguez, López, Fuentes y Contreras quienes se ubicaron en la aldea Pueblo Nuevo, hoy conocida como aldea El Descansadero, luego empezaron a expandirse hacia Granadillal y Cerro Negro. En cuanto al casco urbano los primeros pobladores se ubicaron en el barrio El Cerro del Perico hoy conocido como barrio Santa Teresa.',
  },
  {
    nombre: 'Trinidad Copán',
    imagen: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&h=600&fit=crop',
    color: 'blue',
    historia: 'Sobre la creación de Trinidad no se tiene conocimiento oficial de la existencia de un decreto que sustente con exactitud cuando se llevó a cabo tal nombramiento, Pero se supone que está entre la documentación existente en la actual Ciudad de Gracias, en el Departamento de Lempira.\n\nSe estableció como municipio desde el año de 1,822 cuando el departamento de Copan pertenecía a la intendencia de los confines de Gracias a Dios y el año de 1,836 se dio el título ejidos comprendidos entre, Cerro Azul y Esquines. Primeros Habitantes: Señor: Purificación Alvarado de origen español, el trabajó la semilla de tabaco a Copán y fundó un beneficio de añil, le siguió Gerardo Larios, Macario Orellana Laureano Caballero y Sotero Barahona',
  },
  {
    nombre: 'Santa Rosa de Copán',
    imagen: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop',
    color: 'teal',
    historia: 'Santa Rosa de Copán fue fundada durante el siglo. XVIII llamándose primeramente Los Llanos. En 1705 el capitán español don Juan García de la Candelaria compro el sitio de «Los Llanos», con el fin de ubicar su hacienda. Para 1803 se había terminado de construir la Catedral de Santa Rosa de Copán para denominarse parroquia; pero, no fue hasta en 1812 que se le otorgó el título de municipio; por lo cual, pasó a rebautizarse como «Los Llanos» de Santa Rosa en honor de la patrona la virgen Santa Rosa de Lima.\n\nPara 1823 fue nombrada con otro título el de «Villa Nacional de Santa Rosa» mediante Decreto No. 53 de la Asamblea Nacional Constituyente de las Provincias Unidas de Centro América. Habiendo recibido el título de ciudad en 1843, se procedió a la delimitación territorial en fecha 9 de enero de 1844, de la siguiente forma: «Barrio El Calvario», «Barrio Santa Teresa», «Barrio Mercedes» y «Barrio El Carmén». Santa Rosa, en varias ocasiones capital de Honduras y en 1862, siendo presidente el señor don Victoriano Castellanos Cortés nativo de esta población, cuando la Cámara Legislativa reunida en ésta ciudad, emitiese el Decreto No. 3 de fecha 7 de mayo de 1862; en el cual, el país se denominaría como «República de Honduras» dejando de llamarse «Estado de Honduras». Seguidamente en 1869 recibió el nuevo título de ciudad y se le cambió el nombre a Santa Rosa de Copán.\n\nLa importancia de Santa Rosa de Copán se remonta a los tiempos de la colonia española esta ciudad siempre fue considerada como capitalista dentro de la Capitanía General de Guatemala y la Intendencia de Comayagua ya que en sus alrededores se cultiva, produce y distribuía un tabaco de una gran alta calidad a través de La Real Factoría de Tabacos de Los Llanos fundada en 1795. Con el paso de tiempo, Santa Rosa ha prosperado y ha diversificado sus actividades comerciales. Se le dio la categoría de municipio en el año de 1802, desligándose de Quezailica.',
  },
];

export default function SociosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header con gradiente y blobs */}
      <div className="relative bg-gradient-to-b from-green-50 to-white overflow-hidden">
        {/* Blobs decorativos */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200/40 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <FadeIn className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Nuestros Socios
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              En el Consejo Intermunicipal Higuito contamos con 15 municipios socios con los que trabajamos de la mano para promover el desarrollo comunitario en las zonas de intervención de los proyectos ejecutados por la mancomunidad, fortaleciendo capacidades humanas e institucionales.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <Stagger className="space-y-20">
          {municipios.map((municipio, index) => {
            const isEven = index % 2 === 0;
            const colorClasses = {
              green: 'bg-green-600',
              blue: 'bg-blue-600',
              teal: 'bg-teal-600',
              amber: 'bg-amber-600',
              purple: 'bg-purple-600',
            };

            return (
              <motion.div
                key={municipio.nombre}
                variants={itemVariant}
                className="grid md:grid-cols-2 gap-8 items-start"
              >
                {/* Imagen */}
                <div
                  className={`${isEven ? 'order-1 md:order-1' : 'order-1 md:order-2'
                    } rounded-2xl overflow-hidden shadow-lg`}
                >
                  <ImageWithFallback
                    src={municipio.imagen}
                    alt={`${municipio.nombre} - Municipio socio del CIH`}
                    className="w-full h-[280px] md:h-[320px] object-cover"
                  />
                </div>

                {/* Contenido */}
                <div
                  className={`${isEven ? 'order-2 md:order-2' : 'order-2 md:order-1'
                    } flex flex-col`}
                >
                  {/* Header del municipio */}
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className={`p-3 rounded-xl ${colorClasses[municipio.color as keyof typeof colorClasses]
                        } text-white shadow-lg flex-shrink-0`}
                    >
                      <MapPin className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                      {municipio.nombre}
                    </h2>
                  </div>

                  {/* Historia - solo primer párrafo */}
                  <div className="text-gray-700 leading-relaxed">
                    <p className="text-base md:text-lg">
                      {municipio.historia.split('\n\n')[0]}
                    </p>
                    {municipio.historia.split('\n\n').length > 1 && (
                      <details className="mt-4 group">
                        <summary className="cursor-pointer text-green-600 font-semibold hover:text-green-700 transition-colors list-none flex items-center gap-2">
                          <span>Leer más</span>
                          <svg
                            className="w-5 h-5 transition-transform group-open:rotate-180"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </summary>
                        <div className="mt-4 space-y-4 text-gray-700">
                          {municipio.historia
                            .split('\n\n')
                            .slice(1)
                            .map((parrafo, i) => (
                              <p key={i} className="text-base md:text-lg">
                                {parrafo}
                              </p>
                            ))}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </div>
  );
}
