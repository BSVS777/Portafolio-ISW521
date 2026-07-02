export const renderizarResultado = (cantidad) => {

    const contenedor = document.querySelector("#app");
    contenedor.innerHTML = ` <div>
    <h1><h2>Gestion de usuarios</h2><h/1>
    <p>La cantidad de usuarios es de: <strong>${cantidad}</strong></p>
    </div>
    `;
};

