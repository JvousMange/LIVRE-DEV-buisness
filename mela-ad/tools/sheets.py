import sys,glob,os
from PIL import Image,ImageDraw
d=sys.argv[1]; per=int(sys.argv[2]) if len(sys.argv)>2 else 12; cols=6
fs=sorted(glob.glob(d+'/*.jpg'))
for k in range(0,len(fs),per):
    ch=fs[k:k+per]; w,h=330,587; rows=(len(ch)+cols-1)//cols
    S=Image.new('RGB',(w*cols,h*rows),'white'); dr=ImageDraw.Draw(S)
    for i,f in enumerate(ch):
        S.paste(Image.open(f).resize((w,h)),((i%cols)*w,(i//cols)*h)); dr.text(((i%cols)*w+6,(i//cols)*h+4),os.path.basename(f)[:-4],fill='yellow')
    S.save(f'{d}_S{k//per}.jpg',quality=82)
print(len(fs))
