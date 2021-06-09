var baseUrl = "https://back-bsale.herokuapp.com/";

function getCategories(url) {
  /*Metodo que me carga las categorias apenas el dom carga*/
  fetch(`${baseUrl}${url}`)
    .then((response) => response.json())
    .then((data) => {
      const selectElement = document.getElementById("select");
      const categories = [...data];
      categories.forEach((category) => {
        let optionContent = `
            <option value="${category.id}">${category.name}</option>
        `;
        selectElement.innerHTML += optionContent;
      });
    })
    .catch((err) => {
    /*de existir un error en la peticion dibuja en el dom un alert para indicarle al usuario cual fue el error*/
      const errorContainer = document.getElementById("error");
      let divContent = `
        <div id="error" class="alert alert-primary d-flex align-items-center" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
          <div>
            ${err}
          </div>
        </div>
      `;
      errorContainer.innerHTML += divContent;
      console.log(err);
    });
}

function select(value){
    /*funcion que me permite agrupar los productos por categorias */
    if(value != "-1"){
        /*entra en este if solo si la etiqueta seleccionada del combo es distinta a el label de "Busque por categoria "*/
        if(value == "all"){
            /*si entra por aca quiere decir que el usuario selecciono en el comboBox la opcion de traer todos */
            document.getElementById("cards").innerHTML="";
            getProducts('product/');
        }else{
            /*si entra por aca quiere decir que el usuario selecciono en el comboBox una opcion distinta de  traer todos */
            document.getElementById("cards").innerHTML="";
            getProducts(`product/${value}`)
        }
    }
}

function getProducts(url) {
    /*metodo estandar que me connsulta la bd, lo primero que hace es activar el loader para que el usuario sepa que esta en proceso su busqueda */
    let loaderElement = document.getElementById("loaderParent");
    let loaderContent = `
        <div class="text-center">
            <div class="spinner-grow text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-secondary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-success" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-danger" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-warning" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-info" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-light" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="spinner-grow text-dark" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

    `;
    loaderElement.innerHTML += loaderContent;
    fetch(`${baseUrl}${url}`)
        .then((response) => response.json())
        .then((data) => {
            /*cuando se obtenga la respuiesta del servidor, el primero desactiva el loader */
            loaderElement.innerHTML="";
            if(data.length >0){
                const cardsContainer = document.getElementById("cards");
                const products = [...data];
                console.log(products);
                /*recorremos el arreglo que trae la informacion de la consulta para poder insertarlo en los cards */
                products.forEach((product) => {
                    if(product.url_image== null || product.url_image ==""){
                        /*si entra por aca es porque el item iterado no tiene imagen y se le asigna una generica para indicar esto y evitar un 404 */
                        let divContent = `
                            <div class="col cardChild">
                                <div class="card h-100">
                                <img  src="./recursos/defaultImage.png" class="w-50 h-50 card-img-top m-auto" alt="${product.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${product.name}</h5>
                                    <p class="card-text"><p class="card-text">${product.name} tiene un precio de $${product.price}CLP su descuento es de: ${product.discount}%</p></p>
                                </div>
                                </div>
                            </div>
                        `;
                        cardsContainer.innerHTML += divContent;
                    }else{
                        /*si entra por aca es que tiene todos sus campos de manera perfecta */
                        let divContent = `
                            <div class="col cardChild">
                                <div class="card h-100">
                                <img src="${product.url_image}" class="w-50 h-50 card-img-top m-auto" alt="${product.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${product.name}</h5>
                                    <p class="card-text"><p class="card-text">${product.name} tiene un precio de $${product.price}CLP su descuento es de: ${product.discount}%</p></p>
                                </div>
                                </div>
                            </div>
                        `;
                        cardsContainer.innerHTML += divContent;
                    }
                });
            }else{
                /*si entra aqui es porque el resultado de la busqueda no tuvo resultados */
                const cardsContainer = document.getElementById("cards");
                let divContent = `
                    <div class="align-items-center">
                        <h3>No existen detalles para esta busqueda</h3>
                    </div>
                `;
                cardsContainer.innerHTML += divContent;
            }
        })
        .catch((err) => {
            /*si entra aqui es porque ka consulta fracaso y se pinta el error respectivo */
            loaderElement.innerHTML="";
            const errorContainer = document.getElementById("error");
            let divContent = `
                <div id="error" class="alert alert-primary d-flex align-items-center" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <div>
                    ${err}
                </div>
                </div>
            `;
            errorContainer.innerHTML += divContent;
            console.log(err);
        });
}

function searchByName(value){
    /*Metodo que me permite consultar la bd para productos por nombre, en el back busca con expresiones regulares*/
    if(value == ""){
        /*Entra en este condicional solo si el parametro de busqueda entra como vacio */
        document.getElementById("cards").innerHTML="";
        getProducts('product/');
    }else{
        /*Entra en este condicional solo si el parametro de busqueda es distinto de vacio*/
        document.getElementById("cards").innerHTML="";
        getProducts(`product/search/${value}`);
    }
}