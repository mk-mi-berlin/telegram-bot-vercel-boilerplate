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

async function storephoto2(ctx) {
    console.log("store2 a");
    let cld_upload_stream = await cloudinary.uploader.upload_stream(
        {
            folder: "foo"
        },
        function (error, result) {
            console.log("cld_funtion storephoto: ");
            console.log(error, result);
        }
    );
    console.log("store2 b");
    var picture = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    var url = "https://api.telegram.org/bot" + BOT_TOKEN + "/getFile?file_id=" + picture;
    console.log("store2 c");
    let x = await ctx.telegram.getFileLink(picture)
        .then(async url => {
            console.log("store2 d: " + url);

            await axios({ url, responseType: 'stream' })
                .then(response => {
                    return new Promise((resolve, reject) => {
                    console.log("store2 e: ");
                    let y = response.data.pipe(cld_upload_stream)
                            .on('finish', () => console.log("finish: " + picture))
                            .on('error', e => console.log("finish error:  " + e));
                    console.log("store2 f: " + y);
                    });
                })
                .catch(e => {console.log("store2 axios EXC: " + e)});
        })
        .catch(e => {console.log("store2 EXC: " + e)});
    return x;
}


let storephoto = () => async (ctx) => {
    debug('Triggered "storephoto" text command');
    console.log("storephoto111");
    let cld_upload_stream = cloudinary.uploader.upload_stream(
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
    let x = await ctx.telegram.getFileLink(picture)
        .then(async url => {
            console.log("storephoto mkGetfileLink: " + url);
            await axios({ url, responseType: 'stream' })
                .then(response => {
                    return new Promise((resolve, reject) => {
                        console.log("inner promise store: ");
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

export { storephoto, storephoto2 };
