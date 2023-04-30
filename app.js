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

    async cargarProductos(controladorCarrito){
            const response= await fetch('./bd.json')
            let data = await response.json()
    
            data.forEach(element =>{
                    this.contenedorJuegos.innerHTML += `<div class="card" style="width: 18rem;">
                                                <div class="card-body">
                                                    <h5 class="card-title">${element.nombre}</h5>
                                                    <img src="${element.imagen}" alt="">
                                                    <p>Precio: ${element.precio}</p>
                                                    <a href="#" class="btn btn-primary boton" id="juego_${element.id}"><img src="./assets/carrito3.png" class="imagen" alt=""></a>
                                                    <a href="#"  id="borrar_${element.id}"></a>
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
        this.listaProductos.forEach(el => {
            const btnJuego = document.getElementById(`juego_${el.id}`)
            btnJuego.addEventListener("click", () => {
                controladorCarrito.agregarProducto(el)
                controladorCarrito.limpiarDom()
                controladorCarrito.sumaTotalFuncion()
                this.notificacionAgregar(el.nombre)
                controladorCarrito.mostrarEnDom()
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
    }

    verificarExistenciaEnStorage() {
        this.listaCarrito = JSON.parse(localStorage.getItem("listaCarrito")) || []
        if (this.listaCarrito.length > 0) {
            this.mostrarEnDom()
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

    sumaTotalFuncion() {
        let total=0;
        total= this.listaCarrito.reduce((total, producto)=> total + (producto.precio*producto.cantidad),0) || 0
        this.sumaTotal.innerHTML= `Total: ${total}`
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

    borrarProducto(productoParticular){

        let pos= this.listaCarrito.findIndex(productos=> productoParticular.id==productos.id)

        if(pos!= -1){
            this.listaCarrito.splice(pos,1)
        }

    }

    mostrarEnDom(){
        this.limpiarDom()
        this.listaCarrito.forEach(element =>{
            this.contenedorCarrito.innerHTML+=`<div class="card" style="width: 18rem;">
                                                    <div class="card-body">
                                                        <h5 class="card-title">${element.nombre}</h5>
                                                        <img src="${element.imagen}" alt="">
                                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of
                                                        the card's content.</p>
                                                        <p>Precio: ${element.precio}</p>
                                                        <p>Cantidad: ${element.cantidad}</p>
                                                        <a href="#" class="btn btn-primary boton borrar" id="borrar_${element.id}">Borrar</a>
                                                    </div>
                                               </div>` 
        })
        this.eventoBorrarProducto()
        this.sumaTotalFuncion()
    }
 
    eventoBorrarProducto(){
        this.listaCarrito.forEach(el=>{
            const botonBorrar= document.getElementById(`borrar_${el.id}`)
            botonBorrar.addEventListener("click", ()=>{
                this.borrarProducto(el)
                guardarLocal("listaCarrito", JSON.stringify(this.listaCarrito))
                this.mostrarEnDom()
            })
        })
    }

}

const controladorProducto = new ProductoController()
const controladorCarrito = new CarritoController()

controladorCarrito.verificarExistenciaEnStorage()
controladorProducto.cargarProductos(controladorCarrito)
controladorCarrito.compraFinalizada()
controladorCarrito.sumaTotalFuncion()


const guardarLocal = (clave, valor) => {
    localStorage.setItem(clave, valor);
}


