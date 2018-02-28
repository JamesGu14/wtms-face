'use strict'

exports.up = function(knex, Promise) {
  
  return knex.schema.alterTable('greetingQueue',(table) => {
    table.integer('childId').unsigned()
    table.foreign('childId').references('child.id')
  })
}

exports.down = function(knex, Promise) {
  
}
