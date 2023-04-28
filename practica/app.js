class Juego {
    constructor(indice, nombre, id, precio, imagen, cantidad) {
        this.indice = indice,
            this.nombre = nombre,
            this.id = id,
            this.precio = precio,
            this.imagen = imagen,
            this.cantidad =cantidad
            
    }
}

class ProductoController {

    constructor() {
        this.listaProductos = []
        this.contenedorJuegos = document.getElementById("contenedorJuegos")
    }

    async cargarProductos(){
            const response= await fetch('./bd.json')
            let data = await response.json()
    
            data.forEach(element =>{
                    this.contenedorJuegos.innerHTML += `<div class="card" style="width: 18rem;">
                                                <div class="card-body">
                                                    <h5 class="card-title">${element.nombre}</h5>
                                                    <img src="${element.imagen}" alt="">
                                                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                                                    the card's content.</p>
                                                    <p>Precio: ${element.precio}</p>
                                                    <p>Id: ${element.id}</p>
                                                    <a href="#" class="btn btn-primary boton" id="juego_${element.id}"><img src="./assets/carrito3.png" class="imagen" alt=""></a>
                                                    <a href="#"  id="borrar_${element.id}"></a>
                                                    <p>Cantidad=1 ${element.cantidad}</p>
                                                </div>
                                            </div>`
        
                this.listaProductos.push(element)

                })
            
            this.darEventos(controladorCarrito)

        
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
                controladorCarrito.sumaTotalFuncion()
                this.notificacionAgregar(el.nombre)
                controladorCarrito.listaCarrito.forEach(element => {

                    controladorCarrito.contenedorCarrito.innerHTML +=
                        `<div class="card" style="width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title">${element.nombre}</h5>
                                <img src="${element.imagen}" alt="">
                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                                the card's content.</p>
                                <p>Precio: ${element.precio}</p>
                                <p>Id: ${element.id}</p>
                                <a href="#" class="btn btn-primary boton borrar" id="borrar_${element.id}">Borrar</a>
                                <p>Cantidad: ${element.cantidad}</p>
                            </div>
                        </div>`;
                    
                })

                
                guardarLocal("listaCarrito", JSON.stringify(controladorCarrito.listaCarrito))
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

        let flag=false

        for (let index = 0; index < this.listaCarrito.length; index++) {
            if(this.listaCarrito[index].id == producto.id){
                this.listaCarrito[index].cantidad+=1
                flag=true
            }
        }

        if(flag==false){
            this.listaCarrito.push(producto)      
        }

              
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

    sumaTotalFuncion() {

        let total=0;
        total= this.listaCarrito.reduce((total, producto)=> total + (producto.precio*producto.cantidad),0)
        this.sumaTotal.innerHTML= `Suma total:${total}`

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
controladorProducto.darEventos(controladorCarrito)
controladorCarrito.verificarExistenciaEnStorage()
controladorCarrito.compraFinalizada()


const guardarLocal = (clave, valor) => {
    localStorage.setItem(clave, valor);
}


