async function createCanap(){
    const reponse = await fetch("http://localhost:3000/api/products");
    const canaps = await reponse.json();
    for(let i = 0; i < canaps.length; i++){
     
        const section = document.getElementById("items");
        const article = document.createElement("article");
        const image = document.createElement("img");
        const link = document.createElement("a");
        link.href = `./product.html?id=${canaps[i]._id}`;
        image.src = canaps[i].imageUrl;
        image.alt = canaps[i].altTxt;
        const name = document.createElement("h3");
        name.innerText = canaps[i].name;
        name.classList.add("productName");
        const description = document.createElement("p");
        description.innerText = canaps[i].description;
        description.classList.add("productDescription");
        article.appendChild(image);
        article.appendChild(name);
        article.appendChild(description);
        link.appendChild(article);
        section.appendChild(link);

    }
    
}
createCanap()
    