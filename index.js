const express = require("express");
const cors = require("cors");
const redis = require("./redisClient");

const app = express();
const port = 6001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// ❗ ย้ายข้อมูลจาก backend เดิมมาเฉพาะ category
const menumain = [
  { id: 1, name: 'กะเพราะหมูกรอบ', price: 80, image: 'https://i.ytimg.com/vi/16Odh9KFPK0/maxresdefault.jpg' },
  { id: 2, name: 'หมี่กรอบผัดซีอิ๊ว', price: 60, image: 'https://img.wongnai.com/p/l/2017/11/27/de6df13f67284c978aca21e3a0c52218.jpg' },
  { id: 3, name: 'ก๋วยเตี๋ยวคั่วไก่', price: 70, image: 'https://s3-ap-southeast-1.amazonaws.com/photo.wongnai.com/photos/2017/03/29/a3b7af34297c416e90e9c1694ffd206c.jpg' },
  { id: 4, name: 'สุกี้แห้งไก่', price: 60, image: 'https://img.wongnai.com/p/l/2017/05/29/6988f264122945718442c9e258babdcb.jpg' },
  { id: 5, name: 'ข้าวหมูแดง', price: 60, image: 'https://img.wongnai.com/p/1920x0/2018/07/03/ed7ed753c9f5433fa1afa1a3bfb83796.jpg' },
  { id: 6, name: 'ข้าวหมูแดงหมูกรอบ', price: 75, image: 'https://static.thairath.co.th/media/dFQROr7oWzulq5FZX9z21BD6BkebjldCkR4f9gV00c9oK5ObfveJSI516A5C0jFDXvC.webp' },
  { id: 7, name: 'ข้าวขาหมูเยอรมัน', price: 100, image: 'https://img.wongnai.com/p/400x0/2019/06/14/5f9da9d4fb2446548bb7aeed0ff688c2.jpg' },
  { id: 8, name: 'ข้าวหน้าเนื้อ', price: 120, image: 'https://api2.krua.co/wp-content/uploads/2022/07/RI1765_Gallery_-01.jpg' },
  { id: 9, name: 'สเต็กเนื้อ', price: 120, image: 'https://www.calforlife.com/image/food/Beefsteak.jpg' },
  { id: 10, name: 'ข้าวผัดอเมริกัน', price: 115, image: 'https://img.wongnai.com/p/l/2017/05/29/8516e11c77244de6a5f6ac74faa138c5.jpg' },
  { id: 11, name: 'ข้าวหน้าหมูทอด', price: 65, image: 'https://img.wongnai.com/p/1920x0/2018/05/25/bc59677defba440b9d6a4507b903df65.jpg' },
  { id: 12, name: 'ข้าวยำไก่แซ่บ', price: 65, image: 'https://img.wongnai.com/p/1920x0/2020/11/07/95ce4ec6055a4e02a650c1c58dd41849.jpg' },
  { id: 13, name: 'หอยทอด', price: 75, image: 'https://img.wongnai.com/p/l/2017/05/29/5309d0a9b15d4907b6389b6a6787fc7e.jpg' },
  { id: 14, name: 'ข้าวน้ำพริกกะปิปลาทู', price: 75, image: 'https://img.wongnai.com/p/1920x0/2018/03/01/a47f84a3a653472cb86d4874ac22e2fe.jpg' },
  { id: 15, name: 'สปาเกตตี้แฮมเห็ด', price: 110, image: 'https://inwfile.com/s-cy/8avqkv.jpg' },
];

const menusnack = [
  { id: 1, name: 'นักเก็ต', price: 50, image: 'https://cdn8.devgodigit.net/wp-content/uploads/2021/09/30191243/051052534_F.jpg' },
  { id: 2, name: 'ไก่ทอด', price: 30, image: 'https://i.ytimg.com/vi/60xSNZvr7Ck/maxresdefault.jpg' },
  { id: 3, name: 'ไส้กรอกทอด', price: 40, image: 'https://fit-d.com/uploads/food/16cca95edc9ab6185c8720bed16ae178.jpg' },
  { id: 4, name: 'ไก่จ๊อ', price: 45, image: 'https://www.sgethai.com/wp-content/uploads/2022/09/220908-Content-%E0%B9%81%E0%B8%88%E0%B8%81%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%A3%E0%B9%84%E0%B8%81%E0%B9%88%E0%B8%88%E0%B9%8A%E0%B8%AD02.webp' },
  { id: 5, name: 'ชีสบอล', price: 40, image: 'https://i.ytimg.com/vi/2Sdsm37ID5Q/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD2gtZijNMm8apP57QFeRD_dduotQ' },
  { id: 6, name: 'เกี๊ยวซ่า', price: 30, image: 'https://www.thevschool.com/wp-content/uploads/2023/04/Gyoza-Cooking-683x1024.jpg' },
  { id: 7, name: 'เฟรนฟราย', price: 40, image: 'https://sausagemaker.com/wp-content/uploads/Homemade-French-Fries_8.jpg' },
  { id: 8, name: 'หอมทอด', price: 40, image: 'https://img-global.cpcdn.com/recipes/7334986d3c4fbd44/1200x630cq70/photo.jpg' },
  { id: 9, name: 'ปอเปี๊ยะทอด', price: 35, image: 'https://s359.kapook.com/pagebuilder/14d11bd0-fcb8-4a03-80ee-05da3fc93bb0.jpg' },
  { id: 10, name: 'ปลาไข่ทอดกรอบ', price: 35, image: 'https://i.ytimg.com/vi/7CavYUXJeiY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDSgerI5xAw3SKpeO-JJccwUcV8fA' },
  { id: 11, name: 'หมูแดดเดียว', price: 50, image: 'https://sou-dai.com/wp-content/uploads/2020/12/maxresdefault-1024x576.jpg' },
  { id: 12, name: 'ทอดมันกุ้ง', price: 50, image: 'https://img.kapook.com/u/2016/surauch/cook1/v5_1.jpg' },
];

const menudrink = [
  { id: 1, name: 'โค้ก', price: 20, image: 'https://st.bigc-cs.com/cdn-cgi/image/format=webp,quality=90/public/media/catalog/product/17/88/8851959632017/8851959632017_11-20240619113957-.jpg' },
  { id: 2, name: 'น้ำเปล่า', price: 10, image: 'https://www.cokeshopth.com/pub/media/catalog/product/cache/e0b9252e27a8956bf801d8ddef82be21/n/a/namthip1.5l_3.jpg' },
  { id: 3, name: 'เป๊ปซี่', price: 20, image: 'https://st.bigc-cs.com/cdn-cgi/image/format=webp,quality=90/public/media/catalog/product/77/88/8858998571277/8858998571277_2-20240610141651-.jpg' },
  { id: 4, name: 'ชามะนาว', price: 35, image: 'https://s359.kapook.com/pagebuilder/aea20974-a1b8-44d5-be43-c018b6448758.jpg' },
  { id: 5, name: 'น้ำแดงโซดา', price: 20, image: 'https://s.isanook.com/wo/0/ud/38/190409/3.jpg?ip/resize/w728/q80/jpg' },
  { id: 6, name: 'ชาเย็น', price: 35, image: 'https://www.punthaicoffee.com/stocks/article/o0x0/aw/r9/nqt4awr9b8k/article6-1-cover.jpg' },
  { id: 7, name: 'นมชมพู', price: 20, image: 'https://www.sgethai.com/wp-content/uploads/2022/06/16042024-pinkmilk-001.webp' },
  { id: 8, name: 'นมสด', price: 25, image: 'https://yalamarketplace.com/upload/1621167988585.png' },
  { id: 9, name: 'น้ำเขียวโซดา', price: 20, image: 'https://s.isanook.com/wo/0/ud/38/190829/4.jpg?ip/resize/w728/q80/jpg' },
  { id: 10, name: 'น้ำส้ม', price: 30, image: 'https://gda.thai-tba.or.th/wp-content/uploads/2019/06/packshot-mm-splash-250-ml-new-icon.jpg' },
  { id: 11, name: 'กาแฟเย็น', price: 35, image: 'https://www.nestleprofessional.co.th/sites/default/files/styles/np_recipe_detail/public/2022-04/nescafe-iced-signature-540x400.jpg?itok=5gl_au1G' },
  { id: 12, name: 'น้ำมะนาว', price: 25, image: 'https://img.kapook.com/u/2017/surauch/cooking/j1_10.jpg' },
  { id: 13, name: 'น้ำสตรอเบอรี่ปั่น', price: 40, image: 'https://s359.kapook.com/r/600/auto/pagebuilder/86801056-6e7d-4824-b75e-12496a5e83dd.jpg' },
  { id: 14, name: 'น้ำมะพร้าวปั่น', price: 40, image: 'https://img.wongnai.com/p/1920x0/2020/11/03/342d45b9405e485dadb6ac01625f7de6.jpg' },
  { id: 15, name: 'น้ำแตงโมปั่น', price: 40, image: 'https://img.kapook.com/u/2024/sireeporn/Cooking-01/watermelon-smoothie-02.jpg' },
  { id: 16, name: 'น้ำมะม่วงปั่น', price: 40, image: 'https://www.bluemochatea.com/wp-content/uploads/2020/02/df8de098561a36641f05ace8de86ea42-1024x1024.jpg' },
  { id: 17, name: 'น้ำผลไม้รวม', price: 45, image: 'https://res.cloudinary.com/dk0z4ums3/image/upload/v1701182614/attached_image_th/colorfulsmoothiehealthydetoxvitamindietorveganfoodconcept.jpg' },
];

app.get("/api/categories/main", async (req, res) => {
  console.log("GET /api/categories/main");

  try {
    const cache = await redis.get("menumain");

    if (cache) {
      console.log("Redis cache HIT: menumain");
      return res.json(JSON.parse(cache));
    }

    console.log("Redis cache MISS: menumain");
    await redis.set("menumain", JSON.stringify(menumain), "EX", 60);


    res.json(menumain);
  } catch (err) {
    console.error("Redis error:", err);
    res.status(500).json({ message: "Redis error" });
  }
});


app.get("/api/categories/snack", async (req, res) => {
  console.log("GET /api/catagories/snack");

  try{
    const cache = await redis.get("menusnack");

    if(cache) {
      console.log("Redis cahce HIT: menusnack");
      return res.json(JSON.parse(cache));
    }

    console.log("Redis cache MISS: menusnack");
    await redis.set("menusnack", JSON.stringify(menusnack), "EX", 60);

    
    res.json(menusnack);
  } catch (err) {
    console.log("Redis error:", err);
    res.status(500).json({ message: "Redis error"});
  }
});

app.get("/api/categories/drink", async (req, res) => {
  try {
    const cache = await redis.get("menudrink");

    if (cache) {
      console.log("Redis cache HIT: menudrink");
      return res.json(JSON.parse(cache));
    }

    console.log("Redis cache MISS: menudrink");
    await redis.set("menudrink", JSON.stringify(menudrink), "EX", 60);

    
    res.json(menudrink);
  } catch (err) {
    console.error("Redis error:", err);
    res.status(500).json({ message: "Redis error" });
  }
});


app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "category" });
});

app.listen(port, () => {
  console.log(`Category service running on port ${port}`);
});

app.get('/api/menumain/:id', (req, res) => {
  const itemId = parseInt(req.params.id)
  const item = menumain.find(item => item.id === itemId)
  if (item) {
    res.json(item)
  } else {
    res.status(404).json({message: 'Item not found'})
  }
})

app.get('/api/menusnack/:id', (req, res) => {
  const itemId = parseInt(req.params.id)
  const item = menusnack.find(item => item.id === itemId)
  if (item) {
    res.json(item)
  } else {
    res.status(404).json({message: 'Item not found'})
  }
})

app.get('/api/menudrink/:id', (req, res) => {
  const itemId = parseInt(req.params.id)
  const item = menudrink.find(item => item.id === itemId)
  if (item) {
    res.json(item)
  } else {
    res.status(404).json({message: 'Item not found'})
  }
})
