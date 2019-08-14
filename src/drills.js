require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

function itemsWithText(searchTerm) {
    knexInstance
        .select('name', 'price', 'category', 'checked', 'date_added')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

// itemsWithText('tuna');

function paginateItems(pageNumber) {
    const itemsPerPage = 6;
    const offset = itemsPerPage * (pageNumber - 1);
    knexInstance
      .select('name', 'price', 'category', 'checked', 'date_added')
      .from('shopping_list')
      .limit(itemsPerPage)
      .offset(offset)
      .then(result => {
        console.log(result)
      })
  }
  
//   paginateItems(2);

function itemsAfterDate(daysAgo) {
    knexInstance
      .select('name', 'price', 'category', 'checked', 'date_added')
      .from('shopping_list')
      .where(
          'date_added',
           '>',
           knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
      )
      .then(result => {
        console.log(result)
      })
}

// itemsAfterDate(7);

function totalCostOfCategory() {
    knexInstance
        .select('category')
        .sum('price as total')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log(result)
        })
}

totalCostOfCategory('Lunch');