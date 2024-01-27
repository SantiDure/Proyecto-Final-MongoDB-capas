function irAPag(limit) {
  const pagDeseada = document.querySelector("input").value || 1;
  window.location = `/products?limit=${limit}&page=${pagDeseada}`;
}

async function agregarAlCarrito(productoId) {
  await fetch(
    `api/carts/560b1af2-174d-4835-9e92-d3cde7f7d5d7/product/${productoId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((response) => {
    if (!response.ok) {
      throw new Error("Error al agregar al carrito");
    }
    return response.json();
  });
}
