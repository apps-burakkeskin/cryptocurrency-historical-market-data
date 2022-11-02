// binance settings
const binance = require('node-binance-api')().options({
    APIKEY: '',
    APISECRET: '',
    useServerTime: false,
    test: false
});

//express settings 
const express = require('express');
const app = express();
const port = 3000;

// cors for cross origin requests
const cors = require('cors');
app.use(cors());

// bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// http server
const http = require('http');
const server = http.createServer(app);

// file system
const fs = require('fs');

// crypto list for bitkasa
var binance_prices = { 
    "BTCTRY": {}, 
    "ADATRY": {}, 
    "ETHTRY": {}, 
    "AVAXTRY": {}, 
    "TRXTRY": {}, 
    "XLMTRY": {}, 
    "GMTTRY": {}, 
    "SOLTRY": {}, 
    'USDTTRY': {}, 
    "SHIBTRY": {}, 
    "HOTTRY": {}, 
    "MANATRY": {}, 
    "CHZTRY": {}, 
    "LRCTRY": {}, 
    "GALATRY": {}, 
    "NEOTRY": {}, 
    "SXPTRY": {}, 
    "FTMTRY": {}, 
    "MATICTRY": {}, 
    "MINATRY": {}, 
    "RVNTRY": {}, 
    "XRPTRY": {}, 
    "DOTTRY": {}, 
    "CHZTRY": {}, 
    "LRCTRY": {}, 
    "GALATRY": {} 
};


try {
    // binance_prices.json dosyası yoksa oluştur.
    if (!fs.existsSync('binance_prices.json')) {
        fs.writeFileSync('binance_prices.json', JSON.stringify(binance_prices));
    }

    // run code every 5 minutes
    setInterval(() => {
        Object.keys(binance_prices).forEach(function(key) {
            // TICKS DEĞERLERİ: time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored
            // Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
            binance.candlesticks(key, "1d", (error, ticks, symbol) => {
                ticks.forEach(element => {
                    binance_prices[symbol][element[0]] = element[4];
                });
            }, {limit: 1000});
        });

        //  binance_prices BTCTRY içindeki obje boş değilse binance_prices.json dosyasına yaz.
        if (Object.keys(binance_prices['BTCTRY']).length > 0) {
            fs.writeFile('binance_prices.json', JSON.stringify(binance_prices), function (err) {
                if (err) throw err;
                console.log('Binance prices are being saved to binance_prices.json file.');
            });
        }
    }, 300000); // 5 dakika
    //res.send('Binance prices are being saved to binance_prices.json file.');
}
catch (error) {
    console.log(error);
}

// binance_prices.json
app.get('/binance_prices.json', (req, res) => {
    res.sendFile(__dirname + '/binance_prices.json');
});

// listen to port
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});