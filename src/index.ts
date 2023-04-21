import { Telegraf } from 'telegraf';

import { about } from './commands';
import { greeting } from './text';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';


//import 'axios';
const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(BOT_TOKEN);



bot.command('about', about());

bot.on('photo',  (ctx) => {
  //console.log(JSON.stringify(ctx.update.message.photo.pop()));
  const fileId = "idaefad";
  const Axios = require('axios');
  const fs = require('fs');
  const FileDownload = require('js-file-download');
  let cloudinary = require("cloudinary").v2;
  //CLOUDINARY_URL=cloudinary://851821869989418:f75qTyzcIDyJ-ArkcCm2KFNYA7A@dzbs7ai6j
  cloudinary.config({ 
    cloud_name: 'dzbs7ai6j', 
    api_key: '851821869989418', 
    api_secret: 'f75qTyzcIDyJ-ArkcCm2KFNYA7A',
    secure: true
  });
  const token = process.env.BOT_TOKEN;
  var picture = ctx.message.photo[ctx.message.photo.length - 1].file_id; 
  var url = "https://api.telegram.org/bot"+token+"/getFile?file_id=" + picture;
  console.log("pic " + picture);
  /*Axios({
    url: url,
    method: 'GET',
    responseType: 'blob', // Important
  }).then((response) => {
      FileDownload(response.data, '${picture}.jpg');
      console.log("dl: " + '${picture}.jpg');
  });
  */

  let cld_upload_stream = cloudinary.uploader.upload_stream(
    {
      folder: "foo"
    },
    function(error, result) {
        console.log(error, result);
    }
);


  ctx.telegram.getFileLink(picture).then(url => {    
    Axios({url, responseType: 'stream'}).then(response => {
        return new Promise((resolve, reject) => {
            //response.data.pipe(fs.createWriteStream(`img/${ctx.update.message.from.id}-${picture}.jpg`))
            response.data.pipe( cld_upload_stream )
                        .on('finish', () => console.log("finish: " + picture))
                        .on('error', e => console.log("finish error:  " + e))
                });
            })
})
 const filepath = ctx.telegram.getFileLink(picture);
 console.log("urel: " + url);
 console.log("filepath: " + filepath);
  
  //ctx.reply(JSON.stringify({asd: "adijfdijfij"}));
  
});

bot.on('message', (ctx) => {
  ctx.reply(ctx.message.message_id.toString());
  /*ctx.replyWithPhoto({
    url: 'https://picsum.photos/200/300/?random',
    filename: 'kitten.jpg'
  })*/
});

//bot.on('message', greeting());

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
