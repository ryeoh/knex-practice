const ShoppingListService = require('../src/shopping-list-service');
const knex = require('knex');

describe(`Shopping list service object`, function() {
    let db;
    let testShoppingList = [
        {
            id: 1,
            name: 'eggs',
            price: 4.55,
            date_added: new Date('2019-08-14T18:44:19.583Z'),
            category: 'Main'
        },
        {
            id: 2,
            name: 'bacon',
            price: 6.00,
            date_added: new Date('2019-08-14T18:44:19.583Z'),
            category: 'Snack'
        },
        {
            id: 3,
            name: 'spinach',
            price: 5.00,
            date_added: new Date('2019-08-14T18:44:19.583Z'),
            category: 'Breakfast'
        }
    ];

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    });

    before(() => db('shopping_list').truncate());

    afterEach(() => db('shopping_list').truncate());

    after(() => db.destroy());
    
    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db
                .into('shopping_list')
                .insert(testShoppingList)
        });

        it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
            const expectedItems = testShoppingList.map(item => ({
                ...item, 
                checked: false
            }));
            return ShoppingListService.getAllItems(db)
                .then(actual => {
                    expect(actual).to.eql(expectedItems)
                })
        })

        it(`getById() resolves an item by id from 'shopping_list' table`, () => {
            const itemId = 3;
            const thirdItem = testItems[itemId - 1];
            return ShoppingListService.getById(db, itemId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: itemId,
                        name: thirdItem.name,
                        date_added: thirdItem.date_added,
                        price: thirdItem.price,
                        category: thirdItem.category,
                        checked: false,
                    })
                })
        })

        it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
            const itemIdToDel = 3;
            return ShoppingListService.deleteItem(db, itemIdToDel)
                .then(() => ShoppingListService.getAllItems(db))
                .then(allItems => {
                    const expectedList = testShoppingList
                        .filter(item => item.id !== itemIdToDel)
                        .map(item => ({
                            ...item,
                            checked: false
                        }));
                    expect(allItems).to.eql(expectedList)
                })
            
        })
        it(`updateItem() updates an item from the 'shopping_list' table`, () => {
            const idOfUpdateItem = 3
            const newItemData = {
                name: 'cereal',
                price: 20.99,
                date_added: new Date(),
                checked: true
            }
            const originalItem = testItems[idOfUpdateItem - 1];
            return ShoppingListService.updateItem(db, idOfUpdateItem, newItemData)
                .then(() => ShoppingListService.getById(db, idOfUpdateItem))
                .then(item => {
                    expect(item).to.eql({
                    id: idOfUpdateItem,
                    ...originalItem,
                    ...newItemData
                    })
                })
        })
    });

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
            return ShoppingListService.getAllItem(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
            const newItem = {
                name: 'lasagna',
                price: 24.00,
                date_added: new Date('2019-07-14T18:44:19.583Z'),
                checked: true,
                category: 'Lunch'
            }
            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        date_added: newItem.date_added,
                        checked: newItem.checked,
                        category: newItem.category
                    })
                })
        })
    })
})