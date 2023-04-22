import { Context } from 'telegraf';
import createDebug from 'debug';
const axios = require('axios');
let cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: 'dzbs7ai6j',
    api_key: '851821869989418',
    api_secret: 'f75qTyzcIDyJ-ArkcCm2KFNYA7A',
    secure: false
});
const BOT_TOKEN = process.env.BOT_TOKEN || '';

const debug = createDebug('bot:storephoto');

const replyToMessage = (ctx: Context, messageId: number, string: string) =>
    ctx.reply(string, {
        reply_to_message_id: messageId,
    });

const storephoto = (ctx) => async (ctx2) => {
    debug('Triggered "storephoto" text command');
    console.log("storephoto111");
    let cld_upload_stream = await cloudinary.uploader.upload_stream(
        {
            folder: "foo"
        },
        function (error, result) {
            console.log("cld_funtion storephoto: ");
            console.log(error, result);
        }
    );
    console.log("storephoto222");
    
    var picture = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    var url = "https://api.telegram.org/bot" + BOT_TOKEN + "/getFile?file_id=" + picture;
    console.log("storephoto333");
    let x = await ctx.telegram.getFileLink(picture).then(url => {
        console.log("storephoto mkGetfileLink: " + url);
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
    
      });
      console.log("storephoto444");
    /*
    const messageId = ctx.message?.message_id;
    const userName = `${ctx.message?.from.first_name} ${ctx.message?.from.last_name}`;
  
    if (messageId) {
      await replyToMessage(ctx, messageId, `Hello, ${userName}!`);
    }
    */
   return x;
};

export { storephoto };
