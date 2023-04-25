const bd=[{nombre: "franco", edad: 19},{nombre: "franco", edad: 19},{nombre: "franco", edad: 19}]

const pedirProductos= ()=>{
    return new Promise((resolve,reject) =>{
        setTimeout( ()=>{
            resolve(bd)
        },3000)
    })
}

let listaProductos=[]

const contenedor= document.getElementById("contenedor")

const mostrarProductos= (listaProductos) =>{

    listaProductos.forEach(element => {
        
        contenedor.innerHTML+=`<div> ${element.nombre} </div>`

    });
}

pedirProductos()
    .then((res)=>{

        listaProductos=res
        mostrarProductos(listaProductos)

    })