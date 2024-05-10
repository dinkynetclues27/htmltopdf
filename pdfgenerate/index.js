const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const path = require('path')
const app = express();
const homeRoutes = require('./routes/homeroutes')


app.use(expressLayouts);
app.set('view engine','ejs')


app.use(express.static(path.join(__dirname,'public')));
app.use('/docs',express.static(path.join(__dirname,'docs')))
app.use(homeRoutes.routes);

app.listen(4000,()=>console.log("app is listening on 4000 port"));
