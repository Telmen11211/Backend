# Дэлгүүрийн API · BED411

**Оюутан** Тэлмэн · **Код** `b24fm1012` · **Сэдэв** Дэлгүүр (сүүлийн цифр 2)

Node.js, Express, Prisma, PostgreSQL ашигласан электрон барааны каталог. API нь `Category`, `Brand`, `Product`, `Review` гэсэн дөрвөн загвартай. Үндсэн 21 endpoint-ийг Swagger-д баримтжуулсан.

## Асаах

Node.js 20.19+ болон ажиллаж буй PostgreSQL хэрэгтэй. Terminal дээр төслийн `package.json` байгаа хавтсанд орно.

1. PostgreSQL дээр `store_api` нэртэй хоосон database үүсгэнэ. `createdb store_api` командыг эсвэл PostgreSQL-ийн SQL редактор дээр `CREATE DATABASE store_api;` командыг ашиглаж болно.
2. `cp .env.example .env` ажиллуулна. `.env` дахь `DATABASE_URL`-ийн хэрэглэгч, нууц үг, порт, database-ийн нэрийг өөрийн PostgreSQL-ийн тохиргоотой тааруулна.
3. Дараах командыг ажиллуулна.

```sh
npm ci
npm run db:generate
npm run db:migrate
npm run seed
npm start
```

- [Swagger UI](http://127.0.0.1:3000/docs) дээр endpoint сонгоод **Try it out → Execute** дарна.
- [Health](http://127.0.0.1:3000/health) нь `{"status":"ok"}` буцаана.
- Дөрвөн хүснэгтийг харахдаа өөр Terminal дээр `npm run db:studio` ажиллуулна.
- Seed нь 5 ангилал, 6 брэнд, 25 бараа, 60 үнэлгээ бэлдэнэ. Гурван бараа брэндгүй. Дахин ажиллуулахад seed-ийн өгөгдөл давхардахгүй.

## Бараа шүүж харах

```text
GET /products?q=sony&hasBrand=true&minYear=2022&maxYear=2025&inStock=true&sort=price&order=asc&page=1&limit=5
GET /products?categoryId=1&brandId=10003
GET /products?minRating=4
```

- `q` нь барааны нэр эсвэл тайлбараас том, жижиг үсэг ялгалгүй бүтэн дэд мөр хайна. `categoryId`, `brandId`, `hasBrand`, `minYear`, `maxYear`, `inStock`-ийг хослуулж болно.
- `sort`-ын утга нь `name`, `releaseYear`, `price`, `createdAt`. Анхдагч эрэмбэ `createdAt desc`.
- `page` анхдагч утга 1. `limit` анхдагч утга 10, зөвшөөрөгдөх хүрээ 1–50. Жагсаалт бүр `data` болон `meta` буцаана. `meta.total` нь хуудаслахаас өмнөх шүүсэн тоо.
- `minRating` нь тухайн барааны бүх үнэлгээний дундажид үйлчилнэ. Үнэлгээгүй бараа энэ шүүлтүүрт орохгүй. `GET /products/:id`-ийн `averageRating` нь үнэлгээгүй үед `null`.
- `price`-ийг төгрөгөөр бүхэл тоогоор хадгална. `releaseYear` ба `foundedYear` нь 1900-аас ирэх оныг хүртэл байна.

## Холбоос ба устгал

| Устгах мөр | Prisma дүрэм | Яагаад |
| --- | --- | --- |
| Category | `Restrict` | Бараа бүр ангилалтай байх ёстой. Ангилалд бараа байвал `409` буцаана. Барааг өөр ангилалд шилжүүлээд хуучин ангиллыг устгаж болно. |
| Brand | `SetNull` | Брэндийн бүртгэлийг хассан ч барааг каталогт үлдээх хэрэгтэй. PostgreSQL барааны `brandId`-г `null` болгоно. |
| Product | `Cascade` | Үнэлгээ тухайн бараанд хамаардаг тул бараа устахад түүний үнэлгээнүүд хамт устна. |

`Review` дээрх `@@unique([productId, authorName])` нь нэг нэрээр нэг бараанд давхар үнэлгээ оруулахыг PostgreSQL түвшинд хориглоно. Давхардсан `POST` хүсэлт `409` буцаана. Review-ийн `PATCH` нь `rating`, `comment` хоёрыг засна.

## Postman ба хамгаалалт

`postman_collection.json`-ийг **Import** хийгээд коллекцийг бүхэлд нь **Run collection**-оор эхнээс нь ажиллуулна. 83 хүсэлт хариуны HTTP кодыг шалгана. Эхний хавтас туршилтын бичлэг үүсгэж ID-уудыг хадгална. Сүүлийн хавтас гурван устгалтын дүрмийг шалгаад туршилтын өгөгдлийг цэвэрлэнэ. Порт өөрчилбөл `baseUrl` хувьсагчийг засна.

Хамгаалалтын demo хийхдээ Swagger-аас Category → Brand → Product → Review үүсгэнэ. Дараа нь `GET /products` дээр `q`, `inStock`, `sort`, `minRating` ашиглаж үзүүлнэ. Бараатай Category устгахад `409` ирэх, Brand устгахад Product-ийн `brandId` хоосрох, Product устгахад Review хамт устахыг үзүүлнэ.

Хүсэлт `routes` → `middleware` → `controllers` гэсэн дарааллаар явна. Controller өгөгдлийн сантай Prisma-аар ажиллана. Алдаа гарахад `errorHandler` нэг хэлбэрийн JSON хариу буцаана.

## Хязгаарлалт

- Demo API-д хэрэглэгчийн бүртгэл байхгүй. Үнэлгээ бичигчийг хүсэлтэд өгсөн `authorName`-аар тодорхойлно.
- Swagger UI-ийн CSS болон JavaScript-г CDN-ээс татдаг. Интернэтгүй үед [OpenAPI specification](http://127.0.0.1:3000/docs/openapi.yaml)-ийг Postman-д импортлож болно.
- Илгээх материал нь GitHub repository-ийн холбоос. Private repository бол багшийг collaborator-оор нэмнэ.
