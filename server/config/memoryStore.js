/**
 * In-Memory Fallback Datastore for New Navnath Electronics & Electricals
 * Ensures zero-configuration demo & development testing without requiring MongoDB Atlas immediately.
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
    return updated;
  }

  findByIdAndDelete(collectionName, id) {
    const list = this.getCollection(collectionName);
    const idx = list.findIndex(item => item._id === id || item.id === id);
    if (idx === -1) return null;
    const deleted = list[idx];
    list.splice(idx, 1);
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
  }
}

const memoryStore = new MemoryStore();
module.exports = memoryStore;
