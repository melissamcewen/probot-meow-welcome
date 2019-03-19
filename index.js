// Update this with your glitch Remix URL + my-app when you remix
const yourAppUrl = 'https://probot-meow-welcome.glitch.me/my-app/';

const { Canvas } = require('canvas');
const fs = require('fs');

module.exports = (app) => {
  // Your code here
  app.log('Yay! The app was loaded!');
  const router = app.route('/my-app');

  // Use any middleware
  router.use(require('express').static('.data'));

  // example of probot responding with a custom cat picture when a new issue is posted
  app.on('issues.opened', async (context) => {
    // grabbing info about the issue including who posted it
    const issue = (await context.github.issues.get(context.issue())).data;
    // if we have a valid user we'll send them a cat pic
    if (issue.user != null) {
      const user = issue.user.login;
      // to make a pic we'll use 
      const { createCanvas, loadImage } = require('canvas');
      const canvas = createCanvas(923, 918);
      const ctx = canvas.getContext('2d');
      
      //You can use whatever cat you want but I decided to use my co-worker Cassey's cat since he has a pretty sweet Glitch site https://soulpatch.glitch.me/
      const background = await loadImage('https://cdn.glitch.com/95289388-955a-4ae8-898b-e2b7922598e1%2Fcat1.jpg');
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.font = '60px Arial';
      const grd = ctx.createLinearGradient(0.0, 450.0, 900.0, 450.0);

      // Add RAINBOW
      grd.addColorStop(0.0, 'rgba(179, 6, 169, 1.000)');
      grd.addColorStop(0.16, 'rgba(239, 38, 103, 1.000)');
      grd.addColorStop(0.32, 'rgba(244, 46, 44, 1.000)');
      grd.addColorStop(0.48, 'rgba(255, 165, 9, 1.000)');
      grd.addColorStop(0.64, 'rgba(253, 252, 0, 1.000)');
      grd.addColorStop(0.8, 'rgba(85, 172, 47, 1.000)');
      grd.addColorStop(0.96, 'rgba(11, 19, 253, 1.000)');
      grd.addColorStop(1.0, 'rgba(168, 4, 175, 1.000)');

      // Fill with gradient
      ctx.fillStyle = grd;
      // you can use any text you like here
      ctx.fillText('WELCOME CAT!', 50, 100);
      ctx.font = '40px Arial';

      ctx.fillText('WELCOME ' + user, 50, 800);
      // turn it into a PNG
      const out = fs.createWriteStream('.data/' + user + '.png');
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      await out.on('finish', () => console.log('The PNG file was created.'));
      //reply to the issue with the cat picture!
      const reply = '![Welcome cat welcomes you](' + yourAppUrl + user + '.png)';
      const params = context.issue({ body: reply });
      context.github.issues.createComment(params);
    }


  });
};
