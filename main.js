class Juego {
    constructor(indice, nombre, id, precio, imagen) {
        this.indice = indice,
            this.nombre = nombre,
            this.id = id,
            this.precio = precio,
            this.imagen = imagen
    }
}

class ProductoController {

    constructor() {
        this.listaProductos = []
        this.contenedorJuegos = document.getElementById("contenedorJuegos")
    }

    cargarProductos() {
        this.listaProductos =
            [new Juego("a", "God of War".toLowerCase(), 1, 7000, "./assets/juego1.webp"),
            new Juego("b", "Uncharted".toLowerCase(), 2, 8000, "./assets/Juego2.jpg"),
            new Juego("c", "Control".toLowerCase(), 3, 6000, "./assets/Juego3.jpg"),
            new Juego("d", "Modern Warfare".toLowerCase(), 4, 9000, "./assets/Juego4.avif"),
            new Juego("e", "Ghost".toLowerCase(), 5, 10000, "./assets/Juego 5.jpg"),
            new Juego("f", "Farcry".toLowerCase(), 6, 5000, "./assets/Juego6.jpg")]
    }

    mostrarEnDom() {
        //CARGA DE JUEGOS EN EL DOM
        this.listaProductos.forEach(element => {
            this.contenedorJuegos.innerHTML += `<div class="card" style="width: 18rem;">
                                        <div class="card-body">
                                            <h5 class="card-title">${element.nombre}</h5>
                                            <img src="${element.imagen}" alt="">
                                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                                            the card's content.</p>
                                            <p>Precio: ${element.precio}</p>
                                            <p>Id: ${element.id}</p>
                                            <a href="#" class="btn btn-primary boton" id="juego_${element.id}"><img src="./assets/carrito3.png" class="imagen" alt=""></a>
                                            <a href="#" id="borrar_${element.id}" ></a>
                                        </div>
                                    </div>`
        })

    }

    notificacionAgregar(nombre){
        Toastify({
            text: `${nombre} fué añadido`,
            duration: 1000,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            close: true
        }).showToast();
    }

    darEventos(controladorCarrito) {
        controladorCarrito.sumaDesdeStorage()
        this.listaProductos.forEach(el => {
            const btnJuego = document.getElementById(`juego_${el.id}`)
            btnJuego.addEventListener("click", () => {
                controladorCarrito.agregarProducto(el)
                controladorCarrito.limpiarDom()
                controladorCarrito.sumaTotalFuncion(el.precio)
                this.notificacionAgregar(el.nombre)
                controladorCarrito.listaCarrito.forEach(el => {
                    controladorCarrito.contenedorCarrito.innerHTML +=
                        `<div class="card" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title">${el.nombre}</h5>
                                <img src="${el.imagen}" alt="">
                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                                the card's content.</p>
                                <p>Precio: ${el.precio}</p>
                                <p>Id: ${el.id}</p>
                                <a href="#" class="btn btn-primary boton borrar" id="borrar_${el.id}">Borrar</a>
                            </div>
                        </div>`
                    guardarLocal("listaCarrito", JSON.stringify(controladorCarrito.listaCarrito))
                })
            })
        })
    }


}

class CarritoController {

    constructor() {
        this.listaCarrito = []
        this.contenedorCarrito = document.getElementById("modal")
        this.sumaTotal = document.getElementById("sumaTotal")
        this.botonesEliminar = []
    }

    verificarExistenciaEnStorage() {
        const vectorDeStorage = (JSON.parse(localStorage.getItem("listaCarrito"))) || []
        this.listaCarrito = [...vectorDeStorage]
        if (this.listaCarrito.length > 0) {
            this.contenedorCarrito.innerHTML = ``
            this.listaCarrito.forEach(el => {
                this.contenedorCarrito.innerHTML +=
                    `<div class="card" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">${el.nombre}</h5>
                            <img src="${el.imagen}" alt="">
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                            the card's content.</p>
                            <p>Precio: ${el.precio}</p>
                            <p>Id: ${el.id}</p>
                            <a href="#" class="btn btn-primary boton borrar" id="borrar_${el.id}">Borrar</a>
                        </div>
                    </div>`
            })
        }
    }

    agregarProducto(producto) {
        this.listaCarrito.push(producto)
    }

    limpiarDom() {
        this.contenedorCarrito.innerHTML = ""
    }

    sumaDesdeStorage() {
        let suma = 0
        const vectorDeStorage = (JSON.parse(localStorage.getItem("listaCarrito"))) || []
        vectorDeStorage.forEach(element => {
            suma += element.precio
        })
        this.sumaTotal.innerHTML = `${suma}`
        return suma
    }

    sumaTotalFuncion(precio) {
        let suma = this.sumaDesdeStorage()
        suma += precio
        this.sumaTotal.innerHTML = ""
        this.sumaTotal.innerHTML = `${suma}`
    }

    compraFinalizada() {
        const finalizarCompra = document.getElementById("finalizarCompra")
        finalizarCompra.addEventListener("click", () => {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Compra finalizada con exito',
                showConfirmButton: false,
                timer: 2000
            })
            this.limpiarDom()
            this.listaCarrito=[]
            localStorage.removeItem("listaCarrito")
            this.sumaTotal.innerHTML="Total: 0"
        })
    }

    eliminarProducto(){

        const vectorNuevo=JSON.parse(localStorage.getItem("listaCarrito"))
        
        let suma=0

        this.listaCarrito.forEach(element =>{

            const borrar= document.getElementById(`borrar_${element.id}`)

            borrar.addEventListener("click", () => {
                
                let index = this.listaCarrito.indexOf(`borrar_${element.id}`)

                if(index){
                    this.listaCarrito.splice(index, 1)
                    vectorNuevo.splice(index,1)
                }

            console.log("hola");
            console.log(index)

            this.contenedorCarrito.innerHTML=""
            
            suma=this.sumaDesdeStorage()

            suma=suma-element.precio

            this.sumaTotal.innerHTML=`${suma}`

            guardarLocal("listaCarrito", JSON.stringify(vectorNuevo))

            this.listaCarrito.forEach(el =>{
                this.contenedorCarrito.innerHTML+=`<div class="card" style="width: 18rem;">
                                                                    <div class="card-body">
                                                                        <h5 class="card-title">${el.nombre}</h5>
                                                                        <img src="${el.imagen}" alt="">
                                                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                                                                        the card's content.</p>
                                                                        <p>Precio: ${el.precio}</p>
                                                                        <p>Id: ${el.id}</p>
                                                                        <a href="#" class="btn btn-primary boton borrar" id="borrar_${el.id}">Borrar</a>
                                                                    </div>
                                                                </div>`

                })
            })
        })
    }

}

const controladorProducto = new ProductoController()
const controladorCarrito = new CarritoController()

controladorProducto.cargarProductos()
controladorProducto.mostrarEnDom()
controladorProducto.darEventos(controladorCarrito)
controladorCarrito.verificarExistenciaEnStorage()
controladorCarrito.compraFinalizada()
controladorCarrito.eliminarProducto();

const guardarLocal = (clave, valor) => {
    localStorage.setItem(clave, valor);
}


/*function mostrarTotal(){

    let vector=[]

    let vectorDeStorage= (JSON.parse(localStorage.getItem("listaCarrito"))) || []

    vector=[...vectorDeStorage]

    let sumaTotal=0

    vector.forEach(el =>{

        sumaTotal+= (el.precio)

    })

    console.log(vector)

}


mostrarTotal()*/


/* class Juego {
    constructor(indice, nombre, id, precio, imagen) {
        this.indice = indice,
            this.nombre = nombre,
            this.id = id,
            this.precio = precio,
            this.imagen = imagen
    }
}

class ProductoController {

    constructor() {
        this.listaProductos = []
        this.contenedorJuegos = document.getElementById("contenedorJuegos")
    }

    cargarProductos() {
        this.listaProductos =
            [new Juego("a", "God of War".toLowerCase(), 1, 7000, "./assets/juego1.webp"),
            new Juego("b", "Uncharted".toLowerCase(), 2, 8000, "./assets/Juego2.jpg"),
            new Juego("c", "Control".toLowerCase(), 3, 6000, "./assets/Juego3.jpg"),
            new Juego("d", "Modern Warfare".toLowerCase(), 4, 9000, "./assets/Juego4.avif"),
            new Juego("e", "Ghost".toLowerCase(), 5, 10000, "./assets/Juego 5.jpg"),
            new Juego("f", "Farcry".toLowerCase(), 6, 5000, "./assets/Juego6.jpg")]
    }

    mostrarEnDom() {
        //CARGA DE JUEGOS EN EL DOM
        this.listaProductos.forEach(element => {
            this.contenedorJuegos.innerHTML += `<div class="card" style="width: 18rem;">
                                        <div class="card-body">
                                            <h5 class="card-title">${element.nombre}</h5>
                                            <img src="${element.imagen}" alt="">
                                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                                            the card's content.</p>
                                            <p>Precio: ${element.precio}</p>
                                            <p>Id: ${element.id}</p>
                                            <a href="#" class="btn btn-primary boton" id="juego_${element.id}"><img src="./assets/carrito3.png" class="imagen" alt=""></a>
                                        </div>
                                    </div>`
        })

    }

    notificacionAgregar(nombre){
        Toastify({
            text: `${nombre} fué añadido`,
            duration: 2000,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            close: true
        }).showToast();
    }

    darEventos(controladorCarrito) {
        controladorCarrito.sumaDesdeStorage()
        this.listaProductos.forEach(el => {
            const btnJuego = document.getElementById(`juego_${el.id}`)
            btnJuego.addEventListener("click", () => {
                controladorCarrito.agregarProducto(el)
                controladorCarrito.limpiarDom()
                controladorCarrito.sumaTotalFuncion(el.precio)
                this.notificacionAgregar(el.nombre)
                controladorCarrito.listaCarrito.forEach(el => {
                    controladorCarrito.contenedorCarrito.innerHTML +=
                        `<div class="card" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title">${el.nombre}</h5>
                                <img src="${el.imagen}" alt="">
                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                                the card's content.</p>
                                <p>Precio: ${el.precio}</p>
                                <p>Id: ${el.id}</p>
                                <a href="#" class="btn btn-primary boton borrar" id="borrar_${el.id}">Borrar</a>
                            </div>
                        </div>`
                    guardarLocal("listaCarrito", JSON.stringify(controladorCarrito.listaCarrito))
                })
            })
        })
    }


}

class CarritoController {

    constructor() {
        this.listaCarrito = []
        this.contenedorCarrito = document.getElementById("modal")
        this.sumaTotal = document.getElementById("sumaTotal")
        this.botonesEliminar = []
    }

    verificarExistenciaEnStorage() {
        const vectorDeStorage = (JSON.parse(localStorage.getItem("listaCarrito"))) || []
        this.listaCarrito = [...vectorDeStorage]
        if (this.listaCarrito.length > 0) {
            this.contenedorCarrito.innerHTML = ``
            this.listaCarrito.forEach(el => {
                this.contenedorCarrito.innerHTML +=
                    `<div class="card" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">${el.nombre}</h5>
                            <img src="${el.imagen}" alt="">
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                            the card's content.</p>
                            <p>Precio: ${el.precio}</p>
                            <p>Id: ${el.id}</p>
                            <a href="#" class="btn btn-primary boton borrar" id="borrar_${el.id}">Borrar</a>
                        </div>
                    </div>`
            })
        }
    }

    agregarProducto(producto) {
        this.listaCarrito.push(producto)
    }

    limpiarDom() {
        this.contenedorCarrito.innerHTML = ""
    }

    sumaDesdeStorage() {
        let suma = 0
        const vectorDeStorage = (JSON.parse(localStorage.getItem("listaCarrito"))) || []
        vectorDeStorage.forEach(element => {
            suma += element.precio
        })
        this.sumaTotal.innerHTML = `${suma}`
        return suma
    }

    sumaTotalFuncion(precio) {
        let suma = this.sumaDesdeStorage()
        suma += precio
        this.sumaTotal.innerHTML = ""
        this.sumaTotal.innerHTML = `${suma}`
    }

    compraFinalizada() {
        const finalizarCompra = document.getElementById("finalizarCompra")
        finalizarCompra.addEventListener("click", () => {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Compra finalizada con exito',
                showConfirmButton: false,
                timer: 2000
            })

            this.limpiarDom()
            this.listaCarrito=[]
            localStorage.removeItem("listaCarrito")
            this.sumaTotal.innerHTML="Total: 0"
        })
    }

}

const controladorProducto = new ProductoController()
const controladorCarrito = new CarritoController()

controladorProducto.cargarProductos()
controladorProducto.mostrarEnDom()
controladorProducto.darEventos(controladorCarrito)
controladorCarrito.verificarExistenciaEnStorage()
controladorCarrito.compraFinalizada()

const guardarLocal = (clave, valor) => {
    localStorage.setItem(clave, valor);
}
 */