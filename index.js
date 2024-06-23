const express = require("express");
const app = express();
const port  = process.env.PORT || 9000;
const expressHbs = require("express-handlebars");
const expressHbsPaginate = require("express-handlebars-paginate");

app.use(express.static(__dirname + "/html"));
app.engine("hbs", 
    expressHbs.engine({
        layoutsDir: __dirname + "/views/layouts",
        defaultLayout: "layout",
        extname: "hbs",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
        },
        helpers: {
            createPagination: expressHbsPaginate.createPagination,
            formatDate: (date) => {
                return date.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric' 
                });
            }
        }
    })
);

app.set("view engine", "hbs");

app.get('/', (req,res) => {
   res.redirect('/blogs'); 
});

app.use('/blogs', require('./routes/blogsRouter'));

app.listen(port, () => console.log(`Current app listening on port ${port}!`));