const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const toIco = require('to-ico');

(async function(){
  try{
    const publicDir = path.join(__dirname, '..', 'public');
    const iconsDir = path.join(publicDir, 'icons');
    if(!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

    const pngLogoPath = path.join(publicDir, 'logo.png');
    const svgLogoPath = path.join(__dirname, '..', 'src', 'assets', 'logo.svg');

    let sourceBuffer = null;
    let sourceIsSvg = false;

    if(fs.existsSync(pngLogoPath)){
      try{
        // quick check that sharp can read it
        await sharp(pngLogoPath).metadata();
        sourceBuffer = fs.readFileSync(pngLogoPath);
        sourceIsSvg = false;
        console.log('Using PNG logo at', pngLogoPath);
      }catch(e){
        console.warn('PNG logo present but unreadable by sharp, will try SVG fallback.');
      }
    }

    if(!sourceBuffer){
      if(fs.existsSync(svgLogoPath)){
        console.log('Falling back to SVG logo at', svgLogoPath);
        sourceBuffer = fs.readFileSync(svgLogoPath);
        sourceIsSvg = true;
      }else{
        console.error('No usable logo found. Looked for', pngLogoPath, 'and', svgLogoPath);
        process.exit(2);
      }
    }

    const sizes = [16, 32, 48, 64, 192, 512];
    for(const s of sizes){
      const out = path.join(iconsDir, `icon-${s}.png`);
      if(sourceIsSvg){
        await sharp(sourceBuffer).resize(s, s).png({ quality: 90 }).toFile(out);
      }else{
        await sharp(sourceBuffer).resize(s, s, { fit: 'cover' }).png({ quality: 90 }).toFile(out);
      }
      console.log('Wrote', out);
    }

    // also output favicon-32x32 and favicon-16x16 at public root for compatibility
    await sharp(path.join(iconsDir, 'icon-32.png')).toFile(path.join(publicDir, 'favicon-32x32.png'));
    await sharp(path.join(iconsDir, 'icon-16.png')).toFile(path.join(publicDir, 'favicon-16x16.png'));
    console.log('Wrote favicon PNGs');

    // create favicon.ico from 16/32/48 using to-ico (buffers)
    const buffers = [
      fs.readFileSync(path.join(iconsDir, 'icon-16.png')),
      fs.readFileSync(path.join(iconsDir, 'icon-32.png')),
      fs.readFileSync(path.join(iconsDir, 'icon-48.png')),
    ];
    const icoBuffer = await toIco(buffers);
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
    console.log('Wrote favicon.ico');

    // copy maskable icon
    await sharp(path.join(iconsDir, 'icon-512.png')).toFile(path.join(publicDir, 'icons', 'maskable_icon.png'));

    console.log('All icons generated successfully.');
  }catch(err){
    console.error('Icon generation failed:', err);
    process.exit(1);
  }
})();
