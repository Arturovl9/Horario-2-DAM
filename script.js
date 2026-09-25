/*
         * ¿QUÉ HACE ESTA FUNCIÓN?
         * La tabla de escritorio está organizada por FILAS = horas y
         * COLUMNAS = días. Esta función no inventa ningún dato nuevo:
         * simplemente "lee" esa misma tabla y reorganiza la información
         * al revés, agrupando por DÍA (para que en móvil cada día salga
         * junto, con todas sus horas debajo, en vez de mezclar los 5 días
         * en cada franja horaria).
         */
            function construirVistaMovilPorDia() {

                // 1) Cogemos la tabla real del HTML (la que ve el usuario en escritorio)
                const tabla = document.querySelector('.horario-table');

                // 2) Sacamos los nombres de los días desde la cabecera <th>.
                //    headerCells = [Hora, Lunes, Martes, Miércoles, Jueves, Viernes]
                //    Con .slice(1) quitamos "Hora" porque no es un día.
                const headerCells = [...tabla.querySelectorAll('thead th')];
                const dias = headerCells.slice(1).map(th => th.textContent.trim());
                // dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]

                // 3) Cogemos todas las filas de horario (<tr> dentro de <tbody>)
                //    y quitamos la fila de recreo con .filter().
                //    tr.classList.contains('recreo-row') -> true en la fila del recreo
                //    !... -> la negamos, así el .filter() la descarta
                const filas = [...tabla.querySelectorAll('tbody tr')]
                    .filter(tr => !tr.classList.contains('recreo-row'));

                // 4) Buscamos el <div> vacío donde vamos a construir la vista móvil
                //    y lo vaciamos por si la función se ejecuta más de una vez
                //    (por ejemplo, al redimensionar la ventana).
                const contenedor = document.getElementById('horario-movil');
                contenedor.innerHTML = '';

                // 5) BUCLE PRINCIPAL: recorremos cada día.
                //    "colIndex" es la posición del día dentro del array "dias"
                //    (Lunes = 0, Martes = 1, Miércoles = 2...). Lo necesitamos
                //    para saber qué columna de la tabla original le corresponde.
                dias.forEach((dia, colIndex) => {

                    // 5.1) Creamos el "bloque" del día (la tarjeta completa)
                    const bloque = document.createElement('div');
                    bloque.className = 'dia-bloque';

                    // 5.2) Le añadimos un título con el nombre del día (Lunes, Martes...)
                    const titulo = document.createElement('h2');
                    titulo.className = 'dia-titulo';
                    titulo.textContent = dia;
                    bloque.appendChild(titulo);

                    // 5.3) BUCLE INTERNO: recorremos cada fila de horario (cada hora)
                    //      para sacar la asignatura de ESTE día en ESA hora.
                    filas.forEach(tr => {
                        const celdas = tr.querySelectorAll('td');

                        // La primera celda (índice 0) siempre es la hora, ej: "15:30 16:25"
                        const hora = celdas[0].textContent.trim();

                        // La celda de la asignatura de este día está en la posición
                        // "colIndex + 1" porque la celda 0 es la hora, así que
                        // Lunes está en la 1, Martes en la 2, etc. (de ahí el +1)
                        const celdaAsignatura = celdas[colIndex + 1];

                        // Creamos la "franja" (una fila dentro de la tarjeta del día:
                        // hora a la izquierda, asignatura a la derecha)
                        const franja = document.createElement('div');
                        franja.className = 'franja';

                        // Copiamos la clase de asignatura (LMSGI, SOST, ED...) que ya
                        // tenía la celda original, para que el CSS pinte la franja
                        // con el mismo color que en la tabla de escritorio.
                        const claseAsignatura = [...celdaAsignatura.classList][0] || '';
                        if (claseAsignatura) franja.classList.add(claseAsignatura);

                        // Montamos el contenido visible de la franja: hora + asignatura.
                        // Usamos innerHTML (no textContent) porque las asignaturas
                        // llevan un <br> dentro (ej: "LMSGI <br> Andres Alcantará").
                        franja.innerHTML = `<span class="franja-hora">${hora}</span><span class="franja-asignatura">${celdaAsignatura.innerHTML}</span>`;

                        // Añadimos la franja terminada dentro del bloque del día
                        bloque.appendChild(franja);
                    });

                    // 5.4) Una vez añadidas todas las franjas de ese día,
                    //      añadimos el bloque completo al contenedor final.
                    contenedor.appendChild(bloque);
                });
            }

            // Se ejecuta una vez nada más cargar la página...
            construirVistaMovilPorDia();

            // ...y se vuelve a ejecutar cada vez que cambia el tamaño de la ventana
            // (por ejemplo, si giras el móvil o pasas de escritorio a móvil).
            window.addEventListener('resize', construirVistaMovilPorDia);
        
            /* =====================================================
            DATOS DE LOS EXÁMENES  <-- AQUÍ AÑADES TUS EXÁMENES
            La clave es la sigla (igual que la clase CSS de la asignatura).
            Formato de fecha: 'AAAA-MM-DD'. "hora", "tipo" y "notas" son opcionales.
            ===================================================== */
            const examenes = {
                AD: [
                    
                    
                ],
                DI: [
                    { fecha: '2026-10-13', hora: '16:25', titulo: 'Examen UT1 - Interfaces con editores visuales', tipo: 'Teórico-práctico' },
                    { fecha: '2026-11-10', hora: '16:25', titulo: 'Examen UT2 - Interfaces basadas en XML', tipo: 'Teórico-práctico' },
                    { fecha: '2026-12-01', hora: '16:25', titulo: 'Examen UT3 - Componentes visuales', tipo: 'Teórico-práctico' },
                    { fecha: '2026-13-15', hora: '16:25', titulo: 'Examen Final', tipo: 'Teórico-práctico' },
                    { fecha: '2027-01-26', hora: '16:25', titulo: 'Examen UT4 - Usabilidad de interfaces', tipo: 'Teórico-práctico' },
                    { fecha: '2027-02-16', hora: '16:25', titulo: 'Examen UT5 - Informes y Final', tipo: 'Teórico-práctico' }
                ],
                IPGS: [
                    { fecha: '2026-10-14', hora: '15:30', titulo: 'Presentación', tipo: 'Presentación hasta donde se lleve' },
                    { fecha: '2026-11-18', hora: '15:30', titulo: 'Presentación', tipo: 'Presentación hasta donde se lleve' },
                    { fecha: '2026-12-09', hora: '15:30', titulo: 'Presentación', tipo: 'Presentación hasta donde se lleve' }
                ],
                'IPE-II': [],
                PMDM: [
                    { fecha: '2026-10-21', hora: '17:20', titulo: 'Examen UT1 - Tecnologías móviles', tipo: 'Teórico-práctico' },
                    { fecha: '2026-11-18', hora: '17:20', titulo: 'Examen UT2 - Interfaz y eventos en Android', tipo: 'Teórico-práctico' },
                    { fecha: '2026-12-09', hora: '17:20', titulo: 'Examen UT3 - Persistencia de datos', tipo: 'Teórico-práctico' },
                    { fecha: '2026-13-16', hora: '17:20', titulo: 'Examen Final', tipo: 'Teórico-práctico' },
                    { fecha: '2027-01-27', hora: '17:20', titulo: ['Examen UT4 - Imagen y Audio en Android', 'UT5 - Geolocalización'], tipo: 'Teórico-práctico' },
                    { fecha: '2027-02-17', hora: '17:20', titulo: 'Examen UT6 y Final', tipo: 'Teórico-práctico' }                    
                ],
                PSP: [],
                PI: [
                    { fecha: '2026-10-01', hora: '17:20', titulo: 'Examen UT1 - ¿Qué es un Proyecto?', tipo: 'Teórico-práctico' },

                ],
                OPT: [],
                SGE: []
            };

            /* Nombre completo y profesor de cada módulo */
            const modulos = {
                IPGS:     { nombre: 'Inglés profesional GS', profesor: 'Alexandra Gámez Villegas' },
                'IPE-II': { nombre: 'Itinerario personal para la empleabilidad II', profesor: 'María Lourdes Galeano Criado' },
                SGE:      { nombre: 'Sistemas de gestión empresarial', profesor: 'Jaime Pérez Cano' },
                AD:       { nombre: 'Acceso a datos', profesor: 'Rafael Arilla Blázquez' },
                PSP:      { nombre: 'Programación de servicios y procesos', profesor: 'Rafael Arilla Blázquez' },
                DI:       { nombre: 'Desarrollo de interfaces', profesor: 'José Alberto Cañete Roldán' },
                PMDM:     { nombre: 'Programación multimedia y dispositivos móviles', profesor: 'José Alberto Cañete Roldán' },
                PI:       { nombre: 'Proyecto Intermodular', profesor: 'Santiago Martín Palomo García' },
                OPT:      { nombre: 'Optativa - Desarrollo Aplicaciones Web con Angular', profesor: 'Santiago Martín Palomo García' }
            };

            /* Evita que un texto con < o & rompa el HTML */
            function escaparHTML(texto) {
                const d = document.createElement('div');
                d.textContent = texto;
                return d.innerHTML;
            }

            /* '2026-10-20' -> 'martes, 20 de octubre de 2026' */
            function formatearFecha(iso) {
                const [a, m, d] = iso.split('-').map(Number);
                return new Date(a, m - 1, d).toLocaleDateString('es-ES', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                });
            }

            function abrirPopup(sigla) {
                const modulo = modulos[sigla];
                if (!modulo) return;

                document.getElementById('popup-titulo').textContent = `${sigla} · ${modulo.nombre}`;
                document.getElementById('popup-profesor').textContent = `Profesor/a: ${modulo.profesor}`;

                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);

                // Copiamos y ordenamos por fecha (los más próximos primero)
                const lista = [...(examenes[sigla] || [])].sort((a, b) => a.fecha.localeCompare(b.fecha));
                const cont = document.getElementById('popup-examenes');

                if (lista.length === 0) {
                    cont.innerHTML = '<p class="sin-examenes">No hay exámenes añadidos para esta asignatura.</p>';
                } else {
                    cont.innerHTML = '<ul class="lista-examenes">' + lista.map(ex => {
                        const [a, m, d] = ex.fecha.split('-').map(Number);
                        const pasado = new Date(a, m - 1, d) < hoy;
                        return `
                            <li class="examen ${pasado ? 'pasado' : ''}">
                                <strong>${[].concat(ex.titulo).map(escaparHTML).join('<br>')}</strong>
                                <span class="examen-fecha">${formatearFecha(ex.fecha)}${ex.hora ? ' · ' + escaparHTML(ex.hora) : ''}</span>
                                ${ex.tipo ? `<span class="examen-tipo">${escaparHTML(ex.tipo)}</span>` : ''}
                                ${ex.notas ? `<span class="examen-notas">${escaparHTML(ex.notas)}</span>` : ''}
                                ${pasado ? '<span class="examen-tag">Realizado</span>' : ''}
                            </li>`;
                    }).join('') + '</ul>';
                }

                document.getElementById('overlay').style.display = 'flex';
            }

            function cerrarPopup() {
                document.getElementById('overlay').style.display = 'none';
            }

            // Cerrar con la tecla Escape
            document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarPopup(); });
