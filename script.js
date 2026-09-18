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