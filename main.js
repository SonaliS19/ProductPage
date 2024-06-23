const http = require("http");
const fsPromises = require("fs/promises");
const fs = require("fs");
const url = require("url")

const dataText = fs.readFileSync(`${__dirname}/data.json`);
const data = JSON.parse(dataText);

const app = http.createServer(async (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/html",
    });
    // const route = req.url;
    const {query, pathname}= url.parse(req.url, true);
    // //print the query details in console
    // console.log(query);
    // console.log(pathname);

    
    switch (pathname) {
        case "/": {
            const bf = await fsPromises.readFile(`${__dirname}/Pages/homePage.html`);
            res.end(bf);
            break;
        }
        case "/products": {
            const bf = await fsPromises.readFile(`${__dirname}/pages/productsPage.html`);
            let text = bf.toString();
            let productsText = "";
            for (let i = 0; i < data.length; i++) {
                productsText += `<div class="product-card">
                        <h3>${data[i].title}</h3>
                        <img src="${data[i].thumbnail}" alt='product-image' height='200'>
                        <p>${data[i].description}</p>
                        <a href="/view?id=${data[i].id}" target="_blank">More</a>
                    </div>`;
            }
            text = text.replace("$PRODUCTS$", productsText);
            res.end(text);
            break;
        };
        case "/view": {
          // const id = query.id;
          // res.end(`<div>Id of the selected product is =  ${query.id}</div>`)
        const product = data.find((e)=>{
          if(e.id==query.id){
            return true;
          }
          else
          return false;
         });

         const bf = await fsPromises.readFile(`${__dirname}/Pages/viewPage.html`);
         let text = bf.toString();
         text = text.replace('$VIEW$',
          `<div>
          <img src="${product.thumbnail}" alt='product-image' height='200'>
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <p>${product.price}</p>
           </div>`
         )
         res.end(text);
         break;
        };

        default: {
            res.end("<h2>Oops! Page not found...</h2>");
        }
    }
});

app.listen(1400, () => {
    console.log("--------- Server Started at 1400 ----------");
});