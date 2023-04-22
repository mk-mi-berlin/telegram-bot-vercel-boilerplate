import { Context, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

import { about } from './commands';
import { greeting } from './text';
import { storephoto } from './photo';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';
import createDebug from 'debug';

const debug = createDebug('bot:greeting_text');

//import 'axios';
const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(BOT_TOKEN);
const axios = require('axios');
const fs = require('fs');
let cloudinary = require("cloudinary").v2;
//CLOUDINARY_URL=cloudinary://851821869989418:f75qTyzcIDyJ-ArkcCm2KFNYA7A@dzbs7ai6j
cloudinary.config({
  cloud_name: 'dzbs7ai6j',
  api_key: '851821869989418',
  api_secret: 'f75qTyzcIDyJ-ArkcCm2KFNYA7A',
  secure: false
});
let cld_upload_stream2 = cloudinary.uploader.upload_stream(
  {
    folder: "foo"
  },
  function (error, result) {
    console.log("cld_funtion2: ");
    console.log(error, result);
  }
);

const token = process.env.BOT_TOKEN;

bot.command('about', about());

let mkGetFileLink = (c) => async (ctx) => {
  
  console.log("entering mkGetFileLink");
  var msg = ctx.message;
  var picture = msg.photo[ctx.message.photo.length - 1].file_id;
  var url = "https://api.telegram.org/bot" + token + "/getFile?file_id=" + picture;
  let x = await ctx.telegram.getFileLink(picture).then(url => {
    console.log("mkGetfileLink: " + url);
    /*axios({ url, responseType: 'stream' })
      .then(response => {
        return new Promise((resolve, reject) => {
          console.log("inner promise: ");
          //response.data.pipe(fs.createWriteStream(`img/${ctx.update.message.from.id}-${picture}.jpg`))
          response.data.pipe(cld_upload_stream2)
            .on('finish', () => console.log("finish: " + picture))
            .on('error', e => console.log("finish error:  " + e))
        });
      })
      .catch(e => { console.log("catched axios e: " + e) });
*/
  });

  console.log("exit mkGetFileLink");
  return x;
}
const storePhoto = (ctx) => async (ctx2: Context) => {
  //const message = `*${name} ${version}*\n${author}`;
  //debug(`Triggered "about" command with message \n${message}`);
  //await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
  let cld_upload_stream = cloudinary.uploader.upload_stream(
    {
      folder: "foo"
    },
    function (error, result) {
      console.log("cld_funtion1: ");
      console.log(error, result);
    }
  );
  console.log("entering storephoto");
  var picture = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  var url = "https://api.telegram.org/bot" + token + "/getFile?file_id=" + picture;

  let x = await ctx.telegram.getFileLink(picture).then(url => {
    console.log("Filelink: " + url);
    axios({ url, responseType: 'stream' })
      .then(response => {
        return new Promise((resolve, reject) => {
          console.log("inner promise: ");
          //response.data.pipe(fs.createWriteStream(`img/${ctx.update.message.from.id}-${picture}.jpg`))
          response.data.pipe(cld_upload_stream)
            .on('finish', () => console.log("finish: " + picture))
            .on('error', e => console.log("finish error:  " + e))
        });
      })
      .catch(e => { console.log("catched axios e: " + e) });
  })
};

export { about };
//bot.on(message('photo'), mkGetFileLink(bot.context));
bot.on(message('photo'), storePhoto(bot.context));

/*
bot.on(message('photo'), (ctx) => {
  console.log("1");
  //storePhoto(ctx);
  let y = mkGetFileLink(ctx);
  debug("asd");
  console.log("2");
});
*/
/*
bot.on(message('photo'), (ctx) => {
  console.log("3");
  return;
  //console.log(JSON.stringify(ctx.update.message.photo.pop()));
  //const fileId = "idaefad";

  //const FileDownload = require('js-file-download');


  var picture = ctx.message.photo[ctx.message.photo.length - 1].file_id;
  var url = "https://api.telegram.org/bot" + token + "/getFile?file_id=" + picture;
  console.log("pic_: " + picture);
  console.log("url_: " + url);
  

  let cld_upload_stream = cloudinary.uploader.upload_stream(
    {
      folder: "foo"
    },
    function (error, result) {
      console.log("cld_funtion: ");
      console.log(error, result);
    }
  );

  console.log("before geting filel ink");
  let x = ctx.telegram.getFileLink(picture).then(url => {
    console.log("Filelink: " + url);
    axios({ url, responseType: 'stream' })
      .then(response => {
        return new Promise((resolve, reject) => {
          console.log("inner promise: ");
          //response.data.pipe(fs.createWriteStream(`img/${ctx.update.message.from.id}-${picture}.jpg`))
          response.data.pipe(cld_upload_stream)
            .on('finish', () => console.log("finish: " + picture))
            .on('error', e => console.log("finish error:  " + e))
        });
      })
      .catch(e => { console.log("catched axios e: " + e) });
  })
  //const filepath = ctx.telegram.getFileLink(picture);
  //console.log("_1_url: " + url);
  //console.log("_filepath: " + filepath);

  //ctx.reply(JSON.stringify({asd: "adijfdijfij"}));
  console.log("__x: " + x);
  return x;
});
*/
bot.on('message', (ctx) => {
  //ctx.reply(ctx.message.message_id.toString());
  greeting();
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
