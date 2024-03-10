// Asignando las constantes del DOM

const buttonIngreso = document.getElementById('ingreso')
const buttonEgreso = document.getElementById('egreso')
const buttonPagos = document.getElementById('pagos')
const buttonGuardar = document.getElementById('guardar')
const buttonCargar = document.getElementById('cargar')
const buttonNuevoMes = document.getElementById('nuevoMes')
const modalIngreso = document.getElementById('modalIngreso')
const modalEgreso = document.getElementById('modalEgreso')
const modalPagos = document.getElementById('modalPagos')
const modalCarga = document.getElementById('modalCarga')
const modalNuevoMes = document.getElementById('modalNuevoMes')
const historial = document.querySelector('.historial')
const buttonCerrarModal = document.querySelectorAll('.cerrarModal')
let modales = document.querySelectorAll('.modal')

// Asignando los nombres de los arrays que se utilizaran
let ingresosDinero = []
let egresosDinero = []
let listaDePagos = []
let listaDeMeses = []

// Cargando los datos almacenados en el localStorage bajo el nombre mesesGuardados
let nombreDelMes = ''
let mesesGuardados = localStorage.getItem('mesesGuardados')
mesesGuardados = JSON.parse(mesesGuardados)
if(mesesGuardados != null){
    for(i of mesesGuardados){
        listaDeMeses.push(i)
    }
}

// Imprime en pantalla los datos de flujo de dinero que se van agregando
let impresionEnPantalla = () => {

    // Si se carga el mes desde el localStorage se le asigna el nombre para que el usuario sepa que mes esta visualizando
    nombreDelMes != '' && (document.getElementById('tituloMes').innerHTML = `<h4>${nombreDelMes}</h4>`)

    // Pone los contadores en 0
    let ingresosTotal = 0
    let egresosTotal = 0

    // Verifica que el array de ingresos tenga contenido, si es asi lo imprimira en el DOM
    if (ingresosDinero.length > 0) {
       
        
        acomodamientoDeDatos(ingresosDinero)
        let categoria = ''
        tablaIngreso.innerHTML = `<h2>Ingresos</h2>`

        for (i of ingresosDinero) {
            
            ingresosTotal += parseFloat(i.cantidad)
            categoria !== i.categoria && (tablaIngreso.innerHTML += `<h4>${i.categoria}</h4>`)
            categoria = i.categoria

            tablaIngreso.innerHTML += `<div class="articulo">
                <div class="dato"></div>
                <div class="descripcion">${i.nombre}</div>
                <div class="dato">$ ${i.cantidad.toLocaleString("es",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <button onClick="borrar(ingresosDinero,${i.itemID})">X</button>
            </div>`
        }

        tablaIngreso.innerHTML += `<h4>$ ${ingresosTotal.toLocaleString("es",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>`

    }else{
        tablaIngreso.innerHTML = ''
    }

    // Verifica que el array de egresos tenga contenido, si es asi lo imprimira en el DOM... no esta hecha en una funcion junto a la de array de ingresos ya que en la impresion del DOM tiene variaciones
    if (egresosDinero.length > 0) {

        acomodamientoDeDatos(egresosDinero)
       
        let categoria = ''
        tablaEgreso.innerHTML = `<h2>Egresos</h2>`

        for (i of egresosDinero) {
            let pagado = i.resto <= 0.01 ? 'pagado' : 'resto'
            let variabilizando = i.resto > 0 && `style="--vresto:'$${i.resto.toFixed(2)}'"`
            egresosTotal += parseFloat(i.cantidad)
            categoria !== i.categoria && (tablaEgreso.innerHTML += `<h4>${i.categoria}</h4>`)
            categoria = i.categoria


            let dia = i.fecha.slice(8)
            let mes = i.fecha.slice(5,7)
            let anio = i.fecha.slice(0,4)
          
            tablaEgreso.innerHTML += `<div class="articulo">
                <div class="dato">${dia}/${mes}/${anio}</div>
                <div class="descripcion">${i.nombre}</div>
                <div class="dato ${pagado}" ${variabilizando}>$ ${i.cantidad.toLocaleString("es",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <button onClick="borrar(egresosDinero,${i.itemID})">X</button>
            </div>`
        }

        tablaEgreso.innerHTML += `<h4>$ ${egresosTotal.toLocaleString("es",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>`
    }else{
        tablaEgreso.innerHTML = ''
    }

    // Simplemente calcula el total de los ingresos y resta el egreso para dar el total de dinero sobrante o el dinero faltante
    balance.innerHTML = `Balance: $${(ingresosTotal - egresosTotal).toLocaleString("es",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

    // Verifica si la lista de pagos hechos tiene datos, si es asi coloca el pago realizado en la columna de pagos
    if(listaDePagos.length > 0){
        console.log(listaDePagos)
        listaDePagos.sort((a,b) => {
            if(a.categoria < b.categoria){
                return -1
            }
            if(a.categoria > b.categoria){
                return 1
            }
            if(a.nombre < b.nombre){
                return -1
            }
            if(a.nombre > b.nombre){
                return 1
            }
            return 0
        })
        pagosBox.innerHTML = `<h2>Pagos</h2>`
        for(i of listaDePagos){

            let dia = i.fecha.slice(8)
            let mes = i.fecha.slice(5,7)
            let anio = i.fecha.slice(0,4)

            let porcentaje = (i.cantidad / ingresosTotal) * 100
            pagosBox.innerHTML += `<div class="articulo">
        <div class="dato">${dia}/${mes}/${anio}</div>
        <div class="descripcion">${i.nombre}</div>
        <div class="dato">$ ${i.cantidad.toLocaleString("es",{ minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${porcentaje.toFixed(1)}%)</div>
        </div>`
        }
    }else{
        pagosBox.innerHTML = ''
    }
}

// Abre cuadro de dialogo correspondiente para ingresar datos
let abrirModal = (modalDeInteres,modalSinInteres) => {

    modalPagos.style.display = 'none'
    modalNuevoMes.style.display = 'none'
    modalSinInteres.style.display = 'none'
    modalDeInteres.style.display = 'flex'
}

// Cierra el cuadro de dialogos
let cerrarModal = () => {
    

    for(i of modales){
        i.style.display = 'none'
    }
}

// En el cuadro de dialogos para pagos, imprime una lista de los egresos donde todavia no tiene hecho el pago total
let checkPagos = (modalDeInteres) => {



    let listaDeuda = document.querySelectorAll('.aPagar')

    for(i of listaDeuda){
            
        let itemApagar = egresosDinero.find(a => a.itemID == i.dataset.itemid)
        let fecha = i.querySelector('.fecha').value
        let valor = parseFloat(i.querySelector('.valor').value)
        
        if(!isNaN(valor)){
            itemApagar.resto = itemApagar.resto == undefined ? itemApagar.cantidad - valor : itemApagar.resto - valor
            
            listaDePagos.push({categoria: itemApagar.categoria, nombre: itemApagar.nombre, cantidad: valor, fecha})
        }
    }

    modalDeInteres.style.display = 'none'

    impresionEnPantalla()
}

// Borra el item seleccionado de la lista
let borrar = (lista, idBuscado) => {

    let index = lista.findIndex(a => a.itemID == idBuscado)
    lista.splice(index,1)

    impresionEnPantalla()
}

// Acomoda los datos de flujo de dinero por orden alfabetico, primero por categoria y despues por nombre asi en la impresion del DOM es mas sencillo separarlo por categorias
let acomodamientoDeDatos = (listado) => {
    listado.sort((a,b) => {
        if(a.categoria > b.categoria) {
            return 1 
        }
        if(a.categoria < b.categoria) {
            return -1 
        }
        if(a.nombre > b.nombre) {
            return 1 
        }
        if(a.nombre < b.nombre) {
            return -1 
        }
        return 0
    })
}

// Agrega un item al array de ingresos o egresos segun corresponda
let agregarMonto = (transaccion, lista) => {

    let categoria = transaccion == 'ingreso' ? document.getElementById('ingCategoria').value.toLowerCase() : document.getElementById('egreCategoria').value.toLowerCase()
    let nombre = transaccion == 'ingreso' ? document.getElementById('ingNombre').value.toLowerCase() : document.getElementById('egreNombre').value.toLowerCase()
    let cantidad = transaccion == 'ingreso' ? parseFloat(document.getElementById('ingMonto').value) : parseFloat(document.getElementById('egreMonto').value)
    let fecha = transaccion == 'ingreso' ? '-' : document.getElementById('egreFechaVencimiento').value


    if (categoria != '' && nombre != '' && !isNaN(cantidad) && fecha != '') {
        
        lista.push({ categoria, nombre, cantidad, fecha, itemID: lista.length})

        modalIngreso.style.display = 'none'
        modalEgreso.style.display = 'none'

        let inputsTotal = document.querySelectorAll('input')
        for (i of inputsTotal) {
            i.value = ''
        }
    }else{
        alert('Faltan Datos')
    }
    
    impresionEnPantalla()
    
}

// Abre el cuadro de dialogo para pagos
let agregarPago = () => {

    modalPagos.style.display = 'flex'
    modalIngreso.style.display = 'none'
    modalEgreso.style.display = 'none'
    modalNuevoMes.style.display = 'none'

        modalPagos.innerHTML = `<h3>Pagos</h3>`

    for(i of egresosDinero){
        
        if(i.resto > 0 || i.resto == undefined){
            modalPagos.innerHTML += `<div class="linea aPagar" data-itemid="${i.itemID}">
            <div class="descripcion">${i.categoria} - ${i.nombre}: $${i.cantidad.toFixed(2)}</div>
            <input type="number" placeholder="$$$" class="valor">
            <input type="date" class="fecha">
        </div>`
        }
    }
    modalPagos.innerHTML += `<button id="checkPagosButton">Listo !!!</button>
    <button class="cerrarModal" onClick="cerrarModal()">X</button>`

    checkPagosButton.addEventListener('click', () => checkPagos(modalPagos))
}

// Guarda los datos en el LocalStorage
let guardarDatos = () => {

    // Dialogo mediante el navegador para insertar los datos para saber de que mes corresponde
    let mes = prompt('Pone el mes de la tabla en numero')
    let anio = prompt('Pone el año de la tabla con 2 digitos ej."24"')

    // Si los datos introducidos no son los esperados se ejecuta de nuevo la funcion de guardarDatos
    if(isNaN(mes) || isNaN(anio) || mes > 12 || anio > 99){
        alert('los datos son invalidos')
        guardarDatos()
    }else{

        // Nombra el mes correspondiente segun los datos colocados
        let nombreMes;
        switch (parseInt(mes)) {
            case 1:
              nombreMes = "Enero";
              break;
            case 2:
              nombreMes = "Febrero";
              break;
            case 3:
              nombreMes = "Marzo";
              break;
            case 4:
              nombreMes = "Abril";
              break;
            case 5:
              nombreMes = "Mayo";
              break;
            case 6:
              nombreMes = "Junio";
              break;
            case 7:
              nombreMes = "Julio";
              break;
            case 8:
              nombreMes = "Agosto";
              break;
            case 9:
              nombreMes = "Septiembre";
              break;
            case 10:
              nombreMes = "Octubre";
              break;
            case 11:
              nombreMes = "Noviembre";
              break;
            case 12:
              nombreMes = "Diciembre";
              break;
            default:
              nombreMes = "Desconocido";
          }


        let nombre = `${nombreMes}-${anio}`
        let mesSalvado = listaDeMeses.find(a => a.nombre == nombre)
        let mesPorMes = []

        // Si el mes es menor a 10 le coloca un 0 por delante para que sea mas sencillo acomodar el array al momento de imprimirlo en el historial
        mes < 10 && (mes = `0${mes}`)
        let idmes = parseInt(`${anio}${mes}`)
        if(mesSalvado == undefined){
            let mesAguardar = {
                idmes,
                nombre,
                ingresosDinero,
                egresosDinero,
                listaDePagos
            }
            
            for(i of listaDeMeses){
                mesPorMes.push(i)
            }
            mesPorMes.push(mesAguardar)
        }else{
            mesSalvado = {
                idmes,
                nombre,
                ingresosDinero,
                egresosDinero,
                listaDePagos
            }
            console.log(mesSalvado)
            
            for(i of listaDeMeses){
                if(i.nombre == mesSalvado.nombre){
                    mesPorMes.push(mesSalvado)
                }else{
                    mesPorMes.push(i)
                }
            }
        }

        

        let listaDeMesesJSON = JSON.stringify(mesPorMes)
        localStorage.setItem('mesesGuardados', listaDeMesesJSON)
        
        location.reload()
    }
    
}

// Abre el cuadro de dialogo para seleccionar un mes a cargar para visualizarlo y/o editarlo
let cargarDatos = () => {
    modalCarga.style.display = 'flex'
    if(listaDeMeses.length == 0){
        modalCarga.innerHTML = `<h4>
        No hay datos para cargar</h4>
        <button onclick="cerrarModal()">Cerrar</button>`
    }else{
        
        modalCarga.innerHTML = `<h4>Elegi el mes</h4>`
        for(i of listaDeMeses){
            modalCarga.innerHTML += `<button>${i.nombre}</button>`
        }
    }
}

// Copia las categoria e items de lo impreso en el DOM para crear un duplicado para un nuevo mes por ejemplo
let armarMesNuevo = () => {
    
    modalNuevoMes.innerHTML = ''

    for(i of modales){
        i.style.display = 'none'
    }

    modalNuevoMes.style.display = 'flex'

    let cantidadDeMeses = listaDeMeses.length

    modalNuevoMes.innerHTML += `<h4>Ingresos</h4>`
    for(i of listaDeMeses[cantidadDeMeses - 1].ingresosDinero){
        modalNuevoMes.innerHTML += `<label class="campo-transaccion">
        ${i.categoria}-${i.nombre}<input type="number" placeholder="$$$" data-transaccion="ingreso" data-categoria="${i.categoria}" data-nombre="${i.nombre}" value="${i.cantidad}">
        </label>`
    }
    modalNuevoMes.innerHTML += `<h4>Egresos</h4>`
    for(i of listaDeMeses[cantidadDeMeses - 1].egresosDinero){
        console.log(i)
        modalNuevoMes.innerHTML += `<label class="campo-transaccion">
        ${i.categoria}-${i.nombre}<input type="number" placeholder="$$$" data-transaccion="egreso" data-categoria="${i.categoria}" data-nombre="${i.nombre}" value="${i.cantidad}">
        </label>`
    }
    modalNuevoMes.innerHTML += `<button id="crearMes">Crear Mes</button>
    <button class="cerrarModal" onClick="cerrarModal()">X</button>`
    document.getElementById('crearMes').addEventListener('click', () => agregandoMes())
}

// Cuadro de dialogo para la modificacion de datos en el duplicado del nuevo mes
let agregandoMes = () => {
    let campos = modalNuevoMes.querySelectorAll('.campo-transaccion')

    ingresosDinero = []
    egresosDinero = []
    listaDePagos = []
    let itemID = 0

    for(i of campos){
        let icategoria = i.querySelector('input').dataset.categoria
        let inombre = i.querySelector('input').dataset.nombre
        let icantidad = i.querySelector('input').value
        i.querySelector('input').dataset.transaccion == 'ingreso' &&  icantidad != '' && ingresosDinero.push({ categoria:icategoria ,nombre:inombre ,cantidad:parseFloat(icantidad),itemID })
        i.querySelector('input').dataset.transaccion == 'egreso' &&  icantidad != '' && egresosDinero.push({ categoria:icategoria ,nombre:inombre ,cantidad:parseFloat(icantidad), fecha:'----/--/--',itemID })
        itemID++
    }

    impresionEnPantalla()
    modalNuevoMes.style.display = 'none'
}

// Acomoda e imprime los datos guardados en el localStorage
let armandoHistorial = () => {
    listaDeMeses.sort((a,b) => a.idmes - b.idmes)
    historial.innerHTML = `<h4>Historial</h4>
    <div class="mesHistorial">
        <div class="mesNombre">Mes</div>
        <div class="dinerillo">Ingresos</div>
        <div class="dinerillo">Egresos</div>
        <div class="dinerillo">Diferencia</div>
        <div class="w5"></div>
    </div>`

    for(i of listaDeMeses){
        let ingresosMesTotal = 0
        let egresosMesTotal = 0
        for(j of i.ingresosDinero){
            ingresosMesTotal += j.cantidad
        }
        for(j of i.egresosDinero){
            egresosMesTotal += j.cantidad
        }
        let diferenciaMes = ingresosMesTotal - egresosMesTotal
        historial.innerHTML += `
        <div class="mesHistorial">
            <div class="mesNombre">${i.nombre}</div>
            <div class="dinerillo">$${ingresosMesTotal}</div>
            <div class="dinerillo">$${egresosMesTotal}</div>
            <div class="dinerillo">$${diferenciaMes}</div>
        <div class="boton" data-mes="${i.nombre}">X</div>
        </div>`
    }
}

// Escucha de eventos y ejecucion de funciones
armandoHistorial()

buttonIngreso.addEventListener('click', () => abrirModal(modalIngreso,modalEgreso))
buttonEgreso.addEventListener('click', () => abrirModal(modalEgreso,modalIngreso))
buttonPagos.addEventListener('click', () => agregarPago())
buttonIDinero.addEventListener('click', () => agregarMonto('ingreso', ingresosDinero))
buttonEDinero.addEventListener('click', () => agregarMonto('egreso', egresosDinero))
buttonGuardar.addEventListener('click', () => guardarDatos())
buttonCargar.addEventListener('click', () => cargarDatos())
buttonNuevoMes.addEventListener('click', () => armarMesNuevo())
modalCarga.addEventListener('click', (e) => {
    let seleccion = e.target.innerHTML
    let mesSeleccionado = listaDeMeses.find(a => a.nombre == seleccion)

    ingresosDinero = mesSeleccionado.ingresosDinero
    egresosDinero = mesSeleccionado.egresosDinero
    listaDePagos = mesSeleccionado.listaDePagos == undefined ? [] : mesSeleccionado.listaDePagos
    nombreDelMes = mesSeleccionado.nombre

    impresionEnPantalla()
    cerrarModal()
    console.log(mesSeleccionado)
})
historial.addEventListener('click', (e) => {
    let botonSeleccionado = e.target.dataset.mes

    if(botonSeleccionado !== undefined){
        let nuevaListaMeses = []
        for(i of listaDeMeses){
            i.nombre != botonSeleccionado && nuevaListaMeses.push(i)
        }

        let listaDeMesesJSON = JSON.stringify(nuevaListaMeses)
        localStorage.setItem('mesesGuardados', listaDeMesesJSON)
        armandoHistorial()
        location.reload()
    }

})
for(i of buttonCerrarModal){
    i.addEventListener('click', () => cerrarModal())
}