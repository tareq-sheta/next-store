import type { Product } from "@/types";

export const products: Product[] = [];
// export const products: Product[] = [
//   {
//     id: 1,
//     sellerEmail: "nova@gmail.com",
//     name: "Microsoft Surface Laptop",
//     price: 100,
//     description: "Description for laptop",
//     category: "computers",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857845/Microsoft_Surface_Laptop.png",
//     fav: false,
//     stock: 5,
//     quantity: 1,
//   },
//   {
//     id: 2,
//     sellerEmail: "hamada@example.com",
//     name: "Apple iPhone 14 Pro",
//     price: 200,
//     description: "Description for smartphone",
//     category: "phones",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857844/iPhone_14_Pro.png",
//     fav: false,
//     stock: 30,
//     quantity: 1,
//   },
//   {
//     id: 3,
//     sellerEmail: "hamada@example.com",
//     name: "HUAWEI Tablet",
//     price: 300,
//     description: "Description for tablet",
//     category: "phones",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857843/HUAWEI_Tablet.png",
//     fav: false,
//     stock: 20,
//     quantity: 1,
//   },
//   {
//     id: 4,
//     sellerEmail: "hamada@example.com",
//     name: "HUAWEI Watch Fit 3 Smartwatch",
//     price: 150,
//     description: "Description for smartwatch",
//     category: "smartwatch",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857847/HUAWEI_Watch_Fit_3.png",
//     fav: false,
//     stock: 25,
//     quantity: 1,
//   },
//   {
//     id: 5,
//     sellerEmail: "hamada@example.com",
//     name: "Music Sound MAXI2",
//     price: 100,
//     description:
//       "Music Sound MAXI2 Bluetooth Headphones Around Ear Bluetooth 5.0 – Play Time 22 Hours – Charging 1.5 Hours – Built-in Microphone – Controls on the Gazebo and Adjustable Headband, White",
//     category: "headphones",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857848/white_nomic_headset.png",
//     fav: false,
//     stock: 40,
//     quantity: 1,
//   },
//   {
//     id: 6,
//     sellerEmail: "hamada@example.com",
//     name: "MSI Thin 15 B13VE, Gaming Laptop",
//     price: 2000,
//     description:
//       'MSI Thin 15 B13VE, Gaming Laptop, 15.6" FHD144Hz Display, Intel Core i7-13620H, 16GB RAM, 512GB SSD, NVIDIA RTX4050 6GB Graphics, Win11 Home',
//     category: "computers",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857847/MSI_laptop_B13VE.png",
//     fav: false,
//     stock: 20,
//     quantity: 1,
//   },
//   {
//     id: 7,
//     sellerEmail: "hamada@example.com",
//     name: "MSI Cyborg 15 A13VF",
//     price: 2800,
//     description:
//       "MSI Cyborg 15 A13VF - Intel® Core™ i7-13620H Processor Nvidia RTX 4060-8GB GDDR6 Graphics - 16GB DDR5-512 GB SSD - 15.6-Inch FHD Screen - Translucent Black",
//     category: "computers",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857845/MSI_A13VF_laptop.png",
//     fav: false,
//     stock: 30,
//     quantity: 1,
//   },
//   {
//     id: 8,
//     sellerEmail: "hamada@example.com",
//     name: "aportt Japanese Mouse Pad",
//     price: 300,
//     description:
//       "aportt Japanese Mouse Pad Riverside Full Moon Extended Desk Mat Black Red Large XL Mousepad Non-Slip Rubber Base Stitched Edge Long Keyboard Pad for Desk Gaming Laptop Desktop,31.5×11.8 Inch",
//     category: "gaming",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857850/mouse_pad.png",
//     fav: false,
//     stock: 20,
//     quantity: 1,
//   },
//   {
//     id: 9,
//     sellerEmail: "hamada@example.com",
//     name: "Apple iPhone 16 Pro",
//     price: 150,
//     description:
//       "Apple iPhone 16 Pro (256 GB) - Desert Titanium with Face ID | Tax Paid | 2 Years Official Warranty",
//     category: "phones",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857846/iPhone_16_Pro.png",
//     fav: false,
//     stock: 25,
//     quantity: 1,
//   },
//   {
//     id: 10,
//     sellerEmail: "hamada@example.com",
//     name: "Msi Clutch gm20 Elite Ergonomic Gaming Mouse",
//     price: 100,
//     description:
//       "Msi Clutch gm20 Elite Ergonomic Gaming Mouse USB, RGB Mystic Light, Optical Sensor Paw 3309 6400 Dpi, Switch Up To 20 ml Click, Variable Weight System Black",
//     category: "gaming",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857846/Msi_Gaming_Mouse.png",
//     fav: false,
//     stock: 40,
//     quantity: 1,
//   },
//   {
//     id: 11,
//     sellerEmail: "hamada@example.com",
//     name: "FUJIFILM X-H2",
//     price: 1000,
//     description: "FUJIFILM X-H2 Mirrorless Camera Black",
//     category: "cameras",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857844/FUJIFILM__X-H2.png",
//     fav: false,
//     stock: 50,
//     quantity: 1,
//   },
//   {
//     id: 12,
//     sellerEmail: "hamada@example.com",
//     name: "Canon EOS 250D digital camera",
//     price: 2000,
//     description:
//       "Canon EOS 250D digital camera (24.1 megapixels, 7.7 cm (3 inches) Vari-Angle Display, APS-C sensor, 4K, Full-HD, DIGIC 8, WLAN, Bluetooth) incl. EF-S 18-55mm f/3.5-5,6 III lens black",
//     category: "cameras",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857844/Canon_camera.png",
//     fav: false,
//     stock: 30,
//     quantity: 1,
//   },
//   {
//     id: 13,
//     sellerEmail: "hamada@example.com",
//     name: "Samsung Galaxy Watch7 Smartwatch",
//     price: 3000,
//     description:
//       "Samsung Galaxy Watch7 Smartwatch, Silver, 44mm, Bluetooth, Sleep Coaching, Fitness Tracker, 1 Year Local Warranty",
//     category: "smartwatch",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857847/Galaxy_Watch7.png",
//     fav: false,
//     stock: 20,
//     quantity: 1,
//   },
//   {
//     id: 14,
//     sellerEmail: "hamada@example.com",
//     name: "Samsung Galaxy A05s LTE",
//     price: 1050,
//     description:
//       "Samsung Galaxy A05s LTE, Android Smartphone, Dual SIM Mobile Phone, 4GB RAM,128GB Storage, Light Violet, 1 Year Warranty/Local Version",
//     category: "phones",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857848/Galaxy_A05s_LTE.png",
//     fav: false,
//     stock: 25,
//     quantity: 1,
//   },
//   {
//     id: 15,
//     sellerEmail: "hamada@example.com",
//     name: "SAMSUNG Galaxy Z Fold6",
//     price: 1000,
//     description:
//       "SAMSUNG Galaxy Z Fold6, 12GB RAM, 256GB Storage, Navy, Big Screen, 1 year Seller Warranty (International Version)",
//     category: "phones",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857847/Galaxy_Z_Fold6.png",
//     fav: false,
//     stock: 40,
//     quantity: 1,
//   },
//   {
//     id: 16,
//     sellerEmail: "hamada@example.com",
//     name: "Samsung Galaxy S25 Ultra AI Phone",
//     price: 3500,
//     description:
//       "Samsung Galaxy S25 Ultra AI Phone, 256GB Storage, 12GB RAM, Titanium Silverblue, Android Smartphone, 200MP Camera, S Pen, Long Battery Life",
//     category: "phones",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857848/galaxy_S25.png",
//     fav: false,
//     stock: 50,
//     quantity: 1,
//   },
//   {
//     id: 17,
//     sellerEmail: "hamada@example.com",
//     name: "HONOR Pad X8a",
//     price: 2050,
//     description:
//       "HONOR Pad X8a 4GB RAM 128GB ROM 11 Inch Tablet Wi-Fi with FREE Flip Cover, 8300mAh Battery, Slim Metal Design, Space Grey",
//     category: "phones",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857848/honor_pad.png",
//     fav: false,
//     stock: 30,
//     quantity: 1,
//   },
//   {
//     id: 18,
//     sellerEmail: "hamada@example.com",
//     name: "Samsung Galaxy Tab S10 Ultra",
//     price: 3000,
//     description:
//       "Samsung Galaxy Tab S10 Ultra, AI Tablet, Android Tablet, WIFI, 12GB RAM, 256GB Storage, AMOLED Display, Anti-reflection, Durable, S Pen Included, Moonstone Gray",
//     category: "phones",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857848/galaxy_tab_S10.png",
//     fav: false,
//     stock: 9,
//     quantity: 1,
//   },
//   {
//     id: 19,
//     sellerEmail: "hamada@example.com",
//     name: "Redragon Hylas H260",
//     price: 1250,
//     description:
//       "Redragon Hylas H260 RGB Wired Gaming Headset with Microphone (White)",
//     category: "headphones",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857849/white_headset.png",
//     fav: false,
//     stock: 25,
//     quantity: 1,
//   },
//   {
//     id: 20,
//     sellerEmail: "hamada@example.com",
//     name: "Beexcellent GM3 Gaming Headset",
//     price: 100,
//     description:
//       "Beexcellent GM3 Gaming Headset, 7.1 Surround Sound PS4 Headset with Microphone, For Games, PC Headphones, Heavy Bass, Telescopic, Noise Isolation, Wired, FPS Compatible, LED Light",
//     category: "headphones",
//     image:
//       "https://res.cloudinary.com/dsgozj55b/image/upload/v1771857850/gray_headset.png",
//     fav: false,
//     stock: 40,
//     quantity: 1,
//   },
// ];

export const categories = [
  {
    name: "Phones",
    slug: "phones",
    icon: "https://img.icons8.com/ios/50/000000/iphone.png",
  },
  {
    name: "SmartWatches",
    slug: "smartwatch",
    icon: "https://img.icons8.com/?size=100&id=22193&format=png&color=000000",
  },
  {
    name: "Cameras",
    slug: "cameras",
    icon: "https://img.icons8.com/ios/50/000000/camera.png",
  },
  {
    name: "Headphones",
    slug: "headphones",
    icon: "https://img.icons8.com/ios/50/000000/headphones.png",
  },
  {
    name: "Computers",
    slug: "computers",
    icon: "https://img.icons8.com/ios/50/000000/imac.png",
  },
  {
    name: "Gaming",
    slug: "gaming",
    icon: "https://img.icons8.com/ios/50/000000/controller.png",
  },
];
// export const users: User[] = [
//   {
//     id: 1,
//     userName: "Admin",
//     role: "admin",
//     email: "admin@example.com",
//     password: hashSync("admin@123", 10),
//   },
//   {
//     id: 2,
//     userName: "Hamada",
//     role: "seller",
//     email: "hamada@example.com",
//     password: hashSync("hamada@123", 10),
//   },
//   {
//     id: 3,
//     userName: "Ali",
//     role: "customer",
//     email: "ali@example.com",
//     password: hashSync("ali@123", 10),
//   },
// ];
