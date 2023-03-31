const http = require('http');
const { PORT = 3000} = process.env;

const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const car = require('../public/scripts/car.js');
const carsData = require('../data/cars.json');
const cars = carsData.map(carData => new car(carData));

const PUBLIC_DIRECTORY = path.join(__dirname, '../public');
const PUBLIC_DIRECTORY_CSS = path.join(__dirname, '../public/css');
const PUBLIC_DIRECTORY_IMAGES = path.join(__dirname, '../public/images/home');
const PUBLIC_DIRECTORY_IMAGES_CAR = path.join(__dirname, '../public/images');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(PUBLIC_DIRECTORY, 'index.html'))
});

app.get("/cars", (req, res) => {
    res.sendFile(path.join(PUBLIC_DIRECTORY, 'cars.html'))
});

app.get("/filterAvailable", (req, res) => {
    const { available } = req.query;
    const { date } = req.query;
    const { time } = req.query;
    const penumpang = req.query.penumpang;

    const filteredCars = cars.filter(car => {
        const dateValue = new Date(date);
        const year = dateValue.getFullYear();

        if (available == '') {
        } else if (available == 'true' && car.year == year && car.capacity >= penumpang) {
            return car.available == true && car.year == year && car.capacity >= penumpang
        } else if (available == 'false' && car.year == year && car.capacity >= penumpang) {
            return car.available == false && car.year == year && car.capacity >= penumpang
        }
    });

    if (filteredCars.length == 0) {
        const alert = `
        <div class="container text-center" role="alert">
            <p class="alert-heading">
            </p>
            <p>Data tidak ditemukan</p>
        </div>
        `
        res.send(alert);
    }
    res.render('cars', { cars: filteredCars });
});

app.get("/style.css", (req, res) => {
    res.sendFile(path.join(PUBLIC_DIRECTORY_CSS, 'style.css'))
});

app.get("/images/home/:imageName", (req, res) => {
    const imageName = req.params.imageName
    res.sendFile(path.join(PUBLIC_DIRECTORY_IMAGES, `${imageName}`))
});
app.get("/image/:imageName", (req, res) => {
    const imageName = req.params.imageName
    res.sendFile(path.join(PUBLIC_DIRECTORY_IMAGES_CAR, `${imageName}`))
});

app.use((req, res) => {
    res.sendFile(PUBLIC_DIRECTORY, '404.html');
});

app.listen(PORT, () => {
    console.log("http://localhost:%d", PORT)
});