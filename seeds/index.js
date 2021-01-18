const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Testingsite = require('../models/testingsite');

mongoose.connect('mongodb://localhost:27017/corona', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Testingsite.deleteMany({});
    /*  const c = new Testingsite({ title: "new camp" });
     await c.save(); */
    for (let i = 0; i < 50; i++) {
        const random1000cities = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const site = new Testingsite({
            author: '60013f2f2481dc14ecb458a0',
            location: `${cities[random1000cities].city}, ${cities[random1000cities].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'I am sending this letter to all undergraduates as part of an effort to keep the UT community safe as you return to Austin, and inform you that all undergraduate hybrid courses(except in pharmacy and nursing) will be held online through the end of January.Students living in UT residence halls will receive a separate letter, as well.',
            price,
            images: [
                {

                    url: 'https://res.cloudinary.com/dp13t3zft/image/upload/v1610944729/CoronaTestingWebApp/pquyjl27kdvwicgritcg.jpg',
                    filename: 'CoronaTestingWebApp/pquyjl27kdvwicgritcg'
                },
                {

                    url: 'https://res.cloudinary.com/dp13t3zft/image/upload/v1610944729/CoronaTestingWebApp/woxiwdb4rdnvmb59wz8t.jpg',
                    filename: 'CoronaTestingWebApp/woxiwdb4rdnvmb59wz8t'
                },
                {

                    url: 'https://res.cloudinary.com/dp13t3zft/image/upload/v1610944729/CoronaTestingWebApp/iuemfsoti2mfvklffpy6.jpg',
                    filename: 'CoronaTestingWebApp/iuemfsoti2mfvklffpy6'
                },
                {

                    url: 'https://res.cloudinary.com/dp13t3zft/image/upload/v1610944730/CoronaTestingWebApp/p8pji8t0k9hkkmjhxihh.jpg',
                    filename: 'CoronaTestingWebApp/p8pji8t0k9hkkmjhxihh'
                },
                {

                    url: 'https://res.cloudinary.com/dp13t3zft/image/upload/v1610944730/CoronaTestingWebApp/mxtdiz5hs1rzaw4er4a8.jpg',
                    filename: 'CoronaTestingWebApp/mxtdiz5hs1rzaw4er4a8'
                }
            ]
        })
        await site.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});

/* seedDB().then(() => {
    mongoose.connection.close();
}) */