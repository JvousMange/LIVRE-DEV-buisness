const root = document.getElementById("root"); H.cur = []; const reg = H.cur;
K3.towel(root, 130, 120); K3.plant(root, 150, 760, .9); K3.mirror(root, 260, 520, 220, 320, { round: true });
K3.bust(root, 760, 1000, .8, { spots: 8 });
K3.sign(root, "5\nRAISONS", 440, 330, { size: 110 });
K3.sink(root, 300, 1500, .9);
K3.bottle2(root, Q.green, "BHA"); 
const b=K3.bottle2(root, Q.blue, "RÉTINOL"); H.set(b,{x:800,y:1600});
K3.pad(root, 600, 1750);
H.applyAll(reg); window._res(true); window.renderAt = () => {}; window.TOTAL = 1;
