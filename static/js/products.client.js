function irAPag(limit) {
  const pagDeseada = document.querySelector("input").value || 1;
  window.location = `/products?limit=${limit}&page=${pagDeseada}`;
}
let idcarrito = document.querySelector("#id-carrito").innerText;
console.log(idcarrito);
async function agregarAlCarrito(productoId) {
  await fetch(`api/carts/${idcarrito}/product/${productoId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Error al agregar al carrito");
    }
    return response.json();
  });
}
