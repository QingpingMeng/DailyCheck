import Dexie from "dexie";

// Database inherits from the Dexie class to handle all database logic for the
// todo app.
// NOTE: For an app like this where the database interactions are pretty
// simple, it's not strictly necessary to subclass Dexie, but I personally
// prefer the subclassing pattern over having a global Dexie database class
// in order to structure all the database logic in a single class.
class HistoryDatabase extends Dexie {
  constructor() {
    // run the super constructor Dexie(databaseName) to create the IndexedDB
    // database.
    super("history");

    // create the todos store by passing an object into the stores method. We
    // declare which object fields we want to index using a comma-separated
    // string; the ++ for the index on the id field indicates that "id" is an
    // auto-incrementing primary key, while the "done" field is just a regukar
    // IndexedDB index.
    this.version(1).stores({
      history: "&date, checked",
    });

    // we can retrieve our todos store with Dexie.table, and then use it as a
    // field on our Database class for convenience; we can now write code such
    // as "this.todos.add(...)" rather than "this.table('todos').add(...)"
    this.history = this.table("history");
  }

  // getTodos retrieves all todos from the todos object store in a defined
  // order; order can be:
  // - forwardOrder to get the todos in forward chronological order
  // - reverseOrder to get the todos in reverse chronological order
  // - unfinishedFirstOrder to get the todos in reverse chronological order
  async getHistory(start, end) {
    // In Dexie, we create queries by chaining methods, such as orderBy to
    // sort by an indexed field, and reverse to reverse the order we retrieve
    // data in. The toArray method returns a promise that resolves to the array
    // of the items in the todos store.
    let history = await this.history
      .where("date")
      .between(start, end)
      .toArray();
    return history;
  }

  // setTodoDone sets whether or not the todo with the ID passed in is done.
  // Returns a promise that resolves if the update is successful.
  async setHistory(history) {
    await this.history.put(history);
  }
}

const db = new HistoryDatabase();
export default db;
