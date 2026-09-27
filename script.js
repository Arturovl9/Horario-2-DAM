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
                const contenedor = document.getElementById('horario-movil');

                // Si esta página no tiene tabla de horario o contenedor móvil
                // (por ejemplo, "Asignatura/Siglas" o "Calendario Exámenes"),
                // no hacemos nada. Sin este "return", el script se paraba
                // aquí con un error y todo el código de después (modulos,
                // examenes, abrirPopup...) nunca llegaba a ejecutarse.
                if (!tabla || !contenedor) return;

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

                // 4) Vaciamos el contenedor por si la función se ejecuta más
                //    de una vez (por ejemplo, al redimensionar la ventana).
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

            /* =====================================================
               DATOS DE LOS EXÁMENES
               Esta es la ÚNICA lista de exámenes de código: se usa tanto
               para el popup de cada asignatura (Asignatura/Siglas) como
               para colocar los bloques en el Calendario de Exámenes
               (la función "cargarExamenesDelCodigo()", más abajo en este
               mismo archivo, los coloca sola).
               Para añadir, cambiar o borrar un examen basta con editarlo
               aquí; no hace falta tocar nada más.
               ===================================================== */
            const examenes = {
                AD: [],
                DI: [
                    { fecha: '2026-10-21', hora: '16:25', titulo: 'Examen Tema 1 - Interfaces con editores visuales', tipo: 'Teórico-práctico' },
                    { fecha: '2026-11-18', hora: '16:25', titulo: 'Examen Tema 2 - Interfaces basadas en XML', tipo: 'Teórico-práctico' },
                    { fecha: '2026-12-09', hora: '16:25', titulo: 'Examen Tema 3 - Componentes visuales', tipo: 'Teórico-práctico' },
                    { fecha: '2026-12-16', hora: '16:25', titulo: 'Examen Final (Tema 1, 2 y 3)', tipo: 'Teórico-práctico' },
                    { fecha: '2027-01-27', hora: '16:25', titulo: 'Examen Tema 4 - Usabilidad de interfaces', tipo: 'Teórico-práctico' },
                    { fecha: '2027-02-17', hora: '16:25', titulo: 'Examen Tema 5 - Informes y Final', tipo: 'Teórico-práctico' }
                ],
                IPGS: [
                    { fecha: '2026-10-14', hora: '15:30', titulo: 'Presentación', tipo: 'Presentación hasta donde se lleve' },
                    { fecha: '2026-11-18', hora: '15:30', titulo: 'Presentación', tipo: 'Presentación hasta donde se lleve' },
                    { fecha: '2026-12-09', hora: '15:30', titulo: 'Presentación', tipo: 'Presentación hasta donde se lleve' }
                ],
                'IPE-II': [],
                PMDM: [
                    { fecha: '2026-10-13', hora: '17:20', titulo: 'Examen Tema 1 - Tecnologías móviles', tipo: 'Teórico-práctico' },
                    { fecha: '2026-11-10', hora: '17:20', titulo: 'Examen Tema 2 - Interfaz y eventos en Android', tipo: 'Teórico-práctico' },
                    { fecha: '2026-12-01', hora: '17:20', titulo: 'Examen Tema 3 - Persistencia de datos', tipo: 'Teórico-práctico' },
                    { fecha: '2026-12-15', hora: '17:20', titulo: 'Examen Final (Tema 1, 2 y 3)', tipo: 'Teórico-práctico' },
                    { fecha: '2027-01-26', hora: '17:20', titulo: 'Examen Tema 4 - Imagen y Audio en Android Tema 5 - Geolocalización', tipo: 'Teórico-práctico' },
                    { fecha: '2027-02-16', hora: '17:20', titulo: 'Examen Tema 6 - Desarrollo de juegos con Unity y Final', tipo: 'Teórico-práctico' }
                ],
                PSP: [],
                PI: [
                    { fecha: '2026-10-01', hora: '17:20', titulo: 'Examen Tema 1 - ¿Qué es un Proyecto?', tipo: 'Teórico-práctico' }
                ],
                OPT: [
                    { fecha: '2026-10-02', hora: '15:30', titulo: 'Examen Tema 1 - Introducción a TypeScript y Primeros Pasos', tipo: 'Teórico' }
                ],
                SGE: []
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

            /* El popup muestra el nombre completo del módulo, el profesor/a,
               la lista de exámenes de esa asignatura y una franja de color
               en la cabecera igual al color que esa asignatura tiene en
               el horario (variable --SIGLA de styles.css). */
            function abrirPopup(sigla) {
                const modulo = modulos[sigla];
                if (!modulo) return;

                const titulo = document.getElementById('popup-titulo');
                titulo.textContent = `${sigla} · ${modulo.nombre}`;
                titulo.style.backgroundColor = `var(--${sigla})`;

                // Guardamos el color de la asignatura en una variable CSS del
                // propio popup, para que todo lo de dentro (el borde de cada
                // examen, el fondo de las tarjetas...) se pinte con el mismo
                // color en vez de con grises genéricos.
                document.querySelector('.popup').style.setProperty('--popup-color', `var(--${sigla})`);

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
                                <strong>${escaparHTML(ex.titulo)}</strong>
                                <span class="examen-fecha">${formatearFecha(ex.fecha)}${ex.hora ? ' · ' + escaparHTML(ex.hora) : ''}</span>
                                ${ex.tipo ? `<span class="examen-tipo">${escaparHTML(ex.tipo)}</span>` : ''}
                                ${pasado ? '<span class="examen-tag">Realizado</span>' : ''}
                            </li>`;
                    }).join('') + '</ul>';
                }

                document.getElementById('overlay').style.display = 'flex';
            }

            function cerrarPopup() {
                const overlay = document.getElementById('overlay');
                if (overlay) overlay.style.display = 'none';
            }

            /* =====================================================
               CALENDARIO DE EXÁMENES (examenes.html)
               Todo lo que necesita esa página vive aquí, en script.js,
               para no tener que repetir un <script> propio en el HTML.
               Si esta página no tiene calendario (index.html,
               asignaturas.html), las funciones de abajo simplemente no
               encuentran nada que hacer y no pasa nada.
               ===================================================== */

            // Igual que el horario de index.html: 6 franjas por día. Sirve
            // para saber qué horas ocupa cada asignatura ese día concreto.
            const horarioSemanal = {
                Lunes:       ['AD', 'AD', 'SGE', 'SGE', 'SGE', 'SGE'],
                Martes:      ['AD', 'PMDM', 'PMDM', 'DI', 'DI', 'DI'],
                'Miércoles': ['IPGS', 'IPGS', 'PMDM', 'DI', 'DI', 'DI'],
                Jueves:      ['AD', 'PI', 'PI', 'IPE-II', 'IPE-II', 'IPE-II'],
                Viernes:     ['OPT', 'OPT', 'OPT', 'PSP', 'PSP', 'PSP']
            };
            const nombresDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

            // Busca en qué franjas (1 a 6) tiene clase esa sigla ese día,
            // y devuelve el bloque continuo que ocupa.
            function bloqueHorario(dia, sigla) {
                const franjas = horarioSemanal[dia];
                if (!franjas) return null;
                const inicio = franjas.indexOf(sigla);
                if (inicio === -1) return null;
                let fin = inicio;
                while (fin + 1 < franjas.length && franjas[fin + 1] === sigla) fin++;
                return { inicio: inicio + 1, fin: fin + 1 };
            }

            // Calcula dónde debería ir un examen (día de la semana, franjas
            // horarias y tarjeta de semana) a partir de su fecha y su
            // sigla. Devuelve null si la fecha/asignatura no encajan en el
            // horario o no hay una semana visible en el calendario para
            // esa fecha.
            function calcularPosicionExamen(ex) {
                const [a, m, d] = ex.fecha.split('-').map(Number);
                const fechaObj = new Date(a, m - 1, d);
                const diaSemana = fechaObj.getDay(); // 0=Domingo ... 6=Sábado
                if (diaSemana < 1 || diaSemana > 5) return null;

                const dia = nombresDias[diaSemana - 1];
                const franja = bloqueHorario(dia, ex.sigla);
                if (!franja) return null;

                const lunesSemana = new Date(fechaObj);
                lunesSemana.setDate(lunesSemana.getDate() - (diaSemana - 1));

                const bloqueSemana = [...document.querySelectorAll('.semana-bloque')].find(bloque => {
                    const spanLunes = bloque.querySelectorAll('.semana-fechas span')[1];
                    if (!spanLunes) return false;
                    const [dd, mm] = spanLunes.textContent.split('/').map(Number);
                    return dd === lunesSemana.getDate() && (mm - 1) === lunesSemana.getMonth();
                });
                if (!bloqueSemana) return null;

                return { diaSemana, franja, bloqueSemana };
            }

            // Crea el <div class="examen-bloque"> en el DOM, en la posición
            // ya calculada, y lo deja preparado para abrir su popup al
            // pulsarlo.
            function crearBloqueExamenEnDOM(ex, pos) {
                const clase = ex.esFinal ? 'final' : (ex.esPresentacion ? 'presentacion' : ex.sigla);
                const texto = ex.esPresentacion ? `Pres. ${ex.sigla}` : (ex.esFinal ? `${ex.sigla} Final` : ex.sigla);

                const bloqueExamen = document.createElement('div');
                bloqueExamen.className = 'examen-bloque ' + clase;
                bloqueExamen.style.gridColumn = pos.diaSemana + 1; // Lunes(1)->col2 ... Viernes(5)->col6
                bloqueExamen.style.gridRow = `${pos.franja.inicio} / span ${pos.franja.fin - pos.franja.inicio + 1}`;
                bloqueExamen.title = ex.titulo + ' (clic para ver el tema)';
                bloqueExamen.textContent = texto;
                bloqueExamen.onclick = () => abrirPopupExamenFijo(ex);

                pos.bloqueSemana.querySelector('.semana-cuerpo').appendChild(bloqueExamen);
            }

            // Recorre el objeto "examenes" de aquí arriba y coloca un
            // bloque en el calendario por cada uno. Si esta página no
            // tiene calendario, no hay ".examenes-calendario" y no hace
            // falta seguir.
            function cargarExamenesDelCodigo() {
                if (!document.querySelector('.examenes-calendario')) return;

                Object.keys(examenes).forEach(sigla => {
                    examenes[sigla].forEach(ex => {
                        const exCalendario = {
                            sigla,
                            fecha: ex.fecha,
                            hora: ex.hora,
                            tipo: ex.tipo,
                            titulo: ex.titulo,
                            esFinal: /final/i.test(ex.titulo),
                            esPresentacion: /presentaci/i.test(ex.tipo || '') || /presentaci/i.test(ex.titulo)
                        };
                        const pos = calcularPosicionExamen(exCalendario);
                        if (pos) crearBloqueExamenEnDOM(exCalendario, pos);
                    });
                });
            }
            cargarExamenesDelCodigo();

            /* ---------- Popup de detalle de un examen (examenes.html) ---------- */
            // Reutiliza "modulos", "formatearFecha" y "escaparHTML", que ya
            // están definidos más arriba en este mismo archivo.
            function abrirPopupExamenFijo(ex) {
                const overlay = document.getElementById('overlay-examen');
                if (!overlay) return;

                const modulo = modulos[ex.sigla];

                const titulo = document.getElementById('popup-examen-titulo');
                titulo.textContent = modulo ? `${ex.sigla} · ${modulo.nombre}` : ex.sigla;
                titulo.style.backgroundColor = `var(--${ex.sigla})`;

                // Mismo truco que en el popup de Asignatura/Siglas: guardamos
                // el color de la asignatura en una variable CSS del popup.
                overlay.querySelector('.popup').style.setProperty('--popup-color', `var(--${ex.sigla})`);

                document.getElementById('popup-examen-profesor').textContent = modulo ? `Profesor/a: ${modulo.profesor}` : '';

                const tipoTexto = ex.esFinal ? 'Examen final' : (ex.esPresentacion ? 'Presentación' : (ex.tipo || 'Examen'));
                document.getElementById('popup-examen-detalle').innerHTML = `
                    <p class="examen-fecha">${formatearFecha(ex.fecha)}${ex.hora ? ' · ' + escaparHTML(ex.hora) : ''}</p>
                    <p class="examen-tipo">${escaparHTML(tipoTexto)}</p>
                    <p class="popup-examen-tema"><strong>${escaparHTML(ex.titulo)}</strong></p>
                `;

                overlay.style.display = 'flex';
            }

            function cerrarPopupExamen() {
                const overlay = document.getElementById('overlay-examen');
                if (overlay) overlay.style.display = 'none';
            }

            // Cerrar cualquiera de los dos popups con la tecla Escape
            // (cada función comprueba antes si su overlay existe en esta
            // página, así que no pasa nada si solo hay uno de los dos).
            document.addEventListener('keydown', e => {
                if (e.key !== 'Escape') return;
                cerrarPopup();
                cerrarPopupExamen();
            });
