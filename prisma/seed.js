import { prisma } from '../src/db.js';

const categories = ['Утас ба таблет', 'Зөөврийн компьютер', 'Дууны төхөөрөмж', 'Гэрэл зураг', 'Дагалдах хэрэгсэл'];
const brands = [
  ['Apple', 1976], ['Samsung', 1938], ['Sony', 1946],
  ['Lenovo', 1984], ['Logitech', 1981], ['Canon', 1937],
];
const products = [
  ['iPhone 13', 2021, 1650000, 0, 0, '6.1 инчийн OLED дэлгэц'],
  ['iPhone 15', 2023, 2490000, 0, 0, 'USB-C оролт, 48 MP камер'],
  ['iPad Air M2', 2024, 2650000, 0, 0, '11 инчийн таблет'],
  ['Galaxy S24', 2024, 2190000, 0, 1, '6.2 инчийн AMOLED дэлгэц'],
  ['Galaxy Tab S9', 2023, 2290000, 0, 1, 'S Pen дагалдах таблет'],
  ['MacBook Air M2', 2022, 3290000, 1, 0, '13 инчийн хөнгөн зөөврийн компьютер'],
  ['MacBook Pro 14 M3 Pro', 2023, 6490000, 1, 0, 'M3 Pro чип, 14 инчийн дэлгэц'],
  ['ThinkPad X1 Carbon Gen 12', 2024, 5890000, 1, 3, '14 инчийн ажлын зөөврийн компьютер'],
  ['Legion Go', 2023, 2690000, 1, 3, '8.8 инчийн зөөврийн тоглоомын компьютер'],
  ['IdeaPad Slim 5 Gen 9', 2024, 2390000, 1, 3, 'Өдөр тутмын хэрэглээний зөөврийн компьютер'],
  ['AirPods Pro 2', 2022, 849000, 2, 0, 'Дуу чимээ бууруулах чихэвч'],
  ['Galaxy Buds3 Pro', 2024, 699000, 2, 1, 'Утасгүй Bluetooth чихэвч'],
  ['Sony WH-1000XM5', 2022, 1090000, 2, 2, 'Дуу чимээ бууруулах толгойн чихэвч'],
  ['Sony WF-1000XM5', 2023, 849000, 2, 2, 'Авсаархан Bluetooth чихэвч'],
  ['Logitech G Pro X 2 Lightspeed', 2023, 780000, 2, 4, 'Утасгүй тоглоомын чихэвч'],
  ['Canon EOS R50', 2023, 2590000, 3, 5, 'APS-C мэдрэгчтэй камер'],
  ['Canon EOS R8', 2023, 4890000, 3, 5, 'Бүтэн хүрээний мэдрэгчтэй камер'],
  ['Canon EOS R10', 2022, 3290000, 3, 5, 'APS-C мэдрэгчтэй толигүй камер'],
  ['Sony Alpha 7 IV', 2021, 6490000, 3, 2, '33 MP бүтэн хүрээний камер'],
  ['Sony ZV-E10 II', 2024, 3590000, 3, 2, 'Сольдог линзтэй видео камер'],
  ['Logitech MX Master 3S', 2022, 329000, 4, 4, 'Утасгүй хулгана'],
  ['Logitech MX Keys S', 2023, 389000, 4, 4, 'Арын гэрэлтүүлэгтэй гар'],
  ['USB-C 65W цэнэглэгч', 2024, 99000, 4, null, 'Цахилгаан дамжуулах USB-C цэнэглэгч'],
  ['Хөнгөн цагаан суурь', 2023, 69000, 4, null, 'Зөөврийн компьютерийн суурь'],
  ['HDMI 2.1 кабель', 2024, 35000, 4, null, '2 метрийн дэлгэцийн кабель'],
];

const authors = ['Б. Анужин', 'Д. Тэмүүлэн', 'С. Мөнхжин', 'Ц. Энхлэн', 'Л. Билгүүн'];
const comments = [
  'Хэрэглэхэд эвтэйхэн, тайлбартайгаа таарсан.',
  'Үнэ болон чанар нь тохирсон санагдсан.',
  'Савлагаа бүрэн, бүтээгдэхүүн хэвийн ажилласан.',
  'Өдөр тутам хэрэглэхэд тохиромжтой.',
  'Захиалгын мэдээлэл ойлгомжтой байсан.',
];

try {
  await prisma.$transaction(async tx => {
    const categoryIds = [];
    for (const name of categories) {
      const category = await tx.category.upsert({ where: { name }, create: { name }, update: {} });
      categoryIds.push(category.id);
    }

    const brandIds = [];
    for (const [index, [name, foundedYear]] of brands.entries()) {
      const id = 10_001 + index;
      await tx.brand.upsert({ where: { id }, create: { id, name, foundedYear }, update: { name, foundedYear } });
      brandIds.push(id);
    }

    for (const [index, [name, releaseYear, price, category, brand, description]] of products.entries()) {
      const id = 10_001 + index;
      const data = {
        name, releaseYear, price, description, categoryId: categoryIds[category],
        brandId: brand === null ? null : brandIds[brand],
        inStock: index % 6 !== 5,
      };
      await tx.product.upsert({ where: { id }, create: { id, ...data }, update: data });

      const reviewCount = index < 10 ? 3 : 2;
      for (let offset = 0; offset < reviewCount; offset += 1) {
        const authorIndex = (index + offset) % authors.length;
        const authorName = authors[authorIndex];
        const rating = 1 + ((index * 3 + offset * 2) % 5);
        const comment = comments[authorIndex];
        const key = { productId: id, authorName };
        await tx.review.upsert({
          where: { productId_authorName: key },
          create: { ...key, rating, comment },
          update: { rating, comment },
        });
      }
    }
  }, { timeout: 30_000 });
  console.info('Seed ready: 5 categories, 6 brands, 25 products (3 unbranded), 60 reviews');
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
