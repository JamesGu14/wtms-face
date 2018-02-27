'use strict'

exports.up = function(knex, Promise) {
  return knex.schema.createTable('enterHistory', (table) => {
    table.increments()
    table.integer('childId').unsigned()
    table.foreign('childId').references('child.id')
    table.dateTime('enterTime').notNullable()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('enterHistory')
}
