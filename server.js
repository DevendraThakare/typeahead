import path from "path";
import express from "express";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import webpackConfig from "./webpack.config.js";
import fs from "fs";
import _ from "underscore";


const app = express();
const DIST_DIR = path.join(__dirname, "dist");
const HTML_FILE = path.join(__dirname, "index.html");
const isDevelopment = process.env.NODE_ENV !== "production";
const DEFAULT_PORT = 3000;
const compiler = webpack(webpackConfig);

if (isDevelopment) {
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath
    })
  );

  app.use(webpackHotMiddleware(compiler));
} else {
  app.use(express.static(path.join(__dirname, "dist")));
}
app.get("/", (req, res) => res.sendFile(HTML_FILE));
app.get("/fetchCarsSuggestions", (req, res) => {
    const query = req.query.q
    let suggestions = []
    if(query){
        var data = fs.readFileSync(path.join(__dirname, "cars.json") , "utf8");
        suggestions = _.filter(JSON.parse(data), (obj) => {
            return obj.name.toLowerCase().indexOf(query.toLowerCase()) !== -1; 
        });
    }
    res.send(suggestions)
})


app.listen(process.env.PORT || DEFAULT_PORT);
