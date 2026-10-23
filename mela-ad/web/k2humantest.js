const root = document.getElementById("root"); H.cur = []; const reg = H.cur;
const poses = [
  ["worried", w => { w.exp({ brow: 1, mouth: "sad" }); w.idle(); }],
  ["rub cheek (pad)", w => { w.exp({ brow: .4, mouth: "flat" }); w.reach("R", 82, -190); K.hold.pad(w.armR.hand); w.reach("L", -178, 340); }],
  ["sponge", w => { w.exp({ brow: 0, mouth: "flat" }); w.reach("R", 84, -185); K.hold.sponge(w.armR.hand); w.reach("L", -110, 120); K.hold.bottle(w.armL.hand); }],
  ["box sceptique", w => { w.exp({ brow: .7, mouth: "sad", raise2: 1 }); w.reach("L", -150, -20); K.hold.box(w.armL.hand); w.reach("R", 150, 120); K.hold.tube(w.armR.hand); }],
  ["wince scrub", w => { w.exp({ brow: 1, eyes: "squint", mouth: "wince" }); w.reach("R", 82, -188); K.hold.scrub(w.armR.hand); w.reach("L", -178, 340); }],
  ["sun", w => { w.exp({ brow: .6, eyes: "squint", mouth: "o" }); w.reach("R", 100, -300); w.reach("L", -178, 340); }],
  ["mirror smile", w => { w.exp({ brow: -.3, mouth: "smile" }); w.reach("R", 190, -140); K.hold.mirror(w.armR.hand); w.reach("L", -178, 340); }],
  ["point", w => { w.exp({ brow: 0, mouth: "smirk" }); w.reach("R", 118, -150); w.reach("L", -178, 340); }],
  ["serum", w => { w.exp({ brow: -.2, mouth: "smile" }); w.reach("R", 130, -230); K.hold.dropper(w.armR.hand); w.reach("L", -110, 130); K.hold.bottle(w.armL.hand); }],
  ["arms crossed", w => { w.exp({ brow: .5, mouth: "flat", raise2: 1 }); w.reach("L", 110, 110, -1); w.reach("R", -110, 150, -1); }],
  ["phone grin", w => { w.exp({ brow: -.3, mouth: "grin" }); w.reach("R", 170, 10); K.hold.phone(w.armR.hand); w.reach("L", -110, 130); K.hold.bottle(w.armL.hand); }],
  ["spots", w => { w.exp({ brow: .8, mouth: "sad" }); w.idle(); }]
];
poses.forEach(([nm, f], i) => { const w = K.woman(root, 180 + (i % 3) * 360, 380 + Math.floor(i / 3) * 450, .5, { spots: i === 11 ? 10 : 0 }); f(w); const t = H.txt(root, nm, 180 + (i % 3) * 360, 470 + Math.floor(i / 3) * 450 + 190, 28, "#3B2216", { w: 800 }); });
H.applyAll(reg); window._res(true); window.renderAt = () => {}; window.TOTAL = 1;
