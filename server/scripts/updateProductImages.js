

const path = require('path');
const dotenv = require('dotenv');

// Load server environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const { connectDB, getIsConnected, getUseMemoryStore } = require('../config/db');
const { Product, Category, dbHelper } = require('../models');
const { productImageMap, categoryImageMap } = require('../utils/productImageMap');

const updateCatalogImages = async () => {
  console.log('=======================================================');
  console.log('🔄 [Navnath Image Migration] Starting image update script...');
  console.log('=======================================================');

  try {
    await connectDB();

    if (getUseMemoryStore()) {
      const { seedDatabase } = require('../utils/seedData');
      await seedDatabase();
    }

    console.log(`🗄️  Store Mode: ${getIsConnected() ? 'MongoDB Atlas' : 'Local In-Memory Mode'}`);

    // 1. Update Product Images
    console.log('\n📦 Updating Product Images:');
    let updatedProductsCount = 0;

    for (const [slug, images] of Object.entries(productImageMap)) {
      const product = await dbHelper.findOne('products', Product, { slug });
      if (product) {
        await dbHelper.findByIdAndUpdate('products', Product, product._id || product.id, {
          images
        });
        console.log(`  ✅ [Product] Updated: "${product.name}" -> ${images[0]}`);
        updatedProductsCount++;
      } else {
        console.log(`  ⚠️  [Product] Not found for slug: "${slug}"`);
      }
    }

    // 2. Update Category Images
    console.log('\n📁 Updating Category Images:');
    let updatedCategoriesCount = 0;

    for (const [slug, image] of Object.entries(categoryImageMap)) {
      const category = await dbHelper.findOne('categories', Category, { slug });
      if (category) {
        await dbHelper.findByIdAndUpdate('categories', Category, category._id || category.id, {
          image
        });
        console.log(`  ✅ [Category] Updated: "${category.name}" -> ${image}`);
        updatedCategoriesCount++;
      } else {
        console.log(`  ⚠️  [Category] Not found for slug: "${slug}"`);
      }
    }

    console.log('\n=======================================================');
    console.log(`✨ Migration Complete:`);
    console.log(`   Products Updated: ${updatedProductsCount}/${Object.keys(productImageMap).length}`);
    console.log(`   Categories Updated: ${updatedCategoriesCount}/${Object.keys(categoryImageMap).length}`);
    console.log('=======================================================');
  } catch (error) {
    console.error('Image migration failed:', error);
    process.exitCode = 1;
  }
};

updateCatalogImages();