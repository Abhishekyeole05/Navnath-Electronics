const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const { initialCategories, initialProducts } = require('../utils/catalogData');

async function syncAtlas() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to Atlas successfully!');

  const db = mongoose.connection.db;
  const productsCol = db.collection('products');
  const categoriesCol = db.collection('categories');

  console.log(`Syncing ${initialProducts.length} products to MongoDB Atlas...`);
  let updatedProducts = 0;
  let insertedProducts = 0;

  for (const p of initialProducts) {
    const res = await productsCol.updateOne(
      { slug: p.slug },
      {
        $set: {
          name: p.name,
          images: p.images,
          price: p.price,
          originalPrice: p.originalPrice,
          discount: p.discount,
          stock: p.stock,
          rating: p.rating,
          description: p.description,
          specifications: p.specifications,
          warranty: p.warranty,
          brand: p.brand,
          category: p.category,
          isFeatured: p.isFeatured,
          sku: p.sku
        }
      },
      { upsert: true }
    );
    if (res.upsertedCount > 0) insertedProducts++;
    else if (res.modifiedCount > 0) updatedProducts++;
  }
  console.log(`✅ Products sync complete: ${updatedProducts} updated, ${insertedProducts} inserted.`);

  console.log(`Syncing ${initialCategories.length} categories to MongoDB Atlas...`);
  let updatedCategories = 0;
  for (const c of initialCategories) {
    const res = await categoriesCol.updateOne(
      { slug: c.slug },
      {
        $set: {
          name: c.name,
          image: c.image,
          icon: c.icon,
          description: c.description,
          productCount: c.productCount
        }
      },
      { upsert: true }
    );
    if (res.modifiedCount > 0) updatedCategories++;
  }
  console.log(`✅ Categories sync complete: ${updatedCategories} updated.`);

  // Sample check
  const sample = await productsCol.findOne({ slug: 'samsung-55-inch-crystal-4k-uhd-smart-tv' });
  console.log('\nVerified Sample Product in Atlas:');
  console.log(`Name: ${sample.name}`);
  console.log(`Images: ${JSON.stringify(sample.images)}`);

  await mongoose.disconnect();
  console.log('\nAtlas Catalog Synchronization Complete!');
}

syncAtlas().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
