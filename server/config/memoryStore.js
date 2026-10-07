const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'dev_store.json');

/**
 * Persistent In-Memory Datastore for New Navnath Electronics & Electricals
 * Persists data to server/data/dev_store.json so user accounts & orders survive server restarts.
 */
class MemoryStore {
  constructor() {
    this.users = [];
    this.products = [];
    this.categories = [];
    this.services = [];
    this.bookings = [];
    this.orders = [];
    this.coupons = [];
    this.reviews = [];
    this.isSeeded = false;

    this.loadFromDisk();
  }

  loadFromDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        if (raw) {
          const data = JSON.parse(raw);
          this.users = data.users || [];
          this.products = data.products || [];
          this.categories = data.categories || [];
          this.services = data.services || [];
          this.bookings = data.bookings || [];
          this.orders = data.orders || [];
          this.coupons = data.coupons || [];
          this.reviews = data.reviews || [];
          if (this.users.length > 0 || this.products.length > 0) {
            this.isSeeded = true;
          }
          console.log(`🗄️ [Local Database] Loaded ${this.users.length} users and ${this.products.length} products from persistent disk storage.`);
        }
      }
    } catch (err) {
      console.warn('⚠️ Could not load dev_store.json from disk:', err.message);
    }
  }

  saveToDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data = {
        users: this.users,
        products: this.products,
        categories: this.categories,
        services: this.services,
        bookings: this.bookings,
        orders: this.orders,
        coupons: this.coupons,
        reviews: this.reviews
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.warn('⚠️ Could not save dev_store.json to disk:', err.message);
    }
  }

  // Generic helper to generate unique string ID
  generateId() {
    return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  }

  // CRUD for generic collection
  getCollection(name) {
    if (!this[name]) this[name] = [];
    return this[name];
  }

  find(collectionName, filter = {}) {
    const list = this.getCollection(collectionName);
    return list.filter(item => {
      return Object.keys(filter).every(key => {
        if (filter[key] === undefined) return true;
        if (typeof filter[key] === 'object' && filter[key].$regex) {
          const regex = new RegExp(filter[key].$regex, filter[key].$options || 'i');
          return regex.test(item[key] || '');
        }
        return item[key] === filter[key];
      });
    });
  }

  findOne(collectionName, filter = {}) {
    const results = this.find(collectionName, filter);
    return results[0] || null;
  }

  findById(collectionName, id) {
    const list = this.getCollection(collectionName);
    return list.find(item => item._id === id || item.id === id) || null;
  }

  create(collectionName, data) {
    const list = this.getCollection(collectionName);
    const id = this.generateId();
    const doc = {
      _id: id,
      id: id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    list.push(doc);
    this.saveToDisk();
    return doc;
  }

  findByIdAndUpdate(collectionName, id, updateData) {
    const list = this.getCollection(collectionName);
    const idx = list.findIndex(item => item._id === id || item.id === id);
    if (idx === -1) return null;
    const updated = {
      ...list[idx],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    list[idx] = updated;
    this.saveToDisk();
    return updated;
  }

  findByIdAndDelete(collectionName, id) {
    const list = this.getCollection(collectionName);
    const idx = list.findIndex(item => item._id === id || item.id === id);
    if (idx === -1) return null;
    const deleted = list[idx];
    list.splice(idx, 1);
    this.saveToDisk();
    return deleted;
  }

  clearAll() {
    this.users = [];
    this.products = [];
    this.categories = [];
    this.services = [];
    this.bookings = [];
    this.orders = [];
    this.coupons = [];
    this.reviews = [];
    this.isSeeded = false;
    this.saveToDisk();
  }
}

const memoryStore = new MemoryStore();
module.exports = memoryStore;
